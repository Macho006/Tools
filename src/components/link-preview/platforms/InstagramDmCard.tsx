import type { Meta } from "../types";
import { SafeImage, clamp, useSafeMeta } from "./common";

export default function InstagramDmCard({ meta }: { meta: Meta }) {
  const m = useSafeMeta(meta);

  return (
    <div className="w-full max-w-[760px] rounded-2xl border border-white/10 bg-black/40 p-6 text-white shadow-[0_40px_140px_-90px_rgba(0,0,0,.9)]">
      <div className="flex justify-end">
        <div className="w-full max-w-[520px] rounded-2xl bg-white/10 p-4">
          <div className="text-sm text-white/70">Sent you a link</div>

          <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-black">
            <div className="aspect-[1.91/1] bg-zinc-900">
              <SafeImage src={m.image} className="h-full w-full object-cover" />
            </div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-wide text-white/60">
                {m.domain || "website"}
              </div>
              <div className="mt-1 font-semibold">
                {clamp(m.title || "Untitled", 85)}
              </div>
              <div className="mt-1 text-sm text-white/60">
                {clamp(m.description || "No description", 120)}
              </div>
            </div>
          </div>

          <div className="mt-2 text-right text-xs text-white/50">Seen</div>
        </div>
      </div>
    </div>
  );
}
