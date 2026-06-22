// Server-side proxy for Nominatim. Browsers forbid overriding the User-Agent
// header on fetch, so geocoding must happen here (not in a client component)
// for the identifying UA required by Nominatim's usage policy to take effect.
// TODO: replace with a real, monitored contact address before relying on this in production.
const NOMINATIM_USER_AGENT = 'Epicure/1.0 (contact@epicure.example.com)';

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
// Clients we can't individually identify (no proxy-set IP header) all share
// this one bucket — kept tight so one unidentified caller can't starve
// everyone else hitting the same bucket.
const UNKNOWN_CLIENT_MAX_REQUESTS = 2;

// In-memory, per-instance limiter. Good enough for a single dev/small deployment;
// a multi-instance production deployment would need a shared store (e.g. Redis).
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const limit =
    key === 'unknown' ? UNKNOWN_CLIENT_MAX_REQUESTS : RATE_LIMIT_MAX_REQUESTS;
  const timestamps = (requestLog.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );

  if (timestamps.length >= limit) {
    requestLog.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  requestLog.set(key, timestamps);
  return false;
}

// Periodically drop entries whose timestamps have all expired, so the map
// doesn't grow forever across the lifetime of a long-running server process.
function pruneExpiredEntries(): void {
  const now = Date.now();
  for (const [key, timestamps] of requestLog) {
    const fresh = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) requestLog.delete(key);
    else if (fresh.length !== timestamps.length) requestLog.set(key, fresh);
  }
}

// Trusts the deployment's reverse proxy/CDN to set this header and strip any
// client-supplied value before it reaches this server. If this app is ever
// deployed without such a proxy in front of it, every request falls back to
// the shared, tightly-limited 'unknown' bucket below rather than a spoofable
// per-request identity.
function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export async function GET(request: Request) {
  // Run occasionally rather than on every request — cheap insurance against
  // unbounded growth without scanning the whole map on every call.
  if (Math.random() < 0.05) pruneExpiredEntries();

  if (isRateLimited(getClientKey(request))) {
    return Response.json({ error: 'Too many requests' }, { status: 429 });
  }

  const address = new URL(request.url).searchParams.get('address');

  if (!address || address.length > 200) {
    return Response.json({ error: 'Invalid address' }, { status: 400 });
  }

  const params = new URLSearchParams({
    q: address,
    format: 'json',
    countrycodes: 'il',
    limit: '1',
  });

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: { 'User-Agent': NOMINATIM_USER_AGENT },
        signal: AbortSignal.timeout(5000),
        // Addresses don't move; cache identical lookups for an hour to reduce
        // load on Nominatim's shared public service.
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) {
      return Response.json({ error: 'Geocoding failed' }, { status: 502 });
    }

    const data: Array<{ lat: string; lon: string }> = await res.json();
    if (!data.length) {
      return Response.json(null);
    }

    return Response.json({
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    });
  } catch {
    return Response.json({ error: 'Geocoding failed' }, { status: 502 });
  }
}
