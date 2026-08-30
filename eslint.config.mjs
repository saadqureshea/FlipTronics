import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored third-party components (shadcn/ui + bklit charts registries).
    // Not our code to fix — lint our own components instead.
    "components/ui/**",
    "components/charts/**",
    "components/shimmering-text.tsx",
  ]),
]);

export default eslintConfig;
