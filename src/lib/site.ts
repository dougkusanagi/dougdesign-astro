/**
 * The public origin used by every generated absolute URL.
 *
 * Production serves the blog subdomain; the www host is the portfolio. Keeping this in one
 * module prevents canonical, structured data and feed URLs from drifting apart.
 */
export const SITE_ORIGIN = 'https://blog.dougdesign.com.br';

export function absoluteUrl(pathname: string): string {
  return new URL(pathname.startsWith('/') ? pathname : `/${pathname}`, SITE_ORIGIN).href;
}
