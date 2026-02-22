export type OutlineInput = {
  title: string;
  ideaText?: string;
  intendedAudience: string;
  goal: string;
  tone: string;
};

export type OutlineResult = {
  outline: string[];
};

export type OutlineGenerator = {
  id: "local" | "ai-mock" | "ai-server";
  label: string;
  generate: (
    input: OutlineInput,
    opts?: { signal?: AbortSignal },
  ) => Promise<OutlineResult>;
};
