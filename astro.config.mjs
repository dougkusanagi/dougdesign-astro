// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://dougdesign.com.br",
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Outfit",
      cssVariable: "--font-outfit",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        weights: [400, 500, 600, 700, 800],
        subsets: ["latin"],
      },
    },
    {
      provider: fontProviders.google(),
      name: "Plus Jakarta Sans",
      cssVariable: "--font-plus-jakarta-sans",
      fallbacks: ["system-ui", "sans-serif"],
      options: {
        weights: [400, 500, 600, 700],
        subsets: ["latin"],
      },
    },
  ],
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
