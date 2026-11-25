import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // tests/setup.ts starts an in-memory MongoDB replica set for every test file.
    setupFiles: ["tests/setup.ts"],
    // The first run downloads MongoDB once (see STARTER.md), so hooks may be slow.
    hookTimeout: 120_000,
    testTimeout: 30_000,
  },
});
