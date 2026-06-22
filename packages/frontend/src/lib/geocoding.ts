const TEL_AVIV_BOUNDS = {
  latMin: 31.97,
  latMax: 32.13,
  lonMin: 34.72,
  lonMax: 34.87,
};

export function isInTelAviv(lat: number, lon: number): boolean {
  return (
    lat >= TEL_AVIV_BOUNDS.latMin &&
    lat <= TEL_AVIV_BOUNDS.latMax &&
    lon >= TEL_AVIV_BOUNDS.lonMin &&
    lon <= TEL_AVIV_BOUNDS.lonMax
  );
}

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(
      `/api/geocode?address=${encodeURIComponent(address)}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
