import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AppShell, Disclaimer, PageHeader } from "@/components/AppShell";
import { EditableField, OutputToolbar, StateBlock } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summariseNotes, type SummaryResult } from "@/lib/ai.functions";

export const Route = createFileRoute("/summariser")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summariser | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn meeting notes, articles or a web link into a summary with action items, decisions and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summariser" },
      {
        property: "og:description",
        content: "Summarise notes and articles into actions, decisions and deadlines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SummariserPage,
});

const sections: { key: keyof SummaryResult; label: string }[] = [
  { key: "summary", label: "Summary" },
  { key: "actionItems", label: "Action Items" },
  { key: "decisions", label: "Decisions" },
  { key: "deadlines", label: "Deadlines" },
];

const emptyOutput = { summary: "", actionItems: "", decisions: "", deadlines: "" };

function toText(list: string[]) {
  return list.length ? list.map((i) => `• ${i}`).join("\n") : "None identified.";
}

function SummariserPage() {
  const run = useServerFn(summariseNotes);
  const [mode, setMode] = useState<"text" | "url">("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [output, setOutput] = useState<Record<string, string>>(emptyOutput);
  const [hasOutput, setHasOutput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    const value = mode === "text" ? content : url;
    if (value.trim().length < 4) {
      setError(mode === "text" ? "Paste some notes to summarise." : "Enter a link to summarise.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { mode, content: value } });
      setOutput({
        summary: toText(result.summary),
        actionItems: toText(result.actionItems),
        decisions: toText(result.decisions),
        deadlines: toText(result.deadlines),
      });
      setHasOutput(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Meeting Notes Summariser"
        description="Paste notes or an article, or drop in a link. Get a clear summary plus action items, decisions and deadlines."
      />

      <div className="space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Source content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex gap-2">
              {(["text", "url"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                    mode === m
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border bg-card hover:bg-pink-soft"
                  }`}
                >
                  {m === "text" ? "Paste text" : "Web link"}
                </button>
              ))}
            </div>

            {mode === "text" ? (
              <div className="space-y-2">
                <Label htmlFor="notes">Meeting notes or article</Label>
                <Textarea
                  id="notes"
                  rows={10}
                  placeholder="Paste your meeting notes or article here…"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}

            <Button onClick={onGenerate} disabled={loading} className="w-full sm:w-auto">
              <Sparkles className="size-4" />
              {loading ? "Summarising…" : "Summarise"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Structured summary</CardTitle>
            <OutputToolbar
              disabled={!hasOutput}
              onCopy={() =>
                navigator.clipboard.writeText(
                  sections.map((s) => `${s.label}\n${output[s.key]}`).join("\n\n"),
                )
              }
              onClear={() => {
                setOutput(emptyOutput);
                setHasOutput(false);
                setError(null);
              }}
            />
          </CardHeader>
          <CardContent>
            <StateBlock
              loading={loading}
              error={error}
              empty={!hasOutput}
              emptyText="Your summary, action items, decisions and deadlines will appear here."
            >
              <div className="grid gap-4 md:grid-cols-2">
                {sections.map((s) => (
                  <EditableField
                    key={s.key}
                    label={s.label}
                    rows={7}
                    value={output[s.key] ?? ""}
                    onChange={(v) => setOutput((prev) => ({ ...prev, [s.key]: v }))}
                  />
                ))}
              </div>
            </StateBlock>
          </CardContent>
        </Card>
      </div>

      <Disclaimer />
    </AppShell>
  );
}
