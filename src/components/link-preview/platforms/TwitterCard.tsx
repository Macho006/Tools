import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";
import type { Meta } from "../types";
import { SafeImage, clamp, useSafeMeta } from "./common";

export default function TwitterCard({ meta }: { meta: Meta }) {
  const m = useSafeMeta(meta);

  return (
    <div className="w-full max-w-[720px] rounded-2xl border border-white/10 bg-black/40 p-5 shadow-[0_40px_140px_-90px_rgba(0,0,0,.9)] text-white">
      {/* Tweet header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-sky-500" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold">X User</div>
            <div className="text-white/50 text-sm">@username · 2m</div>
          </div>
          <div className="text-white/60 text-sm">Sharing a link</div>
        </div>
      </div>

      {/* Card */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="aspect-[2/1] bg-zinc-900">
          <SafeImage src={m.image} className="h-full w-full object-cover opacity-95" />
        </div>
        <div className="p-4">
          <div className="text-sm text-white/60">
            {m.domain || "website"}
          </div>
          <div className="mt-1 text-[16px] font-semibold leading-snug">
            {clamp(m.title || "Untitled", 80)}
          </div>
          <div className="mt-1 text-sm text-white/60">
            {clamp(m.description || "No description", 130)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-white/50">
        <span><MessageCircle /></span><span><Repeat2 /></span><span><Heart /></span><span><Share /></span>
      </div>
    </div>
  );
}
