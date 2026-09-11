# Cody Peterson — author website

The source for Cody-Peterson.com. Built with Astro, with static public pages and
existing Cloudflare handlers for signed-book checkout and order notifications.

## Start here

- Broader research and career workspace: `/home/user/projects/cody-research`
- Current website handoff: [HANDOFF.md](HANDOFF.md)
- Current direction: [website brief](../../cody-research/briefs/WEBSITE_REVAMP_2026-09-05.md)
- Public bibliography: `src/data/publications.ts`

Cody explicitly authorized redesign and deployment in the September 5, 2026
website conversation. The current release centers the Homeric research and its
connection to writing, AI-assisted inquiry, and Seba. Keep submitted manuscripts, anonymous review
links, private datasets, and editorial correspondence out of `src/` and `public/`.
Read the shared career direction before changing professional or publication
status. “Iron Thūmos” was published online 9 September 2026 (DOI 10.1080/19342039.2026.2670265). Its author page points readers to the publisher for full text and PDF.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Writing, research tools, lectures, and a life behind the work |
| `/research/` | Questions, methods, bibliography, and research programmes |
| `/book/` | Book description, existing endorsements, and signed-copy orders |
| `/videos/` | Lecture and workshop archive; URL preserved |
| `/media/` | Interviews, podcasts, and invitations |
| `/about/` | Short professional biography and the first-person memoir |

Pre-existing scholarship and document pages in `public/` belong to separate
work. Preserve them. Do not include or remove them casually in a future release.

## Local development and review

With Node and npm installed:

```sh
npm ci
npm run dev
```

Build the existing project:

```sh
npm run build
```

For a static, loopback-only review of the already built pages:

```sh
./scripts/preview-local.sh
```

Then visit `http://127.0.0.1:4325/`. An optional first argument selects another
port. Stop the server with Ctrl-C. Python 3 is the only dependency for this
preview. It serves `dist/` and does not run the Worker or payment handlers.
Forms and external links still point to their normal destinations; do not
submit them while doing a read-only preview.

The existing `npm run preview` invokes Wrangler. It is not the static preview
above. Payment code, Wrangler configuration, package versions, and the lockfile
were retained in this revision. Do not run the deploy script without Cody's
explicit direction and the applicable release checks.

## Content and design

The site uses an ink-and-sandstone palette with a light reading section,
Fraunces and Newsreader, and the existing photographs and social preview image. Shared layout/navigation are in
`src/layouts/Base.astro`; shared styles are in `src/styles/global.css`.
`src/components/Papers.astro` reads the public bibliography for both the homepage
and research page, so publication status is maintained in one place.
