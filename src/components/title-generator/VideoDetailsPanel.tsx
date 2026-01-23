"use client";

import type { ContentStyle } from "@/types/title";
import { Youtube, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    panel,
    panelHeader,
    panelTitle,
    panelSubtle,
    input,
    primaryBtn,
    softDivider,
    toggle,
} from "@/lib/ui";

const STYLES: Array<{ key: ContentStyle; label: string }> = [
    { key: "all", label: "All" },
    { key: "tutorial", label: "Tutorial" },
    { key: "listicle", label: "Listicle" },
    { key: "story", label: "Story" },
    { key: "clickbait", label: "Clickbait" },
    { key: "negative", label: "Negative" },
    { key: "comparison", label: "Comparison" },
    { key: "question", label: "Question" },
];

export function VideoDetailsPanel(props: {
    topic: string;
    setTopic: (v: string) => void;
    style: ContentStyle;
    setStyle: (v: ContentStyle) => void;
    onGenerate: () => void;
    loading: boolean;
    canGenerate: boolean;
}) {
    return (
        <Card className={panel}>
            <CardHeader className="p-0">
                <div className={panelHeader}>
                    <div className="flex items-center gap-3">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/12 ring-1 ring-white/10">
                            <Youtube className="h-5 w-5 text-red-400" />
                        </span>
                        <div>
                            <div className={panelTitle}>Video Details</div>
                            <div className="text-xs text-white/45">
                                Topic & style settings
                            </div>
                        </div>
                    </div>
                </div>
            </CardHeader>
            <Separator className={softDivider} />

            <CardContent className="pt-5">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className={panelSubtle}>VIDEO TOPIC</div>
                        <Input
                            value={props.topic}
                            onChange={(e) => props.setTopic(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") props.onGenerate();
                            }}
                            placeholder="e.g. iPhone 15, React JS, Fitness"
                            className={input}
                        />
                        <p className="text-sm text-white/45">
                            Enter your keyword to generate content.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div className="text-xs font-semibold tracking-widest text-white/60">
                            CONTENT STYLE
                        </div>

                        <ToggleGroup
                            type="single"
                            value={props.style}
                            onValueChange={(v) => {
                                if (!v) return;
                                props.setStyle(v as ContentStyle);
                            }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {STYLES.map((s) => (
                                <ToggleGroupItem key={s.key} value={s.key} className={toggle}>
                                    {s.label}
                                </ToggleGroupItem>
                            ))}
                        </ToggleGroup>
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={props.onGenerate}
                            disabled={!props.canGenerate || props.loading}
                            className={primaryBtn}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            {props.loading ? "Generating..." : "Generate Ideas"}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
