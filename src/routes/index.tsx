import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, FileText, Mail } from "lucide-react";
import { AppShell, Disclaimer, PageHeader } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Overview of your AI workplace productivity tools: email generation, meeting notes summarising and task planning.",
      },
      { property: "og:title", content: "Dashboard" },
      {
        property: "og:description",
        content: "Your AI workplace productivity tools in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

const tools = [
  {
    to: "/email-generator",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Generate professional workplace emails.",
  },
  {
    to: "/summariser",
    icon: FileText,
    title: "Meeting Notes Summariser",
    description: "Summarise notes and extract action items, decisions and deadlines.",
  },
  {
    to: "/planner",
    icon: CalendarCheck,
    title: "AI Task Planner",
    description: "Prioritise tasks and generate daily or weekly schedules.",
  },
] as const;

function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard"
        description="Pick a tool to get started. Each assistant works straight from what you type — no setup needed."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(({ to, icon: Icon, title, description }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full shadow-none transition-colors group-hover:bg-pink-soft/60">
              <CardHeader className="pb-3">
                <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-pink text-primary">
                  <Icon className="size-5" />
                </span>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="flex h-full flex-col justify-between gap-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                  Open tool
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Disclaimer />
    </AppShell>
  );
}
