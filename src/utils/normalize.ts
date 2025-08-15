

export const canonical = (s: string) => s.toLowerCase().replace(/[^a-z]/g, " ").replace(/\s+/g, " ").trim();

export function lookupCarbon(name: string): number {
  const key = canonical(name);
  return CARBON_KG_PER_SERVING[key] ?? 0.3; // default fallback for unknowns
}