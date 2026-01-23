import type { CompressionSettings, MaxWidthPreset, OutputFormat } from "../../types/compressor";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const widthOptions: Array<{ label: string; value: MaxWidthPreset }> = [
  { label: "Original", value: 0 },
  { label: "768px", value: 768 },
  { label: "1024px", value: 1024 },
  { label: "1280px (HD)", value: 1280 },
  { label: "1920px (Full HD)", value: 1920 },
  { label: "2560px (2K)", value: 2560 },
  { label: "3840px (4K)", value: 3840 },
];

const outputOptions: Array<{ label: string; value: OutputFormat }> = [
  { label: "Auto (PNG → WEBP)", value: "auto" },
  { label: "Keep original", value: "keep" },
  { label: "WEBP", value: "webp" },
  { label: "JPEG", value: "jpeg" },
  { label: "PNG", value: "png" },
];

function SettingBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur">
      {children}
    </div>
  );
}

export function CompressionSettingsBar({
  settings,
  onChange,
}: {
  settings: CompressionSettings;
  onChange: (p: Partial<CompressionSettings>) => void;
}) {
  return (
    <Card className="w-full overflow-hidden rounded-3xl border-white/10 bg-black/30 p-4 backdrop-blur">
      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white/90">Compression Settings</div>
          <div className="mt-1 text-xs text-white/50">JPG / PNG / WEBP</div>
        </div>

        <div className="min-w-0">
          <div className="grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">

            <SettingBox>
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-white/80">Quality</div>
                <div className="text-sm tabular-nums text-white/90">{settings.quality}%</div>
              </div>
              <div className="mt-3">
                <Slider
                  value={[settings.quality]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(v) => onChange({ quality: v[0] })}
                />
              </div>
            </SettingBox>


            <SettingBox>
              <div className="text-sm font-medium text-white/80">Max Width</div>
              <div className="mt-2 min-w-0">
                <Select
                  value={String(settings.maxWidth)}
                  onValueChange={(v) => onChange({ maxWidth: Number(v) as any })}
                >
                  <SelectTrigger className="h-10 w-full min-w-0 rounded-2xl border-white/10 bg-black/35 text-white">
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black text-white">
                    {widthOptions.map((o) => (
                      <SelectItem key={o.value} value={String(o.value)}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SettingBox>


            <SettingBox>
              <div className="text-sm font-medium text-white/80">Output</div>
              <div className="mt-2 min-w-0">
                <Select value={settings.output} onValueChange={(v) => onChange({ output: v as OutputFormat })}>
                  <SelectTrigger className="h-10 w-full min-w-0 rounded-2xl border-white/10 bg-black/35 text-white">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-black text-white">
                    {outputOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </SettingBox>
          </div>
        </div>
      </div>
    </Card>
  );
}
