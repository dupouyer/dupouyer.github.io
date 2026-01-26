import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dupouyer.github.io',
  base: '/',
  integrations: [mdx(), sitemap()],
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
