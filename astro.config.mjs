// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://fraeji.com',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  // Keep old Cargo URLs working.
  redirects: {
    '/main-page': '/',
    "/what-i-think-about-when-i'm-running": '/what-i-think-about-when-im-running',
  },
});
