# Publication and release state

Updated 10 September 2026. This record supersedes publication and release
instructions in older local handoffs.

“The Iron Thūmos and the Empty Vessel: A Homeric Response to ‘Answer to Job’”
was published online on 9 September 2026 in *Jung Journal: Culture & Psyche*,
20(3), 103–117, DOI [10.1080/19342039.2026.2670265](https://doi.org/10.1080/19342039.2026.2670265).
It is published, not in press or merely accepted. Keep the publisher full-text
and PDF links available on `/iron-thumos/`. Cody's priority is publisher views:
publication-card titles link directly to the DOI; a secondary “Details” link
keeps the internal article page accessible.

The publication release is commit `562d0f08c9313730553b2022f05136b10b9ac036`.
Its live Worker version before these corrections was
`84ae8b24-17b5-426f-a117-9dd0ae4b131c`; retain that exact version as the rollback
target for this repair. The publication branch and these corrections belong on
`main`, the canonical release branch.

## Releasing within Cody's requested task

1. Start with current `main` and confirm its relationship to the live release.
   Review and commit only the intended changes. Preserve unrelated local work.
2. Use a clean worktree. The main working folder also contains local homepage
   edits and unpublished scholarship/document files; these are separate work.
3. Record the current Worker version, settings, bindings, and asset routing.
4. Run `env -u CLOUDFLARE_API_TOKEN npm run deploy`. It runs the release gate
   (scripts/build-release.mjs), which rejects uncommitted tracked changes and
   untracked build inputs, then rebuilds the site before uploading. Since the
   Astro 7 upgrade (2026-10-24), any build leaves `.wrangler/deploy/config.json`
   pointing a bare `wrangler deploy` at that build, so never run a bare
   `wrangler deploy` after a local draft build. `npm run build` remains
   available for local drafts. A bare `wrangler deploy` from a clean checkout
   (the Cloudflare Git build) reads wrangler.jsonc and runs the gate itself.
   Astro builds from wrangler.astro.jsonc; keep its bindings the same.
5. Verify the public pages against the fresh build, confirm protected settings
   and static asset routing are unchanged, and push the reviewed commit to
   `origin main`. A push to `origin main` also deploys it (Cloudflare Git
   build, about 70-90 s).

Do not publish private manuscripts, review links, datasets, or correspondence.
Preserve the existing payment handlers, secrets, dependency lockfile, Person
schema, and bilateral Seba identity links.
