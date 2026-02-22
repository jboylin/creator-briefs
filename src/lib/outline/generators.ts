import { localGenerator } from "./localGenerator";
import { aiMockGenerator } from "./aiMockGenerator";

export const outlineGenerators = [localGenerator, aiMockGenerator] as const;
export type GeneratorId = (typeof outlineGenerators)[number]["id"];
