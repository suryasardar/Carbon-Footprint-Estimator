import carbonData from "./carbon";

export const canonical = (s: string) => {
  const trimmed = s.toLowerCase().replace(/[^a-z]/g, " ").replace(/\s+/g, " ").trim();
  // If the trimmed string is empty, return a unique, non-colliding key.
  // This prevents inputs like " " or "123" from generating the same cache key.
  if (trimmed === "") {
    return "invalid-dish-name"; // Or any other unique identifier
  }
  return trimmed;
};

export function lookupCarbon(name: string): number {
  const key = canonical(name);
  const data = carbonData as { [key: string]: number };
  return data[key] ?? 0.3; // default fallback for unknowns
}