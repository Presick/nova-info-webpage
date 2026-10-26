// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// The production domain is not decided yet. Set SITE_URL when building for deploy.
const site = process.env.SITE_URL ?? 'https://example.com';

// The page title comes from front matter, so drop the first H1 in the Markdown body.
function removeFirstH1() {
  return (/** @type {any} */ tree) => {
    const i = tree.children.findIndex((n) => n.type === 'element' && n.tagName === 'h1');
    if (i >= 0) tree.children.splice(i, 1);
  };
}

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap()],
  markdown: { rehypePlugins: [removeFirstH1] },
});
