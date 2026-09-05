/**
 * The public origin used by every generated absolute URL.
 *
 * Production currently serves the www host with HTTP 200. Keeping this in one
 * module prevents canonical, structured data and feed URLs from drifting apart.
 */
export const SITE_ORIGIN = 'https://www.dougdesign.com.br';

export function absoluteUrl(pathname: string): string {
  return new URL(pathname.startsWith('/') ? pathname : `/${pathname}`, SITE_ORIGIN).href;
}
