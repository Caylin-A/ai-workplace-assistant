import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const EmailInput = z.object({
  brief: z.string().min(5),
  tone: z.enum(["formal", "friendly", "persuasive"]),
});

const SummariseInput = z.object({
  mode: z.enum(["text", "url"]),
  content: z.string().min(4),
});

const PlannerInput = z.object({
  tasks: z.string().min(4),
  availableTime: z.string(),
  range: z.enum(["daily", "weekly"]),
});

export type EmailResult = { subject: string; body: string };
export type SummaryResult = {
  summary: string[];
  actionItems: string[];
  decisions: string[];
  deadlines: string[];
};
export type PlanRow = {
  priority: string;
  task: string;
  dateTime: string;
  deadline: string;
};
export type PlanResult = { schedule: PlanRow[]; notes: string };

const stringArray = { type: "array", items: { type: "string" } };

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }): Promise<EmailResult> => {
    const { generateStructured } = await import("./ai.server");
    return generateStructured<EmailResult>({
      instructions: [
        "You are a workplace communication assistant.",
        "Write a complete, ready-to-send business email based strictly on the user's purpose and key points.",
        "Never invent facts, names, dates or commitments that the user did not provide; use neutral placeholders like [Name] when something is genuinely missing.",
        `Tone: ${data.tone}.`,
        "Include a greeting, well-structured paragraphs and a sign-off. Return plain text in the body (no markdown).",
      ].join(" "),
      input: `Purpose and key points:\n${data.brief}`,
      schemaName: "email",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          subject: { type: "string" },
          body: { type: "string" },
        },
        required: ["subject", "body"],
      },
    });
  });

async function fetchUrlText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; ProductivityAssistant/1.0)" },
  });
  if (!res.ok) throw new Error(`Could not open that link (${res.status}).`);
  const html = await res.text();
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 80) throw new Error("That link did not contain readable text.");
  return text.slice(0, 20000);
}

export const summariseNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => SummariseInput.parse(input))
  .handler(async ({ data }): Promise<SummaryResult> => {
    const { generateStructured } = await import("./ai.server");
    let source = data.content;
    if (data.mode === "url") {
      const url = data.content.trim();
      if (!/^https?:\/\//i.test(url)) throw new Error("Please enter a link starting with http.");
      source = await fetchUrlText(url);
    }
    return generateStructured<SummaryResult>({
      instructions: [
        "You summarise meeting notes, articles and web pages for busy professionals.",
        "Base every point strictly on the supplied content; never invent action items, decisions or dates.",
        "If a section has nothing in the content, return an empty array for it.",
        "Keep each bullet short and concrete.",
      ].join(" "),
      input: source.slice(0, 20000),
      schemaName: "meeting_summary",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          summary: stringArray,
          actionItems: stringArray,
          decisions: stringArray,
          deadlines: stringArray,
        },
        required: ["summary", "actionItems", "decisions", "deadlines"],
      },
    });
  });

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }): Promise<PlanResult> => {
    const { generateStructured } = await import("./ai.server");
    return generateStructured<PlanResult>({
      instructions: [
        "You are a productivity planner.",
        `Build a prioritised ${data.range} schedule from the user's real tasks, deadlines and available time.`,
        "Priority must be one of High, Medium or Low.",
        "dateTime is a concrete slot (e.g. 'Mon 09:00-10:30'); deadline echoes the user's deadline or 'None given'.",
        "Respect the stated available time and never schedule more work than fits. Order rows from most to least urgent.",
        "notes is one or two short sentences of scheduling advice.",
      ].join(" "),
      input: `Tasks and deadlines:\n${data.tasks}\n\nAvailable time: ${data.availableTime || "not specified"}\nPlan range: ${data.range}`,
      schemaName: "task_plan",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          schedule: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                priority: { type: "string" },
                task: { type: "string" },
                dateTime: { type: "string" },
                deadline: { type: "string" },
              },
              required: ["priority", "task", "dateTime", "deadline"],
            },
          },
          notes: { type: "string" },
        },
        required: ["schedule", "notes"],
      },
    });
  });
