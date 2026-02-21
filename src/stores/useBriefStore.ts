import useLocalStorageState from "../hooks/useLocalStorageState";
import type { Brief } from "../types/brief";

const STORAGE_KEY = "creatorBriefs.briefs";

export function useBriefStore() {
  const [briefs, setBriefs] = useLocalStorageState<Brief[]>(STORAGE_KEY, []);

  function addBrief(brief: Brief) {
    setBriefs((prev) => [brief, ...prev]);
  }

  function deleteBrief(id: string) {
    setBriefs((prev) => prev.filter((b) => b.id !== id));
  }

  function updateBrief(id: string, updates: Partial<Brief>) {
    setBriefs((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    );
  }

  function getBriefById(id: string | undefined) {
    return briefs.find((b) => b.id === id);
  }

  return {
    briefs,
    addBrief,
    deleteBrief,
    updateBrief,
    getBriefById,
  };
}
