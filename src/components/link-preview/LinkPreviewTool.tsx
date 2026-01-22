import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Globe,
  Link2,
  Loader2,
  AlertTriangle,
  Send,
} from "lucide-react";

import type { Manual, Meta, Platform } from "./types";
import { fetchMetaFrontend, normalizeUrl, domainFromUrl } from "./og";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  FacebookIcon,
  XIcon,
  LinkedInIcon,
  TelegramIcon,
  InstagramIcon,
  BlueskyIcon,
} from "./platforms/PlatformIcons";

import FacebookCard from "./platforms/FacebookCard";
import TwitterCard from "./platforms/TwitterCard";
import LinkedInCard from "./platforms/LinkedInCard";
import TelegramCard from "./platforms/TelegramCard";
import InstagramDmCard from "./platforms/InstagramDmCard";
import BlueskyCard from "./platforms/BlueskyCard";

const PLATFORM_TABS: Array<{ key: Platform; label: string; short: string; Icon: any }> = [
  { key: "facebook", label: "Facebook", short: "FB", Icon: FacebookIcon },
  { key: "twitter", label: "X", short: "X", Icon: XIcon },
  { key: "linkedin", label: "LinkedIn", short: "LI", Icon: LinkedInIcon },
  { key: "telegram", label: "Telegram", short: "TG", Icon: TelegramIcon },
  { key: "instagram", label: "Instagram DM", short: "IG DM", Icon: InstagramIcon },
  { key: "bluesky", label: "Bluesky", short: "BS", Icon: BlueskyIcon },
];

const EMPTY_META: Meta = { url: "", title: "", description: "", image: "", domain: "" };

function clampDomain(d: string) {
  const s = (d || "").trim();
  if (!s) return "";
  return s.length > 32 ? s.slice(0, 31) + "…" : s;
}

