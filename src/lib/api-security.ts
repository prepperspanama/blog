const RATE_LIMIT_WINDOW = 10_000;
const RATE_LIMIT_MAX = 10;

const requestLog = new Map<string, number[]>();

function pruneOld(now: number, timestamps: number[]): number[] {
  const cutoff = now - RATE_LIMIT_WINDOW;
  return timestamps.filter((t) => t > cutoff);
}

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  let timestamps = requestLog.get(ip) || [];
  timestamps = pruneOld(now, timestamps);

  if (timestamps.length >= RATE_LIMIT_MAX) {
    const retryAfter = RATE_LIMIT_WINDOW - (now - timestamps[0]);
    return { allowed: false, retryAfter: Math.ceil(retryAfter / 1000) };
  }

  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return { allowed: true, retryAfter: 0 };
}

export function isValidLat(val: number): boolean {
  return val >= -90 && val <= 90;
}

export function isValidLng(val: number): boolean {
  return val >= -180 && val <= 180;
}

export function getClientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "127.0.0.1";
}
