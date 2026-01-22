import { Heart, MessageSquare, Repeat2 } from "lucide-react";
import type { Meta } from "../types";
import { SafeImage, clamp, useSafeMeta } from "./common";

export default function BlueskyCard({ meta }: { meta: Meta }) {
  const m = useSafeMeta(meta);

  return (
    <div className="w-full max-w-[760px] rounded-2xl border border-white/10 bg-black/35 p-5 text-white shadow-[0_40px_140px_-90px_rgba(0,0,0,.9)]">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-sky-500/80" />
        <div className="min-w-0">
          <div className="font-semibold">Bluesky User</div>
          <div className="text-white/60 text-sm">@handle.bsky.social</div>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="aspect-[1.91/1] bg-zinc-900">
          <SafeImage src={m.image} className="h-full w-full object-cover" />
        </div>
        <div className="p-4">
          <div className="text-xs uppercase tracking-wide text-white/60">
            {m.domain || "website"}
          </div>
          <div className="mt-1 text-[16px] font-semibold leading-snug">
            {clamp(m.title || "Untitled", 90)}
          </div>
          <div className="mt-1 text-sm text-white/60">
            {clamp(m.description || "No description", 140)}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-5 text-white/55">
        <span><MessageSquare /></span><span><Repeat2 /></span><span><Heart /></span><span>⋯</span>
      </div>
    </div>
  );
}
