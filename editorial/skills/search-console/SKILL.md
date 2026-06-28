# Search Console

Use this skill when checking indexation or post-publication health.

## Steps

1. Confirm `GSC_SITE_URL` and one of these auth paths: `GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON_B64` preferred, or `GOOGLE_SEARCH_CONSOLE_ACCESS_TOKEN` as fallback.
2. Run `dougseo search-console inspect --latest 20`.
3. Run `dougseo search-console performance --days 28` for clicks, queries, and pages before writing new SEO content.
4. Prioritize URLs flagged for manual review or indexing requests.
