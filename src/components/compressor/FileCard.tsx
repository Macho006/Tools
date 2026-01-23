import type { ImageJob } from "../../types/compressor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, percentSaved } from "@/lib/utils/bytes";

export function FileCard({
  job,
  onDownload,
  onRemove,
}: {
  job: ImageJob;
  onDownload: () => void;
  onRemove: () => void;
}) {
  const saved = job.result ? percentSaved(job.original.size, job.result.size) : 0;

  return (
    <Card className="rounded-2xl border-white/10 bg-black/25 p-4 backdrop-blur">
      <div className="flex gap-4">
        <img
          src={job.previewUrl}
          alt={job.file.name}
          className="h-20 w-20 rounded-xl object-cover ring-1 ring-white/10"
          loading="lazy"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-white/90">{job.file.name}</div>
              <div className="mt-1 text-xs text-white/50">
                {job.original.meta ? (
                  <>
                    {job.original.meta.width}×{job.original.meta.height} • {job.file.type || "unknown"}
                  </>
                ) : (
                  <>Loading meta…</>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {job.status === "processing" && <Badge className="bg-white/10 text-white/80">Compressing…</Badge>}
              {job.status === "done" && <Badge className="bg-white/10 text-white/80">Done</Badge>}
              {job.status === "error" && <Badge className="bg-red-500/20 text-red-200">Error</Badge>}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-white/70 md:grid-cols-4">
            <div>
              <div className="text-white/40">Original</div>
              <div className="font-medium">{formatBytes(job.original.size)}</div>
            </div>

            <div>
              <div className="text-white/40">Compressed</div>
              <div className="font-medium">{job.result ? formatBytes(job.result.size) : "—"}</div>
            </div>

            <div>
              <div className="text-white/40">Saved</div>
              <div className="font-medium">{job.result ? `${saved.toFixed(1)}%` : "—"}</div>
            </div>

            <div>
              <div className="text-white/40">Output</div>
              <div className="font-medium">
                {job.result ? `${job.result.meta.width}×${job.result.meta.height} • ${job.result.meta.type}` : "—"}
              </div>
            </div>
          </div>

          {job.error && <div className="mt-2 text-xs text-red-200">{job.error}</div>}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="rounded-xl bg-white/10 text-white hover:bg-white/15"
              onClick={onDownload}
              disabled={!job.result || job.status !== "done"}
            >
              Download
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
