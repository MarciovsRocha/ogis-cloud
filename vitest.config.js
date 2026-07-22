import { defineConfig } from "vitest/config";

// Config própria, sem o plugin do Cloudflare: os testes cobrem apenas lógica
// pura, então rodam em Node — sem DOM, sem bundler, sem Worker.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
  },
});
