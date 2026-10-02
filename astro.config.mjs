// @ts-check
import { defineConfig, fontProviders } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.dougdesign.com.br",
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
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
