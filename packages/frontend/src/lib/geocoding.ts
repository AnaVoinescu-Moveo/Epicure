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
        headers: { 'User-Agent': 'Epicure/1.0' },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;
    const data: Array<{ lat: string; lon: string }> = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}
