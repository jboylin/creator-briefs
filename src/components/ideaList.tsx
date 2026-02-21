import type { Idea } from "../types/idea";

type Props = {
  ideas: Idea[];
  onDelete: (id: string) => void;
};

export default function IdeaList({ ideas, onDelete }: Props) {
  if (ideas.length === 0) {
    return <p className="text-sm text-gray-500">No ideas yet</p>;
  }

  return (
    <ul className="space-y-4">
      {ideas.map((idea) => (
        <li key={idea.id} className="flex justify-between items-center border-b pb-2">
          {idea.text}
          <div className="text-xs text-gray-500">
            {new Date(idea.createdAt).toLocaleDateString()}
          </div>
          <button
            onClick={() => onDelete(idea.id)}
            className="ml-2 text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </li>
      ))
      }
    </ul>
  );
}