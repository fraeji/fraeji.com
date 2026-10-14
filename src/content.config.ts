import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Homepage copy: the intro text is the markdown body, the rest is frontmatter.
const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    email: z.string(),
    // The footer's sign-up box sends people to this Substack.
    substack: z.url().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })),
    handle: z.object({ label: z.string(), url: z.string() }),
    experience: z.array(
      z.object({
        role: z.string(),
        dates: z.string(),
        company: z.string(),
      }),
    ),
  }),
});

// A run of essays that belong together, e.g. "Gardening". The filename is the id
// that essays point to with `series:`.
const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
  }),
});

const essays = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/essays' }),
  schema: z.object({
    title: z.string(),
    // Position in the "Writing" list on the homepage. Lower comes first.
    order: z.number(),
    description: z.string().optional(),
    // Optional note under the title, e.g. where the piece was also published.
    featured: z.object({ label: z.string(), url: z.url() }).optional(),
    // The series this essay is part of. Pages CMS may store a path or filename
    // ("src/content/series/gardening.md"), so keep only the bare id. Cleared
    // fields can come back as null or "".
    series: z
      .string()
      .nullish()
      .transform((value) => (value ? value.replace(/^.*\//, '').replace(/\.md$/, '') : undefined)),
    // Number within the series: 1, 2, 3…
    part: z
      .number()
      .nullish()
      .transform((value) => value ?? undefined),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // Position on the portfolio page. Lower comes first.
      order: z.number(),
      client: z.string().optional(),
      role: z.string().optional(),
      year: z.string().optional(),
      summary: z.string().optional(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      link: z.url().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { home, series, essays, projects };
