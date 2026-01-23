"use client";

import { useEffect, useState } from "react";
import type { GeneratedIdea } from "@/types/title";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, FileText, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resultCard } from "@/lib/ui";

function styleLabel(s: GeneratedIdea["style"]) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

export function ResultCard({ idea }: { idea: GeneratedIdea }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const t = setTimeout(() => setCopied(false), 1200);
        return () => clearTimeout(t);
    }, [copied]);

    async function onCopy() {
        const text = `${idea.title}\n\n${idea.description}\n\nScore: ${idea.score}/100 • ${styleLabel(idea.style)}`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
    }

    return (
        <Card className={`${resultCard} p-5`}>
            <Button
                variant="ghost"
                size="icon"
                onClick={onCopy}
                className="absolute right-4 top-4 h-10 w-10 rounded-xl border border-white/10 bg-black/20 text-white/70 hover:bg-white/10"
                aria-label="Copy idea"
            >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>

            <div className="pr-14">
                <h3 className="text-xl font-semibold leading-snug text-white">{idea.title}</h3>

                <div className="mt-3 flex items-start gap-2 text-white/55">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-sm leading-relaxed">{idea.description}</p>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <Badge className="rounded-full bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/15">
                        SCORE: {idea.score}/100
                    </Badge>
                    <span className="text-sm text-white/50">↗ {styleLabel(idea.style)}</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(16,185,129,0.9),rgba(59,130,246,0.9))]"
                        style={{ width: `${idea.score}%` }}
                    />
                </div>

            </div>
        </Card>
    );
}
