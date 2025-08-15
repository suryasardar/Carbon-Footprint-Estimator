import crypto from "crypto";

// Simple in-memory TTL cache (Map). For production, use Redis.
const store = new Map<string, { value: any; expiresAt: number }>();

export function setCache(key: string, value: any, ttlSeconds = 3600) {
  store.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 });
}

export function getCache<T = any>(key: string): T | null {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value as T;
}

export function imgCacheKey(buf: Buffer) {
  return "img:" + crypto.createHash("sha256").update(buf).digest("hex");
}