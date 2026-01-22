import type { Meta } from "../types";
import { SafeImage, clamp, useSafeMeta } from "./common";

export default function TelegramCard({ meta }: { meta: Meta }) {
  const m = useSafeMeta(meta);

  return (
    <div className="w-full max-w-[740px] rounded-2xl bg-[#7f9fb7] p-6 shadow-[0_40px_140px_-90px_rgba(0,0,0,.9)]">
      {/* Bubble */}
      <div className="rounded-2xl bg-[#eaf7d8] p-5">
        <div className="flex gap-4">
          <div className="w-1.5 rounded-full bg-[#5aa9ff]" />
          <div className="min-w-0 flex-1">
            <div className="text-[#2b74ff] break-all">{m.url}</div>
            <div className="mt-2 text-[#2b74ff] font-semibold">
              {m.domain || "website"}
            </div>
            <div className="mt-1 text-[18px] font-bold text-black">
              {clamp(m.title || "Untitled", 90)}
            </div>
            <div className="mt-1 text-black/80 leading-relaxed">
              {clamp(m.description || "No description", 180)}
            </div>

            <div className="mt-4 overflow-hidden rounded-xl bg-white">
              <div className="aspect-[1.6/1] bg-zinc-100">
                <SafeImage src={m.image} className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="mt-3 flex justify-end text-sm text-green-700">
              12:49 AM ✓✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
