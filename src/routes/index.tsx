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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn a few key points into a polished formal, friendly or persuasive workplace email.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Draft professional workplace emails in seconds with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EmailPage,
});

const tones = [
  { id: "formal", label: "Formal" },
  { id: "friendly", label: "Friendly" },
  { id: "persuasive", label: "Persuasive" },
] as const;

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState<(typeof tones)[number]["id"]>("formal");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (brief.trim().length < 5) {
      setError("Add a few more details about what the email should say.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { brief, tone } });
      setSubject(result.subject);
      setBody(result.body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Smart Email Generator"
        description="Describe the purpose and key points, pick a tone, and get a ready-to-send email you can edit."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Your input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="brief">Purpose and key points</Label>
              <Textarea
                id="brief"
                rows={8}
                placeholder="e.g. Ask the design team to move Thursday's review to Friday 10am because the client feedback is late."
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTone(t.id)}
                    className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                      tone === t.id
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-pink-soft"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <Button onClick={onGenerate} disabled={loading} className="w-full">
              <Sparkles className="size-4" />
              {loading ? "Generating…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Generated email</CardTitle>
            <OutputToolbar
              disabled={!body}
              onCopy={() => navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)}
              onClear={() => {
                setSubject("");
                setBody("");
                setError(null);
              }}
            />
          </CardHeader>
          <CardContent>
            <StateBlock
              loading={loading}
              error={error}
              empty={!body}
              emptyText="Your generated email will appear here, fully editable."
            >
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Subject
                  </span>
                  <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <EditableField label="Body" value={body} onChange={setBody} rows={14} />
              </div>
            </StateBlock>
          </CardContent>
        </Card>
      </div>

      <Disclaimer />
    </AppShell>
  );
}
