import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://dupouyer.github.io',
  base: '/',
  integrations: [mdx()],
  compressHTML: true,
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
