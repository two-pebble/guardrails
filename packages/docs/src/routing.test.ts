import { describe, expect, test } from "vitest";
import { getDocsRoute, getHomeHref, getRuleHref } from "./routing";

describe("feature: docs routing", () => {
  test("success: resolves the docs index route at the repository base path", () => {
    expect(getDocsRoute("/guardrails/", "/guardrails/")).toEqual({ kind: "index" });
  });

  test("success: resolves a rule route under the repository base path", () => {
    expect(getDocsRoute("/guardrails/rules/no-dynamic-imports/", "/guardrails/")).toEqual({
      kind: "rule",
      slug: "no-dynamic-imports",
    });
  });

  test("success: builds stable links for the docs index and rule pages", () => {
    expect(getHomeHref("/guardrails/")).toBe("/guardrails/");
    expect(getRuleHref("package-readme-md", "/guardrails/")).toBe("/guardrails/rules/package-readme-md/");
  });
});
