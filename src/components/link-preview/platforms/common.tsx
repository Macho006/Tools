import { useMemo, useState } from "react";
import type { Meta } from "../types";

export function clamp(s: string, max: number) {
  const t = (s ?? "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1).trimEnd() + "…" : t;
}

export function useSafeMeta(meta: Meta) {
  return useMemo(() => {
    const domain = (meta.domain || "").toLowerCase();
    return {
      url: meta.url || "",
      domain,
      domainLabel: (domain || "website").toUpperCase(),
      title: meta.title || "",
      description: meta.description || "",
      image: meta.image || "",
    };
  }, [meta]);
}

export function SafeImage({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) {
    return (
      <div className={className}>
        <div className="h-full w-full bg-gradient-to-br from-white/10 to-white/5" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt || ""}
      className={className}
      onError={() => setOk(false)}
      loading="lazy"
    />
  );
}
