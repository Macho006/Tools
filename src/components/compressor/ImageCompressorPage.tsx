"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useImageCompressor } from "@/hooks/useImageCompressor";
import { CompressionSettingsBar } from "./CompressionSettingsBar";
import { Dropzone } from "./Dropzone";
import { FileList } from "./FileList";

export default function ImageCompressorPage() {
  const {
    settings,
    jobs,
    busy,
    addFiles,
    setSettings,
    compressJobs,
    removeJob,
    clearAll,
    downloadOne,
    downloadAllZip,
  } = useImageCompressor();

  return (
    <div className="bg-black">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute left-1/2 top-[-120px] h-[380px] w-[900px] -translate-x-1/2 rounded-full" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 py-14">
        <h1 className="text-center text-5xl font-extrabold tracking-tight text-white">Image Compressor</h1>
        <p className="mt-4 text-center text-white/50">
          Compress JPG, PNG, and WEBP images. Reduce file size by up to 80%.
        </p>

        <Card className="mt-10 rounded-3xl border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          <CompressionSettingsBar settings={settings} onChange={setSettings} />

          <div className="mt-5">
            <Dropzone disabled={busy} onFiles={addFiles} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/50">
              {jobs.length ? `${jobs.length} file(s)` : "No files yet"}
              {busy ? " • processing…" : ""}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                className="rounded-xl bg-white/10 text-white hover:bg-white/15"
                variant="secondary"
                onClick={() => compressJobs()}
                disabled={!jobs.length || busy}
              >
                Recompress all
              </Button>
              <Button
                className="rounded-xl bg-white/10 text-white hover:bg-white/15"
                variant="secondary"
                onClick={downloadAllZip}
                disabled={!jobs.some((j) => j.status === "done")}
              >
                Download ZIP
              </Button>
              <Button
                className="rounded-xl"
                variant="destructive"
                onClick={clearAll}
                disabled={!jobs.length || busy}
              >
                Clear
              </Button>
            </div>
          </div>

          {jobs.length > 0 && (
            <FileList
              jobs={jobs}
              onDownload={(id) => downloadOne(id)}
              onRemove={(id) => removeJob(id)}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
