import { localGenerator } from "./localGenerator";
import { aiMockGenerator } from "./aiMockGenerator";
import { aiServerGenerator } from "./aiServerGenerator";

export const outlineGenerators = [
  localGenerator,
  aiMockGenerator,
  aiServerGenerator,
] as const;
export type GeneratorId = (typeof outlineGenerators)[number]["id"];
