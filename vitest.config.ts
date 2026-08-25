import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    // Mirror tsconfig's "@/*" → "src/*".
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
