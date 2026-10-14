import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react(), cloudflare()],
  // O manifest permite verificar o que entra no bundle da home (scripts/verificar-bundle.mjs).
  build: { manifest: true },
});
