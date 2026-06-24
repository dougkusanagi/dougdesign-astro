# Publish Or Schedule

Use this skill after audit passes.

## Steps

1. Classify the posts: "Urgente" (publish immediately) or "Evergreen" (schedule staggered).
2. For immediate publication of Urgent posts, run `dougseo publish --slug <slug>`.
3. For Evergreen posts, stagger their schedules with a minimum 12-24h interval using `dougseo schedule --slug <slug> --at <ISO_DATE>`.
4. Add `--commit` and `--push` when the round should update git automatically.
5. Output the list of final public URLs for all posts at the end of the round.
