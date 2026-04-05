import { defineWorkspace } from "vitest/config";

export default defineWorkspace(["packages/guardrails/vitest.config.ts", "packages/docs/vitest.config.ts"]);
