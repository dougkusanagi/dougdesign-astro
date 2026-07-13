export const SITE_ORIGIN = 'https://www.dougdesign.com.br';

export function siteUrl(pathname = '/'): string {
  return new URL(pathname, `${SITE_ORIGIN}/`).href;
}
