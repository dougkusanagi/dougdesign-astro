# Cover Generation

Use this skill for editorial covers.

## Steps

1. Confirm `featured_image.prompt` and `featured_image.alt`.
2. Generate the cover image using Antigravity's `generate_image` tool first.
3. If `generate_image` is unavailable or fails, run `dougseo cover generate --slug <slug>` (using `--html` if needed) as a fallback.
4. Confirm the file landed in `src/assets/images/posts/`.
