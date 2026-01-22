import { MessageSquare, Repeat2, SendHorizontal, ThumbsUp } from "lucide-react";
import type { Meta } from "../types";
import { SafeImage, clamp, useSafeMeta } from "./common";

export default function LinkedInCard({ meta }: { meta: Meta }) {
  const m = useSafeMeta(meta);

  return (
    <div className="w-full max-w-[760px] rounded-2xl border border-white/10 bg-black/40 p-5 text-white shadow-[0_40px_140px_-90px_rgba(0,0,0,.9)]">
      {/* Post header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-white/15" />
        <div className="min-w-0">
          <div className="font-semibold">LinkedIn User</div>
          <div className="text-white/50 text-sm">1h · Edited</div>
        </div>
      </div>

      <div className="mt-4 text-white/90 leading-relaxed">
        Here’s a useful link you might like. <span className="text-white/50">…more</span>
      </div>

      {/* Preview */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white">
        <div className="grid grid-cols-[180px_1fr]">
          <div className="aspect-[1/1] bg-zinc-100">
            <SafeImage src={m.image} className="h-full w-full object-cover" />
          </div>
          <div className="p-4 text-zinc-900">
            <div className="text-[16px] font-semibold leading-snug">
              {clamp(m.title || "Untitled", 85)}
            </div>
            <div className="mt-1 text-sm text-zinc-600">
              {clamp(m.description || "No description", 130)}
            </div>
            <div className="mt-2 text-xs uppercase tracking-wide text-zinc-500">
              {m.domain || "website"}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between text-white/60 text-sm">
        <span><ThumbsUp /> Like</span>
        <span><MessageSquare /> Comment</span>
        <span><Repeat2 /> Repost</span>
        <span><SendHorizontal /> Send</span>
      </div>
    </div>
  );
}
