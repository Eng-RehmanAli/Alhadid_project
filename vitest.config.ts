import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: [
      "src/components/**/*.{test,spec}.{ts,tsx}",
      "src/app/**/*.{test,spec}.{ts,tsx}",
    ],
    setupFiles: ["./src/test/setup.ts"],
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
