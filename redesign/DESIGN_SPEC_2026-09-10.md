# cody-peterson.com redesign — design spec (2026-09-10)

Goal: a writer's personal site that reads as one person's, not a template.
The current site was judged "too AI looking." The fix is voice and plainness.

## Hard rules (violations fail review)
- No eyebrow labels, no numbered sections, no small caps, no uppercase tracking.
- No italic emphasis on the last words of headings. Headings are plain sentences or single words, sentence case.
- No arrow glyphs (→ ↗ ↓) anywhere. Links are underlined words.
- No cards, no bordered boxes, no rounded panels, no box shadows, no gradients, no grain overlay, no fixed background, no dark/light alternating bands.
- No buttons except the mobile menu toggle. Calls to action are underlined links in a sentence.
- No monospace font. No display font. One typeface family for everything.
- No "Colophon", "Vol. I", "Est.", "Typeset in", share button, or folio.
- No new copy. Use redesign/COPY_2026-09-10.md verbatim.

## Type
- Single family: Newsreader (Google Fonts, already loaded; drop Fraunces and IBM Plex Mono from the link tag). Weights 400 and 500, italic 400.
- Body: 1.25rem / 1.6 at ≥900px; 1.125rem / 1.6 below. Measure 62–66ch.
- H1: 2.75rem (2.1rem mobile), weight 500, line-height 1.1, sentence case.
- H2: 1.6rem, weight 500, plain. Generous space above (4rem), little below (1rem).
- Captions: 0.95rem italic, muted ink.
- Links: text colour ink, underline 1px in clay (#8f4632), underline offset 3px; hover: clay text.

## Colour
- Page: paper #f7f3ea. Ink #1a1713. Muted #5e554a. Clay accent #8f4632 (links, hairlines at 25% opacity). Nothing else. No dark sections.

## Layout
- One centred column, 680px, 24px side padding on mobile.
- Photos may break out to 1100px centred. Portrait at the top sits to the right of the name and first paragraphs at ≥1000px (grid 1fr 420px, gap 48px); stacks above the H1 on narrower screens.
- Writing list: year in a 5rem left column, entry text right, 1px hairline between rows (clay at 25%). Book row has a 90px cover image on the right.
- The small truck photo sits inline right of paragraph 3 at ≥700px (float, 200px, square crop via object-fit), stacks below on mobile.
- Header: name left, links right, 64px tall, hairline below; mobile: hamburger with the same five links. Keep skip link and aria.
- Footer: three lines, centred or left, 0.95rem.

## Images
- Use the -1200 variants in srcset for ≤1200px viewports; full for larger. loading="lazy" on everything below the fold; fetchpriority="high" on the portrait. Width/height attributes set.

## Keep
- All routes, JSON-LD, meta/OG, canonical, sitemap, llms.txt generation, redirects, wrangler config. Do not touch wrangler.jsonc or _redirects.
- Base.astro props and page components' data imports.

## Deliverables
- Rewrite src/styles/global.css (new base; remove all unused old rules), src/layouts/Base.astro (header/footer per spec; remove share JS), src/pages/index.astro (from COPY file). Apply the "Other pages" cleanup from the COPY file to about, research, book, videos, media, iron-thumos with minimal content edits.
- `npm run build` must pass with no errors.
- Screenshots: use headless Chrome (google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars --user-data-dir=/tmp/redesign-profile --window-size=1440,4000 --screenshot=...) against a local static server of dist/ (python3 -m http.server in dist on a free port, then http://127.0.0.1:PORT/). Capture desktop (1440) and mobile (430) for /, /about/, /research/, /book/, /videos/, /media/, /iron-thumos/ into /home/user/projects/cody-research/website-review/2026-09-10-redesign/.
- Commit on the current branch redesign/voice-first-20260910 with a clear message. Do NOT push. Do NOT deploy. Do not run wrangler.
- Write website-review/2026-09-10-redesign/REPORT.md: what changed, the hard-rule checklist with a grep-based proof for each (e.g. grep for "→", "eyebrow", "Fraunces", "share-button", "Colophon" in dist/ returns nothing), and anything you could not resolve.
