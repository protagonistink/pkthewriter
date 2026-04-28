type Bucket = {
  count: number;
  firstSeen: number;
  lastSeen: number;
};

const bucket = new Map<string, Bucket>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const MIN_INTERVAL_MS = 5_000;

export function allow(ip: string): boolean {
  const now = Date.now();
  const current = bucket.get(ip);
  if (!current || now - current.firstSeen > WINDOW_MS) {
    bucket.set(ip, { count: 1, firstSeen: now, lastSeen: now });
    return true;
  }

  if (now - current.lastSeen < MIN_INTERVAL_MS || current.count >= MAX_PER_WINDOW) {
    current.lastSeen = now;
    return false;
  }

  current.count += 1;
  current.lastSeen = now;

  if (bucket.size > 1000) {
    for (const [k, v] of bucket.entries()) {
      if (now - v.lastSeen > WINDOW_MS) bucket.delete(k);
    }
  }

  return true;
}
