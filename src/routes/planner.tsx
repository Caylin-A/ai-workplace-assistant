import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppShell, Disclaimer, PageHeader } from "@/components/AppShell";
import { OutputToolbar, StateBlock } from "@/components/OutputPanel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { planTasks, type PlanRow } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Turn your tasks, deadlines and available time into a prioritised daily or weekly schedule.",
      },
      { property: "og:title", content: "AI Task Planner" },
      {
        property: "og:description",
        content: "Build a prioritised daily or weekly work schedule with AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [availableTime, setAvailableTime] = useState("");
  const [range, setRange] = useState<"daily" | "weekly">("daily");
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    if (tasks.trim().length < 4) {
      setError("List at least one task with its deadline.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { tasks, availableTime, range } });
      setRows(result.schedule);
      setNotes(result.notes);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (index: number, key: keyof PlanRow, value: string) =>
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [key]: value } : r)));

  return (
    <AppShell>
      <PageHeader
        title="AI Task Planner"
        description="Enter your tasks, deadlines and available time to get a prioritised schedule you can edit."
      />

      <div className="space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Your workload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="tasks">Tasks and deadlines</Label>
              <Textarea
                id="tasks"
                rows={8}
                placeholder={
                  "e.g.\nFinish Q3 report — due Friday\nPrep client demo — due Wednesday 2pm\nReview two design files — no fixed deadline"
                }
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="time">Available time</Label>
                <Input
                  id="time"
                  placeholder="e.g. 5 hours a day, 9am–3pm"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Plan range</Label>
                <div className="flex gap-2">
                  {(["daily", "weekly"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRange(r)}
                      className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                        range === r
                          ? "border-transparent bg-primary text-primary-foreground"
                          : "border-border bg-card hover:bg-pink-soft"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={onGenerate} disabled={loading} className="w-full sm:w-auto">
              <Sparkles className="size-4" />
              {loading ? "Planning…" : "Generate schedule"}
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base">Prioritised schedule</CardTitle>
            <OutputToolbar
              disabled={rows.length === 0}
              onCopy={() =>
                navigator.clipboard.writeText(
                  rows
                    .map((r) => `${r.priority} | ${r.task} | ${r.dateTime} | due ${r.deadline}`)
                    .join("\n") + (notes ? `\n\n${notes}` : ""),
                )
              }
              onClear={() => {
                setRows([]);
                setNotes("");
                setError(null);
              }}
            />
          </CardHeader>
          <CardContent>
            <StateBlock
              loading={loading}
              error={error}
              empty={rows.length === 0}
              emptyText="Your prioritised, editable schedule will appear here."
            >
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead className="bg-pink-soft text-left">
                      <tr>
                        {["Priority", "Task", "Date/Time", "Deadline", ""].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2.5 text-xs font-semibold tracking-wide uppercase"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={i} className="border-t border-border align-top">
                          {(["priority", "task", "dateTime", "deadline"] as const).map((key) => (
                            <td key={key} className="p-1.5">
                              <Input
                                value={row[key]}
                                onChange={(e) => update(i, key, e.target.value)}
                                className="border-transparent bg-transparent hover:border-border focus-visible:border-border"
                              />
                            </td>
                          ))}
                          <td className="p-1.5">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label="Remove row"
                              onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-card"
                />
              </div>
            </StateBlock>
          </CardContent>
        </Card>
      </div>

      <Disclaimer />
    </AppShell>
  );
}
