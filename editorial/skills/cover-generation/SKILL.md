# Cover Generation

Use this skill for editorial covers.

## 1. Prompt Engineering
Before generating the image, ensure your `featured_image.prompt` adheres to these guidelines:
- **Style:** AVOID "cyberpunk", neon-heavy, or generic AI looks. Use clean, standardized styles that match the subject (e.g., "clean editorial flat design", "modern corporate tech", "minimalist", or "high-quality product photography").
- **Content:** The image must relate directly to the main subject of the post.
- **Logos:** If the post is about a famous brand (e.g., Apple, PlayStation, Xbox, Google), the prompt MUST instruct the generator to include the correct, real brand logo. Do not invent fake logos.
- **Text:** Do not include arbitrary or floating text in the image.

## 2. Image Generation
- Generate the cover image using Antigravity's `generate_image` tool using the prompt from Step 1.
- Ensure the resulting image is saved to `src/assets/images/posts/<slug>.jpg` (or `.png`).

## 3. Subagent Quality Assurance
- Once the image is generated, use the `invoke_subagent` tool to spawn a `research` subagent to visually inspect the image file.
- Provide the subagent with the absolute path to the generated image, and ask it to verify:
  1. Does the image avoid looking like cheap, generic "cyberpunk" or overly artificial AI art?
  2. If a brand logo was requested, is it visually accurate and not mangled?
  3. Is the image free of weird, deformed floating text?
- Wait for the subagent's response. If the subagent fails the image, regenerate the image up to 2 times, tweaking the prompt if necessary to simplify it.

## 4. Fallback
- If `generate_image` fails repeatedly, or the quota is hit, or the subagent continues to fail the image, run `dougseo cover generate --slug <slug>` (using `--html` if needed) as a fallback.
- Confirm the file landed correctly in `src/assets/images/posts/`.
