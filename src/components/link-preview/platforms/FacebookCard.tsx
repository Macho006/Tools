import type { Meta } from "../types";
import { SafeImage, clamp, useSafeMeta } from "./common";

export default function FacebookCard({ meta }: { meta: Meta }) {
  const m = useSafeMeta(meta);

  return (
    <div className="w-full max-w-[720px] overflow-hidden rounded-2xl border border-black/10 bg-white text-zinc-900 shadow-[0_30px_90px_-60px_rgba(0,0,0,.6)]">
      <div className="aspect-[1.91/1] bg-zinc-100">
        <SafeImage src={m.image} className="h-full w-full object-cover" />
      </div>

      <div className="border-t bg-[#f0f2f5] p-4">
        <div className="text-[12px] uppercase tracking-wide text-zinc-500">
          {m.domainLabel}
        </div>
        <div className="mt-1 text-[18px] font-semibold leading-snug">
          {clamp(m.title || "Untitled", 90)}
        </div>
        <div className="mt-1 text-[14px] text-zinc-600 leading-relaxed">
          {clamp(m.description || "No description", 160)}
        </div>
      </div>
    </div>
  );
}
