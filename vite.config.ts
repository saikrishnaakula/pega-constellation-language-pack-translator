import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/pega-constellation-language-pack-translator/",

  plugins: [react(), tailwindcss()],

  worker: {
    format: "es",
  },

  optimizeDeps: {
    exclude: ["xlsx"],
  },
});
