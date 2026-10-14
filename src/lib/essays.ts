import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

type Essay = CollectionEntry<'essays'>;

const byPart = (a: Essay, b: Essay) =>
  (a.data.part ?? Infinity) - (b.data.part ?? Infinity) || a.data.order - b.data.order;

export async function getEssays() {
  return getCollection('essays', ({ data }) => !data.draft);
}

export async function getSeries(id: string) {
  const series = await getEntry('series', id);
  if (!series) throw new Error(`Unknown series "${id}" (expected src/content/series/${id}.md)`);
  return series;
}

// Published essays in a series, in part order.
export async function getSeriesEssays(id: string) {
  return (await getEssays()).filter((essay) => essay.data.series === id).sort(byPart);
}
