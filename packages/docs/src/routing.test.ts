import { describe, expect, test } from "vitest";
import {
  getDocsRoute,
  getGroupHref,
  getGroupsHref,
  getHomeHref,
  getOverviewHref,
  getRuleHref,
  getRulesHref,
  getSetupHref,
} from "./routing";

describe("feature: docs routing", () => {
  test("success: resolves the overview route at the repository base path", () => {
    expect(getDocsRoute("/guardrails/", "/guardrails/")).toEqual({ kind: "overview" });
  });

  test("success: resolves get started, groups, and rules routes", () => {
    expect(getDocsRoute("/guardrails/get-started/setup/", "/guardrails/")).toEqual({ kind: "setup" });
    expect(getDocsRoute("/guardrails/groups/", "/guardrails/")).toEqual({ kind: "groups" });
    expect(getDocsRoute("/guardrails/groups/guardrails-typescript/", "/guardrails/")).toEqual({
      kind: "group",
      slug: "guardrails-typescript",
    });
    expect(getDocsRoute("/guardrails/rules/", "/guardrails/")).toEqual({ kind: "rules" });
  });

  test("success: resolves a rule route under the repository base path", () => {
    expect(getDocsRoute("/guardrails/rules/no-dynamic-imports/", "/guardrails/")).toEqual({
      kind: "rule",
      slug: "no-dynamic-imports",
    });
  });

  test("success: builds stable links for the docs sections", () => {
    expect(getHomeHref("/guardrails/")).toBe("/guardrails/get-started/overview/");
    expect(getOverviewHref("/guardrails/")).toBe("/guardrails/get-started/overview/");
    expect(getSetupHref("/guardrails/")).toBe("/guardrails/get-started/setup/");
    expect(getGroupsHref("/guardrails/")).toBe("/guardrails/groups/");
    expect(getGroupHref("guardrails-typescript", "/guardrails/")).toBe("/guardrails/groups/guardrails-typescript/");
    expect(getRulesHref("/guardrails/")).toBe("/guardrails/rules/");
    expect(getRuleHref("package-readme-md", "/guardrails/")).toBe("/guardrails/rules/package-readme-md/");
  });
});
