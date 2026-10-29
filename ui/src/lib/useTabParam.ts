import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Tab state that lives in the URL, so a tab survives a reload, can be linked
 * to a colleague ("the actions tab of this incident") and responds to Back.
 * The default tab keeps the URL clean by staying out of the query string.
 */
export function useTabParam<T extends string>(allowed: readonly T[], fallback: T, key = "tab") {
  const [params, setParams] = useSearchParams();
  const raw = params.get(key);
  const value = (allowed as readonly string[]).includes(raw ?? "") ? (raw as T) : fallback;
  const set = useCallback(
    (next: T) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next === fallback) p.delete(key);
          else p.set(key, next);
          return p;
        },
        // A tab switch is not a navigation step: Back should leave the page.
        { replace: true },
      );
    },
    [fallback, key, setParams],
  );
  return [value, set] as const;
}
