export type MaxWidthPreset = 0 | 768 | 1024 | 1280 | 1920 | 2560 | 3840;

export type OutputFormat = "auto" | "keep" | "jpeg" | "webp" | "png";

export type JobStatus = "idle" | "processing" | "done" | "error";

export type CompressionSettings = {
  quality: number;
  maxWidth: MaxWidthPreset;
  output: OutputFormat;
};

export type ImageMeta = {
  width: number;
  height: number;
  type: string;
};

export type ImageJob = {
  id: string;
  file: File;
  previewUrl: string;

  status: JobStatus;
  error?: string;

  original: {
    size: number;
    meta?: ImageMeta;
  };

  result?: {
    blob: Blob;
    url: string;
    size: number;
    meta: ImageMeta;
    fileName: string;
  };

  progress?: number;
};
