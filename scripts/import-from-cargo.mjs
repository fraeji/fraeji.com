#!/usr/bin/env node
// Pulls essay text from the old Cargo site into src/content/essays/*.md.
//
//   npm run import:cargo             fill in essays that still have the placeholder
//   npm run import:cargo -- --force  overwrite every essay body
//   npm run import:cargo -- --dry-run  show what would change, write nothing
//   npm run import:cargo -- --force on-supermarkets  only the essays named
//
// Frontmatter (title, order, featured link) is left alone; only the body is replaced.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://fraeji.com';
const ESSAYS_DIR = path.resolve('src/content/essays');
const PLACEHOLDER = 'Essay text not imported yet';

// Files whose Cargo URL differs from the filename.
const CARGO_SLUGS = {
  'what-i-think-about-when-im-running': "what-i-think-about-when-i'm-running",
};

const args = new Set(process.argv.slice(2));
const force = args.has('--force');
const dryRun = args.has('--dry-run');

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decode(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (match, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return String.fromCodePoint(n);
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

async function fetchPageContent(slug) {
  const res = await fetch(`${SITE}/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const html = await res.text();
  const match = html.match(/window\.__PRELOADED_STATE__=(\{.*?\});?\s*<\/script>/s);
  if (!match) throw new Error('no page data found');
  const state = JSON.parse(match[1]);
  const page = Object.values(state.pages?.byId ?? {}).find((p) => p.purl === slug);
  if (!page?.content) throw new Error('page content not found');
  return page.content;
}

// Turns Cargo's <br>-separated rich text into markdown paragraphs.
function toMarkdown(content) {
  let html = content.match(/<column-unit[^>]*>([\s\S]*?)<\/column-unit>/)?.[1] ?? content;

  // Drop the title, the optional "also featured in" note and the footer links.
  html = html.replace(/<h2[\s\S]*?<\/h2>/, '');
  html = html.replace(/^(?:\s|<\/?div[^>]*>|<b><\/b>)*<i>(?:\s|<br\s*\/?>)*<a [^>]*>[\s\S]*?<\/a>(?:\s|<br\s*\/?>)*<\/i>/, '');
  html = html.replace(/<a href="main-page"[\s\S]*$/, '');

  html = html
    .replace(/\r?\n/g, ' ')
    .replace(/<\/div>\s*<div[^>]*>/g, '<br><br>')
    .replace(/<\/?(div|span)(\s[^>]*)?>/g, '')
    .replace(/<(i|em)>([\s\S]*?)<\/\1>/g, (_, __, inner) => (inner.trim() ? `*${inner.trim()}*` : inner))
    .replace(/<(b|strong)>([\s\S]*?)<\/\1>/g, (_, __, inner) => (inner.trim() ? `**${inner.trim()}**` : inner))
    .replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (_, href, text) => `[${text.trim()}](${href})`)
    .replace(/<(?!br\b)[^>]+>/g, '');

  return html
    .split(/(?:\s*<br\s*\/?>\s*){2,}/)
    .map((p) => decode(p.replace(/<br\s*\/?>/g, '  \n')).replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .join('\n\n');
}

function splitFrontmatter(file) {
  const match = file.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  if (!match) throw new Error('missing frontmatter');
  return { frontmatter: match[1], body: match[2] };
}

const only = [...args].filter((arg) => !arg.startsWith('--'));
const files = (await readdir(ESSAYS_DIR)).filter(
  (f) => f.endsWith('.md') && (only.length === 0 || only.includes(f.replace(/\.md$/, ''))),
);

for (const file of files) {
  const id = file.replace(/\.md$/, '');
  const slug = CARGO_SLUGS[id] ?? id;
  const filePath = path.join(ESSAYS_DIR, file);
  const { frontmatter, body } = splitFrontmatter(await readFile(filePath, 'utf8'));

  if (!force && !body.includes(PLACEHOLDER)) {
    console.log(`skip  ${file} (already has text, use --force to overwrite)`);
    continue;
  }

  try {
    const markdown = toMarkdown(await fetchPageContent(slug));
    if (!markdown) throw new Error('no text found');
    const paragraphs = markdown.split('\n\n').length;
    if (!dryRun) await writeFile(filePath, `${frontmatter}\n${markdown}\n`);
    console.log(`${dryRun ? 'would write' : 'wrote'} ${file} (${paragraphs} paragraphs, ${markdown.split(/\s+/).length} words)`);
  } catch (error) {
    console.error(`fail  ${file}: ${error.message}`);
    process.exitCode = 1;
  }
}
