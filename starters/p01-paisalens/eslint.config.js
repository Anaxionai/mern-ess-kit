// @ts-check
// ESLint's settings for PaisaLens (task 27), as in typescript-eslint's Getting Started page.
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["data/", "coverage/"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      // The starter's stubs do not use their parameters yet, so unused
      // parameters are allowed. An unused import or variable is still an error.
      "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    },
  },
);