export default function LinkPreviewTool() {
  const initialUrl = "https://github.com/Macho006/Tools/tree/muhammaddiyor";

  const [platform, setPlatform] = useState<Platform>("telegram");

  const [urlInput, setUrlInput] = useState(initialUrl);

  const [activeUrl, setActiveUrl] = useState(() => normalizeUrl(initialUrl));

  const [manualEnabled, setManualEnabled] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fetched, setFetched] = useState<Meta>(() => {
    const u = normalizeUrl(initialUrl);
    return u ? { url: u, domain: domainFromUrl(u), title: "", description: "", image: "" } : EMPTY_META;
  });

  const [manual, setManual] = useState<Manual>({ title: "", description: "", image: "" });

  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, { meta: Meta; ts: number }>>(new Map());

  const normalizedDraft = useMemo(() => normalizeUrl(urlInput), [urlInput]);
  const draftDomain = useMemo(() => (normalizedDraft ? domainFromUrl(normalizedDraft) : ""), [normalizedDraft]);
  const canFetch = !!normalizedDraft && !loading;

  const tabsScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = tabsScrollRef.current;
    if (!root) return;
    const btn = root.querySelector<HTMLButtonElement>(`button[data-tab="${platform}"]`);
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [platform]);

  const onFetchClick = useCallback(async () => {
    const u = normalizedDraft;
    if (!u) return;

    setActiveUrl(u);

    const cached = cacheRef.current.get(u);
    if (cached && Date.now() - cached.ts < 10 * 60 * 1000) {
      setFetched(cached.meta);
      setError("");
      setManual({
        title: cached.meta.title || "",
        description: cached.meta.description || "",
        image: cached.meta.image || "",
      });
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError("");

    setFetched((prev) => ({
      ...prev,
      url: u,
      domain: domainFromUrl(u),
    }));

    try {
      const meta = await fetchMetaFrontend(u, abortRef.current.signal);

      setFetched(meta);
      cacheRef.current.set(u, { meta, ts: Date.now() });

      setManual({
        title: meta.title || "",
        description: meta.description || "",
        image: meta.image || "",
      });
    } catch (e: any) {
      setFetched({
        url: u,
        title: "",
        description: "",
        image: "",
        domain: domainFromUrl(u),
      });

      setError(
        e?.message ||
        "Auto-fetch bloklandi (CORS). Manual Override ON qilib title/desc/image ni qo‘lda kiriting."
      );
    } finally {
      setLoading(false);
    }
  }, [normalizedDraft]);

  const meta: Meta = useMemo(() => {
    const baseUrl = activeUrl || normalizedDraft || "";
    const base = fetched.url ? fetched : { ...EMPTY_META, url: baseUrl };
    const domain = base.domain || (baseUrl ? domainFromUrl(baseUrl) : "");

    return {
      url: base.url || baseUrl,
      domain,
      title: (manualEnabled ? manual.title : base.title) || "",
      description: (manualEnabled ? manual.description : base.description) || "",
      image: (manualEnabled ? manual.image : base.image) || "",
    };
  }, [activeUrl, normalizedDraft, fetched, manualEnabled, manual]);

  const Preview = useCallback(() => {
    switch (platform) {
      case "facebook":
        return <FacebookCard meta={meta} />;
      case "twitter":
        return <TwitterCard meta={meta} />;
      case "linkedin":
        return <LinkedInCard meta={meta} />;
      case "telegram":
        return <TelegramCard meta={meta} />;
      case "instagram":
        return <InstagramDmCard meta={meta} />;
      case "bluesky":
        return <BlueskyCard meta={meta} />;
      default:
        return <TelegramCard meta={meta} />;
    }
  }, [platform, meta]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <h1 className="text-center text-2xl sm:text-5xl font-bold pb-3">Social Media Preview</h1>
      <p className="text-center text-[10px] sm:text-sm text-white/60 pb-4">Preview how your website links appear on Facebook, X (Twitter), LinkedIn, Instgarm, Bluesky and Telegram.</p>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
        {/* LEFT */}
        <Card className="rounded-3xl border-white/10 bg-white/[0.03] text-white lg:sticky lg:top-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Globe className="h-5 w-5 text-white/70" />
              Source & Content
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs text-white/60">Website URL</div>

                <Badge className="bg-white/5 text-white/60 hover:bg-white/5">
                  {clampDomain(draftDomain) || "—"}
                </Badge>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                  <Input
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canFetch) onFetchClick();
                    }}
                    className="h-11 rounded-2xl border-white/10 bg-black/20 pl-10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
                    aria-label="Website URL"
                  />
                </div>

                <Button
                  onClick={onFetchClick}
                  disabled={!canFetch}
                  className="h-11 rounded-2xl bg-white text-black hover:bg-white/90 sm:w-[148px]"
                  aria-label="Fetch metadata"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              {error ? (
                <div
                  aria-live="polite"
                  className="flex items-start gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3 text-sm text-amber-200"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4" />
                  <div className="leading-relaxed">{error}</div>
                </div>
              ) : null}
            </div>

            <Separator className="bg-white/10" />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Manual override</div>
                <div className="text-xs text-white/50">Manual editing instead of Auto meta</div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={manualEnabled} onCheckedChange={setManualEnabled} />
                <Label className="text-white/60">{manualEnabled ? "ON" : "OFF"}</Label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid gap-2">
                <div className="text-xs text-white/60">Title</div>
                <Input
                  value={manualEnabled ? manual.title : fetched.title || ""}
                  onChange={(e) => setManual({ ...manual, title: e.target.value })}
                  disabled={!manualEnabled}
                  className="h-11 rounded-2xl border-white/10 bg-black/20 text-white disabled:opacity-60"
                />
              </div>

              <div className="grid gap-2">
                <div className="text-xs text-white/60">Description</div>
                <Textarea
                  value={manualEnabled ? manual.description : fetched.description || ""}
                  onChange={(e) => setManual({ ...manual, description: e.target.value })}
                  disabled={!manualEnabled}
                  className="min-h-[110px] rounded-2xl border-white/10 bg-black/20 text-white disabled:opacity-60"
                />
              </div>

              <div className="grid gap-2">
                <div className="text-xs text-white/60">Image URL</div>
                <Input
                  value={manualEnabled ? manual.image : fetched.image || ""}
                  onChange={(e) => setManual({ ...manual, image: e.target.value })}
                  disabled={!manualEnabled}
                  className="h-11 rounded-2xl border-white/10 bg-black/20 text-white disabled:opacity-60"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT */}
        <Card className="rounded-3xl border-white/10 bg-white/[0.03] text-white">
          <CardHeader className=" overflow-hidden">

            <Tabs value={platform} onValueChange={(v) => setPlatform(v as Platform)}>
              {/* Tablar uchun gorizontal scroll qismi (o'zgarishsiz) */}
              <div className="relative mt-3 w-full min-w-0">
                <div className="pointer-events-none absolute left-0 top-0 h-full w-10 rounded-l-2xl bg-gradient-to-r from-black/50 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 h-full w-10 rounded-r-2xl bg-gradient-to-l from-black/50 to-transparent" />

                <div
                  ref={tabsScrollRef}
                  className="no-scrollbar w-full overflow-x-auto rounded-2xl bg-black/20 p-2 snap-x snap-mandatory"
                >
                  <TabsList className="flex w-max gap-2 bg-transparent p-0">
                    {PLATFORM_TABS.map((t) => (
                      <TabsTrigger
                        key={t.key}
                        value={t.key}
                        data-tab={t.key}
                        className="
                          snap-start shrink-0 whitespace-nowrap
                          rounded-xl px-3 py-2
                          text-white/70 data-[state=active]:bg-white/10 data-[state=active]:text-white
                          focus-visible:ring-2 focus-visible:ring-white/20
                        "
                      >
                        <t.Icon className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">{t.label}</span>
                        <span className="sm:hidden">{t.short}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </Tabs>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <div className="
              relative w-full
              h-[500px] sm:h-[600px] 
              overflow-y-auto overflow-x-hidden
              rounded-2xl border border-white/5 bg-black/10">
              <div className="min-h-full w-full flex items-center justify-center p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={platform}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.16 }}
                    className="w-full flex justify-center"
                  >
                    <Preview />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-6 text-center text-xs text-white/50">
              Preview is an approximation.
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
