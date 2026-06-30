export function isValidName(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidAddress(value: string): boolean {
  return value.trim().length > 0;
}

export function isValidPhone(value: string): boolean {
  return /^\+?[0-9\s-]{7,15}$/.test(value.trim());
}

export function isValidCardNumber(value: string): boolean {
  return /^\d{13,19}$/.test(value.replace(/\s/g, ''));
}

export function isValidCvv(value: string): boolean {
  return /^\d{3,4}$/.test(value.trim());
}

// Auto-inserts the "/" as the user types digits, capped at "MM/YYYY".
export function formatExpiryInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 6);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// `value` is the user-typed format: "MM/YYYY".
export function isValidExpiry(value: string): boolean {
  if (!/^\d{2}\/\d{4}$/.test(value)) return false;
  const [month, year] = value.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  const expiry = new Date(year, month, 0, 23, 59, 59);
  return expiry.getTime() >= Date.now();
}
