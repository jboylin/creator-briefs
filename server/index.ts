import "dotenv/config";
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5";
const client = new OpenAI({ apiKey });

type OutlineInput = {
  title: string;
  ideaText?: string;
  intendedAudience: string;
  goal: string;
  tone: string;
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/outline", async (req, res) => {
  try {
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY is missing in server environment" });
    }

    const input = req.body as OutlineInput;

    if (!input.title || !input.intendedAudience || !input.goal || !input.tone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const aiResponse = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You are an expert content strategist. Generate a concise content outline. " +
            "Return ONLY valid JSON that matches the provided schema.",
        },
        {
          role: "user",
          content: [
            `Title: ${input.title}`,
            input.ideaText ? `Idea: ${input.ideaText}` : undefined,
            `Intended audience: ${input.intendedAudience}`,
            `Goal: ${input.goal}`,
            `Tone: ${input.tone}`,
            "",
            "Generate 7–10 bullet points for the outline. Keep each bullet short and actionable.",
          ]
            .filter(Boolean)
            .join("\n"),
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "creator_briefs_outline",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              outline: {
                type: "array",
                items: { type: "string" },
                minItems: 7,
                maxItems: 10,
              },
            },
            required: ["outline"],
          },
        },
      },
    });

    const raw = aiResponse.output_text;
    const parsed = JSON.parse(raw) as { outline: string[] };

    if (!Array.isArray(parsed.outline)) {
      return res.status(500).json({ error: "Invalid response format" });
    }

    res.json({ outline: parsed.outline });
  } catch (err: unknown) {
    const msg =
      err instanceof Error && err.name === "SyntaxError"
        ? "Model returned invalid JSON"
        : err instanceof Error
          ? err.message
          : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(
    `Server running on port ${port}, visit http://localhost:${port}/`,
  );
});
