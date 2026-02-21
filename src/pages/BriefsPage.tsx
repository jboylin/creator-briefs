import { Link } from "react-router-dom";
import { useBriefStore } from "../stores/useBriefStore";

export default function BriefsPage() {
  const { briefs, deleteBrief } = useBriefStore();

  if (briefs.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold mb-4">No Briefs Yet</h1>
        <p className="text-lg text-gray-600 mb-8">Get started by creating your first brief.</p>
        <Link to="/new" className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90">
          Create Brief
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Briefs</h1>
          <p className="text-sm text-gray-500">Manage your content briefs here.</p>
        </div>
        <Link to="/new" className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90">
          Create Brief
        </Link>
      </div>
      <ul className="space-y-4">
        {
          briefs
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((brief) => (
            <li key={brief.id} className="flex justify-between items-center border-b pb-2">
              <div className="min-w-0">
                <div className="text-lg font-medium text-gray-900 truncate">{brief.title}</div>
                <div className="text-xs text-gray-500">
                  Created on {new Date(brief.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Audience: {brief.intendedAudience} | Goal: {brief.goal} | Tone: {brief.tone}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Link
                  to={`/briefs/${brief.id}`}
                  className="text-xs text-blue-500 hover:underline"
                >
                  View
                </Link>
                <button
                  onClick={() => deleteBrief(brief.id)}
                  className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  );
}
