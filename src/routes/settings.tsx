import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "About this assistant, how your data is handled and responsible AI use guidelines.",
      },
      { property: "og:title", content: "Settings" },
      {
        property: "og:description",
        content: "About, data handling and responsible AI use for this assistant.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

const responsibleAiPoints = [
  "AI outputs can be incomplete, outdated, or incorrect. Review them before using or sending them.",
  "Check important facts, figures, names, and dates against reliable sources.",
  "Avoid entering confidential or sensitive personal information.",
  "You remain responsible for anything you send to colleagues or clients.",
];

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Settings"
        description="Information about this assistant, how your data is handled, and tips for using AI responsibly."
      />

      <div className="space-y-6">
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">About this assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              AI Workplace Productivity Assistant helps professionals automate workplace tasks
              using AI.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Your data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="rounded-xl bg-pink-soft px-4 py-3 text-sm leading-relaxed text-secondary-foreground">
              “There is no account and no database. Nothing you type is stored by this
              application. Everything remains in the current browser session and may disappear
              when the page is refreshed or closed.”
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Responsible AI use</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {responsibleAiPoints.map((point) => (
                <li key={point} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-pink" />
                  {point}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
