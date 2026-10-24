// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import { fileURLToPath } from "node:url";
import { collectSitemapLastmod, collectPostPaths } from "./src/lib/sitemap-lastmod.ts";

const postSlugs = collectPostPaths(fileURLToPath(new URL("./src/content/blog/", import.meta.url)));
const sitemapLastmod = collectSitemapLastmod(fileURLToPath(new URL("./src/content/blog/", import.meta.url)));

// https://astro.build/config
export default defineConfig({
  site: "https://blog.dougdesign.com.br",
  trailingSlash: "always",
  build: {
    format: "directory",
    inlineStylesheets: "always",
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      fallbacks: ["system-ui", "sans-serif"],
      weights: ["600 800"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "optional",
    },
    {
      provider: fontProviders.google(),
      name: "Plus Jakarta Sans",
      cssVariable: "--font-plus-jakarta-sans",
      fallbacks: ["system-ui", "sans-serif"],
      weights: ["400 700"],
      styles: ["normal"],
      subsets: ["latin"],
      display: "optional",
    },
  ],
  integrations: [
    sitemap({
      // Posts com noindex ficam fora do mapa de lastmod e, por isso, fora do sitemap.
      filter: (page) => !postSlugs.has(new URL(page).pathname) || sitemapLastmod.has(new URL(page).pathname),
      // lastmod ajuda o Google a priorizar o rastreamento de posts novos e revisados.
      serialize(item) {
        const lastmod = sitemapLastmod.get(new URL(item.url).pathname);
        return lastmod ? { ...item, lastmod } : item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
