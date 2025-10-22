import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // Desactivamos reglas específicas para permitir un desarrollo más rápido.
    // Idealmente, estas deberían ser corregidas en el futuro.
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      // "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    },
  },
];

export default eslintConfig;
