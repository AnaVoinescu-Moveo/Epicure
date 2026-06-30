export function formatMMSS(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// "29-03-2022, 11:54"
export function formatOrderDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const pad = (n: number) => String(n).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${day}-${month}-${year}, ${hours}:${minutes}`;
}

export function isOpenNow(
  openingTime: string | null,
  closingTime: string | null,
): boolean {
  if (!openingTime || !closingTime) return false;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const current = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  // Strapi returns time as "HH:MM:SS.sss" — compare only HH:MM:SS
  const open = openingTime.substring(0, 8);
  const close = closingTime.substring(0, 8);
  // If close < open the restaurant spans midnight (e.g. 22:00–02:00)
  return close >= open
    ? current >= open && current <= close
    : current >= open || current <= close;
}
