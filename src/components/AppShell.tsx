import { Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  FileText,
  LayoutDashboard,
  Mail,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email-generator", label: "Email Generator", icon: Mail },
  { to: "/summariser", label: "Meeting Notes Summariser", icon: FileText },
  { to: "/planner", label: "Task Planner", icon: CalendarCheck },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
        >
          <Icon className="size-4" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl bg-pink text-primary">
        <Sparkles className="size-4.5" />
      </span>
      <span className="text-sm leading-tight font-semibold">
        AI Workplace
        <span className="block text-xs font-normal text-muted-foreground">
          Productivity Assistant
        </span>
      </span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col justify-between border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <div className="space-y-8">
          <Brand />
          <NavLinks />
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          AI-generated content may contain errors. Review outputs before use.
        </p>
      </aside>

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
        <Brand />
        <button
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-border p-2"
        >
          <Menu className="size-4" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/30"
            onClick={() => setOpen(false)}
            role="presentation"
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar p-5">
            <div className="mb-8 flex items-center justify-between">
              <Brand />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border p-2"
              >
                <X className="size-4" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function Disclaimer() {
  return (
    <p className="mt-8 rounded-xl border border-border bg-pink-soft px-4 py-3 text-xs leading-relaxed text-secondary-foreground">
      AI-generated content may contain errors. Review and verify outputs before using them for
      workplace decisions or communication.
    </p>
  );
}
