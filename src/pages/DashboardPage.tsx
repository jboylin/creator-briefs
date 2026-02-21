import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useLocalStorageState from "../hooks/useLocalStorageState";
import type { Idea } from "../types/idea";
import type { Brief } from "../types/brief";
import generateOutline from "../lib/generateOutline";

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

  const selectedIdea = useMemo(
    () => ideas.find((i) => i.id === ideaId),
    [ideas, ideaId]
  );

  function createBrief() {
    const cleanedTitle = title.trim();
    const briefTitle = cleanedTitle || (selectedIdea?.text ?? "").trim();
    if (!briefTitle) return;

    const outline = generateOutline({
      title: briefTitle,
      ideaText: selectedIdea?.text,
      intendedAudience: audience,
      goal,
      tone,
    });

    const brief: Brief = {
      id: crypto.randomUUID(),
      title: briefTitle,
      ideaText: selectedIdea?.text,
      intendedAudience: audience,
      goal,
      tone,
      outline,
      createdAt: Date.now(),
    };
    addBrief(brief);
    navigate(`/briefs/${brief.id}`);
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

        <button
          onClick={createBrief}
          className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-black transition"
        >
          Create brief
        </button>

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