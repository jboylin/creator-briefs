import { useEffect, useState } from "react";
import type { Options } from "../types/options";

export default function useLocalStorageState<T>(
  key: string,
  initialValue: T,
  options: Options<T> = {},
) {
  const serialize = options.serialize ?? JSON.stringify;
  const deserialize = options.deserialize ?? JSON.parse;

  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        return initialValue;
      }
      return deserialize(raw);
    } catch (e) {
      console.error("Failed to read from localStorage", e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, serialize(state));
    } catch (e) {
      console.error("Failed to write to localStorage", e);
    }
  }, [key, state, serialize]);

  return [state, setState] as const;
}
