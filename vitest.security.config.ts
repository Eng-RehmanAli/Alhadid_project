import path from "node:path";
import { defineConfig } from "vitest/config";

/** Backend auth/security unit tests (not part of default `npm test`). */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/test/security/**/*.{test,spec}.{ts,tsx}"],
    setupFiles: ["./src/test/security-setup.ts"],
    clearMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
