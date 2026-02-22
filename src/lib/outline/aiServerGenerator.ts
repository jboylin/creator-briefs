import type { OutlineGenerator } from "./types";

export const aiServerGenerator: OutlineGenerator = {
  id: "ai-server",
  label: "AI (real)",
  async generate(input, opts) {
    const response = await fetch("/api/outline", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      signal: opts?.signal,
    });

    if (!response.ok) {
      const fallback = `Failed to generate outline: ${response.status}`;
      let message = fallback;
      try {
        const data = (await response.json()) as { error?: string };
        const parsed = data?.error?.trim();
        if (parsed) message = parsed;
      } catch {
        // ignore JSON parse errors and use fallback
      }
      throw new Error(message);
    }

    const data = (await response.json()) as { outline: string[] };
    return { outline: data.outline };
  },
};
