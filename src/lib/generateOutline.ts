import type { Brief } from "../types/brief";

export default function generateOutline(
  brief: Pick<
    Brief,
    "goal" | "intendedAudience" | "tone" | "ideaText" | "title"
  >,
): string[] {
  const topic = brief.ideaText?.trim() || brief.title.trim();

  return [
    `Hook: Why "${topic}" matters to ${brief.intendedAudience}`,
    `Problem: common pain points around "${topic}"`,
    `Core idea: a clear explanation in a ${brief.tone} tone`,
    `Steps / framework: actionable guidance aligned to "${brief.goal}"`,
    `Examples: 2–3 practical examples for ${brief.intendedAudience}`,
    `Common mistakes + fixes`,
    `CTA: what to do next to achieve "${brief.goal}"`,
  ];
}
