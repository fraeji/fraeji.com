# Working on fraeji.com

This is Freya's personal website. Freya asks for changes in plain language and is not a developer. She can't read code, so judge your work by how the site looks and reads, not by how the code looks.

## How to talk to Freya

- Reply in plain language. Don't mention files, components, CSS, frontmatter or commands unless she asks.
- Describe what changed as she'd see it: "The links are now a darker pink" rather than "Updated `--color-pink`".
- If a request is ambiguous (which essay? how much bigger?), make a sensible choice, say what you chose and offer to adjust it. Don't stall on questions.
- If something can't be done, or would break the site, say so plainly and suggest the closest thing that works.
- End every task with one short line telling her to check the preview link on the pull request before merging.

## The site

Astro + Tailwind CSS, deployed on Vercel. Every pull request gets a Vercel preview; merging into `main` publishes the site.

| What | Where |
| --- | --- |
| Homepage text, jobs, links | `src/content/home.md` |
| Essays | `src/content/essays/*.md` (filename is the URL) |
| Portfolio projects | `src/content/projects/*.md` |
| Portfolio images | `src/assets/projects/<project>/` |
| Floating homepage photos | `src/assets/flying/` |
| Colours, fonts, sizes | `src/styles/global.css` (`@theme` and the layers below it) |
| Page layouts | `src/pages/`, `src/layouts/Base.astro`, `src/components/` |
| Content fields | `src/content.config.ts` |

`README.md` has the frontmatter for new essays and projects. Copy an existing file when adding one.

## Design

The site recreates Freya's old Cargo site: Sorts Mill Goudy throughout, pink links, lots of white space, and the drifting photos on the homepage. Keep that character unless she asks to change it.

- Everything is sized in `rem` and scales with the window, so use `rem`/`em`, not `px`.
- Check both desktop and phone widths; below 768px uses a different root size.
- Change the theme colours in `@theme` instead of hard-coding new values.

## Rules

- Run `npm run build` before finishing. If it fails, fix it; never open a pull request with a broken build.
- Keep old URLs working. Don't rename essay files; if a URL has to change, add a redirect in `astro.config.mjs`.
- Images need descriptive alt text. Write it yourself if she doesn't give it.
- Don't add dependencies, analytics, trackers or third-party scripts unless she asks explicitly.
- Keep changes to what she asked for. No unrelated refactors.
