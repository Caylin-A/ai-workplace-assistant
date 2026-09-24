import { Check, Copy, Eraser, Loader2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function OutputToolbar({
  onCopy,
  onClear,
  disabled,
}: {
  onCopy: () => void;
  onClear: () => void;
  disabled?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled}
        onClick={() => {
          onCopy();
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        {copied ? "Copied" : "Copy"}
      </Button>
      <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={onClear}>
        <Eraser className="size-4" />
        Clear
      </Button>
    </div>
  );
}

export function EditableField({
  label,
  value,
  onChange,
  rows = 6,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {label}
        </span>
      )}
      <Textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="resize-y bg-card"
      />
    </div>
  );
}

export function StateBlock({
  loading,
  error,
  empty,
  emptyText,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty: boolean;
  emptyText: string;
  children: ReactNode;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-14 text-sm text-muted-foreground">
        <Loader2 className="size-5 animate-spin text-pink" />
        Generating with AI…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-6 text-sm text-destructive">
        {error}
      </div>
    );
  }
  if (empty) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }
  return <>{children}</>;
}
