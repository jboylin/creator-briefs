import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorageState from "../hooks/useLocalStorageState";
import type { Idea } from "../types/idea";
import type { Brief } from "../types/brief";

import { outlineGenerators, type GeneratorId } from "../lib/outline/generators";

import { useBriefStore } from "../stores/useBriefStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [ideas] = useLocalStorageState<Idea[]>("creatorBriefs.ideas", []);

  const { briefs, addBrief } = useBriefStore();

  const [title, setTitle] = useState("");
  const [ideaId, setIdeaId] = useState<string>("");
  const [audience, setAudience] = useState("Creators");
  const [goal, setGoal] = useState("Generate leads");
  const [tone, setTone] = useState("Friendly");

  const [generatorId, setGeneratorId] = useState<GeneratorId>("local");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewOutline, setPreviewOutline] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [abortCtrl, setAbortCtrl] = useState<AbortController | null>(null);

  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === ideaId),
    [ideas, ideaId]
  );

  async function createBrief() {
    setError(null);
    setPreviewOutline(null);

    const cleanedTitle = title.trim();
    const briefTitle = cleanedTitle || (selectedIdea?.text ?? "").trim();
    if (!briefTitle) return;

    const gen = outlineGenerators.find((g) => g.id === generatorId)!;

    const controller = new AbortController();
    setAbortCtrl(controller);
    setIsGenerating(true);

    try {
      const result = await gen.generate(
        {
          title: briefTitle,
          ideaText: selectedIdea?.text,
          intendedAudience: audience,
          goal,
          tone,
        },
        { signal: controller.signal }
      );
      setPreviewOutline(result.outline);

      const brief: Brief = {
        id: crypto.randomUUID(),
        title: briefTitle,
        ideaText: selectedIdea?.text,
        intendedAudience: audience,
        goal,
        tone,
        outline: result.outline,
        createdAt: Date.now(),
      }
      addBrief(brief);
      navigate(`/briefs/${brief.id}`);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError("Something went wrong.");
    } finally {
      setIsGenerating(false);
      setAbortCtrl(null);
    }
  }

  function cancelGeneration() {
    abortCtrl?.abort();
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Create a brief from an idea and generate an outline (AI later).
          </p>
        </div>

        <Link to="/briefs" className="text-sm underline text-gray-900">
          View briefs →
        </Link>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Brief title (optional)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 7 ways to write better TikTok hooks"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          <div className="text-xs text-gray-500 mt-1">
            Leave blank to use the selected idea text.
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Use an existing idea (optional)
          </label>
          <select
            value={ideaId}
            onChange={(e) => setIdeaId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="">— None —</option>
            {ideas
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((i) => (
                <option key={i.id} value={i.id}>
                  {i.text}
                </option>
              ))}
          </select>

          <div className="text-xs text-gray-500 mt-1">
            {ideas.length === 0 ? (
              <>
                No ideas yet — add some on the <Link className="underline" to="/ideas">Ideas</Link> page.
              </>
            ) : selectedIdea ? (
              <>Selected: “{selectedIdea.text}”</>
            ) : (
              <>You can also type a title and skip selecting an idea.</>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Audience
            </label>
            <input
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Goal
            </label>
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Tone
            </label>
            <input
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Generator
          </label>
          <select
            value={generatorId}
            onChange={(e) => setGeneratorId(e.target.value as GeneratorId)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
            disabled={isGenerating}
          >
            {outlineGenerators.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
          <div className="text-xs text-gray-500 mt-1">
            The AI generator is a mock for now and will be slower than the local one.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={createBrief}
            disabled={isGenerating}
            className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-black transition disabled:opacity-60"
          >
            {isGenerating ? "Generating..." : "Create brief"}
          </button>
          {isGenerating ? (
            <button
              onClick={cancelGeneration}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          ) : null}
        </div>

        {error ? <div className="mt-3 text-sm text-red-600">{error}</div> : null}

        {
          previewOutline ? (
            <div className="mt-4">
              <h2 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Preview outline:</h2>
              <ol className="list-decimal pl-5 space-y-2">
                {previewOutline.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          ) : null
        }

        <div className="text-xs text-gray-500">
          You currently have <span className="font-medium">{ideas.length}</span> idea
          {ideas.length === 1 ? "" : "s"} and{" "}
          <span className="font-medium">{briefs.length}</span> brief
          {briefs.length === 1 ? "" : "s"}.
        </div>
      </div>
    </div>
  );
}