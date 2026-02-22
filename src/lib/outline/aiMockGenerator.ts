import type { OutlineGenerator } from "./types";

function sleep(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    if (!signal) return;

    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new Error("Aborted"));
    });
  });
}

export const aiMockGenerator: OutlineGenerator = {
  id: "ai-mock",
  label: "AI (mock)",
  async generate(input, opts) {
    const signal = opts?.signal;
    const topic = input.ideaText?.trim() || input.title.trim();
    const steps: string[] = [];

    const lines = [
      `AI Hook: Why "${topic}" matters to ${input.intendedAudience}`,
      `AI Problem: common pain points around "${topic}"`,
      `AI Core idea: a clear explanation in a ${input.tone} tone`,
      `AI Steps / framework: actionable guidance aligned to "${input.goal}"`,
      `AI Examples: 2–3 practical examples for ${input.intendedAudience}`,
      `AI Common mistakes + fixes`,
      `AI CTA: what to do next to achieve "${input.goal}"`,
    ];

    for (const line of lines) {
      await sleep(250, signal);
      steps.push(line);
    }
    return { outline: steps };
  },
};
