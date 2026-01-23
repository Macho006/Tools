"use client";

import { useMemo, useState } from "react";
import type { ContentStyle, GeneratedIdea } from "@/types/title";
import { generateIdeas } from "@/lib/idea-generator";
import { VideoDetailsPanel } from "./VideoDetailsPanel";
import { ResultsPanel } from "./ResultsPanel";
import { frame } from "@/lib/ui";

export function TitleGenerator() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState<ContentStyle>("all");
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(false);

  const canGenerate = topic.trim().length >= 2;

  const headerText = useMemo(() => {
    if (!canGenerate) return "Waiting for topic...";
    if (ideas.length === 0) return "Ready to generate";
    return `${ideas.length} Results Found`;
  }, [canGenerate, ideas.length]);

  function onGenerate() {
    if (!canGenerate) return;

    setLoading(true);
    setTimeout(() => {
      const out = generateIdeas({ topic, style, count: 10 });
      setIdeas(out);
      setLoading(false);
    }, 200);
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className={`${frame} p-5`}>
        <div className="grid gap-5 md:grid-cols-2">
          <VideoDetailsPanel
            topic={topic}
            setTopic={setTopic}
            style={style}
            setStyle={setStyle}
            onGenerate={onGenerate}
            loading={loading}
            canGenerate={canGenerate}
          />
          <ResultsPanel headerText={headerText} topic={topic} ideas={ideas} loading={loading} />
        </div>
      </div>
    </div>
  );
}
