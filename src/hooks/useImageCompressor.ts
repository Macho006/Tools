import { useMemo, useReducer } from "react";
import { nanoid } from "nanoid";
import JSZip from "jszip";

import type { CompressionSettings, ImageJob } from "../types/compressor";
import { readImageMeta } from "@/lib/image/imageMeta";
import { compressImage } from "@/lib/image/compressImage";
import { pLimit } from "@/lib/utils/pLimit";
import { downloadBlob } from "@/lib/utils/download";

type State = {
  settings: CompressionSettings;
  jobs: ImageJob[];
};

type Action =
  | { type: "SET_SETTINGS"; payload: Partial<CompressionSettings> }
  | { type: "ADD_JOBS"; payload: ImageJob[] }
  | { type: "UPDATE_JOB"; id: string; payload: Partial<ImageJob> }
  | { type: "REMOVE_JOB"; id: string }
  | { type: "CLEAR" };

const initialState: State = {
  settings: { quality: 80, maxWidth: 1920, output: "auto" },
  jobs: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case "ADD_JOBS":
      return { ...state, jobs: [...action.payload, ...state.jobs] };
    case "UPDATE_JOB":
      return {
        ...state,
        jobs: state.jobs.map((j) => (j.id === action.id ? { ...j, ...action.payload } : j)),
      };
    case "REMOVE_JOB": {
      const job = state.jobs.find((j) => j.id === action.id);
      if (job) {
        URL.revokeObjectURL(job.previewUrl);
        if (job.result?.url) URL.revokeObjectURL(job.result.url);
      }
      return { ...state, jobs: state.jobs.filter((j) => j.id !== action.id) };
    }
    case "CLEAR":
      state.jobs.forEach((j) => {
        URL.revokeObjectURL(j.previewUrl);
        if (j.result?.url) URL.revokeObjectURL(j.result.url);
      });
      return { ...state, jobs: [] };
    default:
      return state;
  }
}

export function useImageCompressor() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const busy = useMemo(() => state.jobs.some((j) => j.status === "processing"), [state.jobs]);

  const addFiles = async (files: File[]) => {
    const filtered = files.filter((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    const jobs: ImageJob[] = filtered.map((file) => ({
      id: nanoid(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: "idle",
      original: { size: file.size },
    }));

    dispatch({ type: "ADD_JOBS", payload: jobs });

    for (const j of jobs) {
      readImageMeta(j.file)
        .then((meta) => dispatch({ type: "UPDATE_JOB", id: j.id, payload: { original: { ...j.original, meta } } }))
        .catch(() => {});
    }

    await compressJobs(jobs.map((j) => j.id));
  };

  const setSettings = (partial: Partial<CompressionSettings>) => {
    dispatch({ type: "SET_SETTINGS", payload: partial });
  };

  const compressJobs = async (ids?: string[]) => {
    const limit = pLimit(2); 
    const targets = state.jobs.filter((j) => (ids ? ids.includes(j.id) : true));

    await Promise.all(
      targets.map((job) =>
        limit(async () => {
          dispatch({ type: "UPDATE_JOB", id: job.id, payload: { status: "processing", error: undefined } });
          try {
            if (job.result?.url) URL.revokeObjectURL(job.result.url);

            const { blob, meta, fileName } = await compressImage(job.file, state.settings);
            const url = URL.createObjectURL(blob);

            dispatch({
              type: "UPDATE_JOB",
              id: job.id,
              payload: {
                status: "done",
                result: {
                  blob,
                  url,
                  size: blob.size,
                  meta,
                  fileName,
                },
              },
            });
          } catch (e: any) {
            dispatch({
              type: "UPDATE_JOB",
              id: job.id,
              payload: { status: "error", error: e?.message ?? "Compression failed" },
            });
          }
        })
      )
    );
  };

  const removeJob = (id: string) => dispatch({ type: "REMOVE_JOB", id });
  const clearAll = () => dispatch({ type: "CLEAR" });

  const downloadOne = (id: string) => {
    const job = state.jobs.find((j) => j.id === id);
    if (!job?.result) return;
    downloadBlob(job.result.blob, job.result.fileName);
  };

  const downloadAllZip = async () => {
    const zip = new JSZip();
    const ready = state.jobs.filter((j) => j.result?.blob);

    ready.forEach((j, idx) => {
      zip.file(j.result!.fileName || `image-${idx + 1}`, j.result!.blob);
    });

    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, `compressed-images.zip`);
  };

  return {
    settings: state.settings,
    jobs: state.jobs,
    busy,
    addFiles,
    setSettings,
    compressJobs,
    removeJob,
    clearAll,
    downloadOne,
    downloadAllZip,
  };
}
