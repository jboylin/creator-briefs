import { Link, useParams } from "react-router-dom";
import { useBriefStore } from "../stores/useBriefStore";
import { useState } from "react";

export default function BriefDetailPage() {
  const { id } = useParams();
  const { getBriefById, updateBrief } = useBriefStore();
  const brief = getBriefById(id);


  const [isEditing, setIsEditing] = useState(false);

  const [draftTitle, setDraftTitle] = useState(brief?.title || "");
  const [draftAudience, setDraftAudience] = useState(brief?.intendedAudience || "");
  const [draftGoal, setDraftGoal] = useState(brief?.goal || "");
  const [draftTone, setDraftTone] = useState(brief?.tone || "");

  function saveEdits() {
    if (!brief) return;
    updateBrief(brief.id, {
      title: draftTitle.trim() || brief.title,
      intendedAudience: draftAudience.trim() || brief.intendedAudience,
      goal: draftGoal.trim() || brief.goal,
      tone: draftTone.trim() || brief.tone,
    });
    setIsEditing(false);
  }

  async function copyOutline() {
    if (!brief) return;
    const text = 
      `${brief.title}\n\n` +
    `Audience: ${brief.intendedAudience}\nGoal: ${brief.goal}\nTone: ${brief.tone}\n\n` +
    brief.outline.map((x, i) => `${i + 1}. ${x}`).join("\n");

    await navigator.clipboard.writeText(text);

    alert("Outline copied to clipboard!");
  }

  if (!brief) {
    return (
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">Brief not found</h1>
        <Link to="/briefs" className="text-sm underline text-gray-900">
          Back to briefs
        </Link>
      </div>
    );
  }

  if(isEditing) {
    return (
      <div>
        <div className="flex flex-col gap-4 mb-6">
          <input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={draftAudience}
            onChange={(e) => setDraftAudience(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Intended Audience"
          />
          <input
            value={draftGoal}
            onChange={(e) => setDraftGoal(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Goal"
          />
          <input
            value={draftTone}
            onChange={(e) => setDraftTone(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
            placeholder="Tone"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={saveEdits}
            className="text-sm px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-black"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="text-sm px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-gray-900 truncate">{brief.title}</h1>
            <p className="text-sm text-gray-600">
              Audience: {brief.intendedAudience} • Goal: {brief.goal} • Tone: {brief.tone}
            </p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={copyOutline}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Copy Outline
          </button>
          <Link to="/briefs" className="text-sm underline text-gray-900">
            Back
          </Link>
        </div>

        {brief.ideaText ? (
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">Idea</div>
            <div className="text-sm text-gray-800 bg-gray-50 border border-gray-100 rounded-lg p-3">
              {brief.ideaText}
            </div>
          </div>
        ) : null}

        <div>
          <div className="text-xs uppercase tracking-wide text-gray-500 mb-2">Outline</div>
          <ol className="list-decimal pl-5 space-y-2">
            {brief.outline.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-800">
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
}