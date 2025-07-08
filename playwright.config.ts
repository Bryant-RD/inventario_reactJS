import { defineConfig } from 'next/experimental/testmode/playwright';

/*
 * Specify any additional Playwright config options here.
 * They will be merged with Next.js' default Playwright config.
 * You can access the default config by importing `defaultPlaywrightConfig` from `'next/experimental/testmode/playwright'`.
 */
export default defineConfig({
  testDir: "./test/playwright",
  // Solo busca archivos que terminen en .spec.ts
  testMatch: "**/*.spec.ts",
  webServer: {
    command: "npm run build && npm start",
    port: 4000,
    timeout: 60000,
  },
});