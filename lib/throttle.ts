const bucket = new Map<string, number>();

export function allow(ip: string, minIntervalMs = 5000): boolean {
  const now = Date.now();
  const last = bucket.get(ip) ?? 0;
  if (now - last < minIntervalMs) return false;
  bucket.set(ip, now);
  if (bucket.size > 1000) {
    for (const [k, v] of bucket) {
      if (now - v > 60_000) bucket.delete(k);
    }
  }
  return true;
}
