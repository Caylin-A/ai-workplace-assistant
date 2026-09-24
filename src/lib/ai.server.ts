/**
 * Server-only helper for calling Lovable AI Gateway (Responses API).
 * Streams the response and accumulates it server-side.
 */

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/responses";
const MODEL = "openai/gpt-6-astra";

export type JsonSchema = Record<string, unknown>;

export class AiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function messageForStatus(status: number, body: string): string {
  if (status === 429) return "The AI service is busy right now. Please try again in a moment.";
  if (status === 402)
    return "AI credits have run out for this workspace. Add credits to keep generating.";
  if (status === 401 || status === 403)
    return "The AI service is not available for this app right now.";
  return `The AI service returned an error (${status}). ${body.slice(0, 200)}`;
}

export async function generateStructured<T>(params: {
  instructions: string;
  input: string;
  schemaName: string;
  schema: JsonSchema;
}): Promise<T> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new AiError(500, "AI is not configured for this app.");

  const res = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: MODEL,
      instructions: params.instructions,
      input: params.input,
      stream: true,
      reasoning: { effort: "low" },
      text: {
        format: {
          type: "json_schema",
          name: params.schemaName,
          strict: true,
          schema: params.schema,
        },
      },
    }),
  });

  if (!res.ok || !res.body) {
    const body = await res.text().catch(() => "");
    throw new AiError(res.status, messageForStatus(res.status, body));
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (!payload || payload === "[DONE]") continue;
      try {
        const evt = JSON.parse(payload) as {
          type?: string;
          delta?: string;
          response?: { output_text?: string };
        };
        if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
          text += evt.delta;
        } else if (evt.type === "response.completed" && evt.response?.output_text) {
          if (!text) text = evt.response.output_text;
        }
      } catch {
        // ignore malformed keepalive chunks
      }
    }
  }

  if (!text.trim()) {
    throw new AiError(502, "The AI did not return any content. Please try again.");
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new AiError(502, "The AI response could not be read. Please try again.");
  }
}
