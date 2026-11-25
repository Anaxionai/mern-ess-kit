// @ts-check
// ESLint's settings for the RailSeat API, the same as PaisaLens's (P1 task 27).
import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  { ignores: ["coverage/", "queries/"] },
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
