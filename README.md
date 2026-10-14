# fraeji.com

Freya von Noorden Pierce’s website, rebuilt from Cargo with [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com). The design matches the old Cargo site: Sorts Mill Goudy, the pink links and the drifting photos on the homepage.

## Running it

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static site in dist/
```

## Editing content

Everything lives in markdown under `src/content/`.

| What | Where |
| --- | --- |
| Homepage (intro, jobs, links) | `src/content/home.md` |
| Essays | `src/content/essays/*.md` |
| Portfolio projects | `src/content/projects/*.md` |
| Portfolio images | `src/assets/projects/<project>/` |
| Floating homepage photos | `src/assets/flying/` |

### A new essay

Add `src/content/essays/my-essay.md`. The filename becomes the URL (`fraeji.com/my-essay`).

```md
---
title: My essay
order: 0            # position in the Writing list, lower comes first
featured:           # optional
  label: This article was also featured in …
  url: https://…
draft: false        # true hides it from the site
---

First paragraph.

Second paragraph, with *italics* and [a link](https://…).
```

Photos go in `src/assets/essays/<essay>/` and are added with `![What’s in the photo](../../assets/essays/<essay>/photo.jpg)`.

### A series

A series links essays that belong together (e.g. *Gardening*). Add `src/content/series/my-series.md`:

```md
---
title: My series
description: One line about the series, shown under each essay title.
---
```

Then point each essay at it:

```md
series: my-series   # the series filename
part: 1             # number within the series
```

On the homepage they’re listed like any other essay. Each essay page shows “My series #1” above its title and, once there are two or more parts, links to the others at the bottom.

### A new project

Add `src/content/projects/client.md` (URL: `fraeji.com/portfolio/client`) and put its images in `src/assets/projects/client/`.

```md
---
title: Client
order: 6
role: Senior copywriter
year: 2026
summary: One line for search engines and link previews.
cover: ../../assets/projects/client/cover.jpg
coverAlt: What’s in the cover image
link: https://client.com
---

Intro paragraph.

## A campaign

What you did.

![Image description](../../assets/projects/client/one.jpg)
![Image description](../../assets/projects/client/two.jpg)
```

Images on consecutive lines sit side by side in a grid. Put a blank line between images to show them full width.

### Editing in the browser

`.pages.yml` configures [Pages CMS](https://pagescms.org): sign in with GitHub at app.pagescms.org, open this repository, and edit essays, series, projects and the homepage without touching code. Changes are committed straight to the repo.

## Importing essays from Cargo

```sh
npm run import:cargo              # fills in essays that still show the placeholder
npm run import:cargo -- --dry-run # preview only
npm run import:cargo -- --force   # overwrite all essay bodies
```

## Old URLs

Essays keep their Cargo URLs (`/on-supermarkets`, etc.). `/main-page` and the old apostrophe URL for “What I think about when I’m running” redirect (see `astro.config.mjs`).
