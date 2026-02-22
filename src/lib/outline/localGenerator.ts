import type { OutlineGenerator } from "./types";

export const localGenerator: OutlineGenerator = {
  id: "local",
  label: "Local (fast)",
  async generate(input) {
    const topic = input.ideaText?.trim() || input.title.trim();

    return {
      outline: [
        `Hook: Why "${topic}" matters to ${input.intendedAudience}`,
        `Problem: common pain points around "${topic}"`,
        `Core idea: a clear explanation in a ${input.tone} tone`,
        `Steps / framework: actionable guidance aligned to "${input.goal}"`,
        `Examples: 2–3 practical examples for ${input.intendedAudience}`,
        `Common mistakes + fixes`,
        `CTA: what to do next to achieve "${input.goal}"`,
      ],
    };
  },
};
