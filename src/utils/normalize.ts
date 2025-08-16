import carbonData from "./carbon";

export const canonical = (s: string) =>
  s.toLowerCase().replace(/[^a-z]/g, " ").replace(/\s+/g, " ").trim();

export function lookupCarbon(name: string): number {
  const key = canonical(name);
  const data = carbonData as { [key: string]: number };
  return data[key] ?? 0.3; // default fallback for unknowns
}