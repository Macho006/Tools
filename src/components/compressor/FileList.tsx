import type { ImageJob } from "../../types/compressor";
import { FileCard } from "./FileCard";

export function FileList({
  jobs,
  onDownload,
  onRemove,
}: {
  jobs: ImageJob[];
  onDownload: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="mt-6 grid gap-3">
      {jobs.map((j) => (
        <FileCard
          key={j.id}
          job={j}
          onDownload={() => onDownload(j.id)}
          onRemove={() => onRemove(j.id)}
        />
      ))}
    </div>
  );
}
