import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/fixtures/**"],
    include: ["scripts/**/*.test.ts", "src/**/*.test.ts"],
    passWithNoTests: true,
  },
});
