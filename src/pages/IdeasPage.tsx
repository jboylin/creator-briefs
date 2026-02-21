import IdeaInput from "../components/ideaInput";
import IdeaList from "../components/ideaList";
import useLocalStorageState from "../hooks/useLocalStorageState";
import type { Idea } from "../types/idea";

export default function IdeasPage() {
  const [ideas, setIdeas] = useLocalStorageState<Idea[]>("creatorBriefs.ideas", []);

  function addIdea(text: string) {
    const cleaned = text.trim();
    if (!cleaned) return;

    if (ideas.some((i) => i.text.toLowerCase() === cleaned.toLowerCase())) return;

    const newIdea: Idea = {
      id: crypto.randomUUID(),
      text: cleaned,
      createdAt: Date.now(),
    };

    setIdeas((prev) => [newIdea, ...prev]);
  }

  function deleteIdea(id: string) {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id));
  }

  function clearIdeas() {
    setIdeas([]);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Ideas</h1>
          <p className="text-sm text-gray-600">
            Capture content ideas and keep them for later.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">
            {ideas.length} idea{ideas.length === 1 ? "" : "s"}
          </div>
          <button
            onClick={clearIdeas}
            className="text-xs text-gray-500 hover:text-gray-900 underline"
          >
            Clear all
          </button>
        </div>
      </div>

      <IdeaInput onAdd={addIdea} />
      <IdeaList ideas={ideas} onDelete={deleteIdea} />
    </div>
  );
}