import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["**/fixtures/**"],
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
  },
});
