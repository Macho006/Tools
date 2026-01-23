import { useCallback, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

export function Dropzone({
  onFiles,
  disabled,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const pick = () => inputRef.current?.click();

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files || []);
      if (files.length) onFiles(files);
    },
    [disabled, onFiles]
  );

  return (
    <Card
      className={[
        "relative w-full rounded-2xl border border-dashed p-10 text-center",
        "bg-black/20 backdrop-blur",
        dragOver ? "border-white/40" : "border-white/10",
        disabled ? "opacity-60" : "hover:border-white/25",
      ].join(" ")}
      onDragEnter={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setDragOver(false);
      }}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onClick={() => !disabled && pick()}
      onKeyDown={(e) => e.key === "Enter" && !disabled && pick()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) onFiles(files);
          e.currentTarget.value = "";
        }}
      />

      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
        <span className="text-2xl text-white/80">⤴</span>
      </div>

      <div className="text-lg font-semibold text-white/90">Drag & Drop Images (JPG, PNG, WEBP)</div>
      <div className="mt-2 text-sm text-white/50">
        Click to upload • Batch supported
      </div>
    </Card>
  );
}
