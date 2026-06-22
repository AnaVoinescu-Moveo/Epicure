const LOCALE_PREFIX = /^\/(en|he)(?=\/|$)/;

export function stripLocale(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX, '');
  return stripped === '' ? '/' : stripped;
}
