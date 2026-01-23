"use client";

import type { GeneratedIdea } from "@/types/title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Type, PlaySquare } from "lucide-react";
import { ResultCard } from "./ResultCard";

export function ResultsPanel(props: {
  headerText: string;
  topic: string;
  ideas: GeneratedIdea[];
  loading: boolean;
}) {
  const hasResults = props.ideas.length > 0;
  const showEmpty = !props.loading && !hasResults;

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/30 text-white shadow-none">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <CardHeader className="p-0">
        <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 sm:h-10 sm:w-10">
              <Type className="h-5 w-5 text-white/70" />
            </span>

            <div className="min-w-0">
              <CardTitle className="truncate text-sm font-semibold tracking-wide text-white/90 sm:text-sm">
                {props.headerText}
              </CardTitle>

              <div className="mt-0.5 truncate text-xs text-white/45">
                {props.loading
                  ? "Generating ideas…"
                  : hasResults
                  ? "Copy any title + description with one click"
                  : "Waiting for topic input"}
              </div>
            </div>
          </div>

          {hasResults && !props.loading ? (
            <div className="hidden md:flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                Tip: 45–70 chars works best
              </span>
            </div>
          ) : null}
        </div>
      </CardHeader>

      <Separator className="bg-white/10" />

      <CardContent className="px-4 pt-4 sm:px-6 sm:pt-5">
        <div className="h-[420px] sm:h-[520px]">
          {props.loading ? (
            <ScrollArea className="h-full pr-2 sm:pr-3">
              <div className="space-y-3 sm:space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            </ScrollArea>
          ) : showEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-3xl border border-white/10 bg-white/[0.035] px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 ring-1 ring-white/10">
                <PlaySquare className="h-7 w-7 text-white/50" />
              </div>

              <div className="text-base font-semibold text-white/75 sm:text-lg">
                Enter a topic to get titles & descriptions
              </div>

              <div className="max-w-[360px] text-sm text-white/45">
                Choose a style, then generate 10 high-CTR ideas — score + copy included.
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                {["Macbook Air M3", "React Portfolio", "iPhone 15 camera"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full pr-2 sm:pr-3">
              <div className="space-y-3 sm:space-y-4">
                {props.ideas.map((idea) => (
                  <ResultCard key={idea.id} idea={idea} />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 sm:p-5">
      <div className="h-6 w-3/4 rounded-2xl bg-white/10" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded-2xl bg-white/10" />
        <div className="h-4 w-5/6 rounded-2xl bg-white/10" />
      </div>
      <div className="mt-5 h-2 w-full rounded-full bg-white/10" />
    </div>
  );
}
