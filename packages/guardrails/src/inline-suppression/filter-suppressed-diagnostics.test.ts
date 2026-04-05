import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import type { Diagnostic } from "../types";
import { filterSuppressedDiagnostics } from "./filter-suppressed-diagnostics";

const fixturePath = resolve(process.cwd(), "src/inline-suppression/fixtures/sample.ts");

describe("filterSuppressedDiagnostics", () => {
  const makeDiagnostic = (file: string, line?: number) => {
    const diagnostic: Diagnostic = {
      file,
      line,
      error: "test-error",
      description: "Test error",
      recommendation: "Fix it",
    };

    return diagnostic;
  };

  test("happy: keeps diagnostics with no suppression comments", () => {
    const diagnostics = [makeDiagnostic(fixturePath, 2)];
    const result = filterSuppressedDiagnostics("some-rule", diagnostics);
    expect(result).toHaveLength(1);
  });

  test("happy: suppresses next line when guardrail-disable matches rule", () => {
    const diagnostics = [makeDiagnostic(fixturePath, 5)];
    const result = filterSuppressedDiagnostics("no-console", diagnostics);
    expect(result).toHaveLength(0);
  });

  test("happy: suppresses entire file when guardrail-disable-file matches rule", () => {
    const diagnostics = [makeDiagnostic(fixturePath, 2), makeDiagnostic(fixturePath, 8)];
    const result = filterSuppressedDiagnostics("no-process-env", diagnostics);
    expect(result).toHaveLength(0);
  });

  test("happy: suppresses with wildcard *", () => {
    const diagnostics = [makeDiagnostic(fixturePath, 11)];
    const result = filterSuppressedDiagnostics("any-rule", diagnostics);
    expect(result).toHaveLength(0);
  });

  test("unhappy: does not suppress when rule name does not match", () => {
    const diagnostics = [makeDiagnostic(fixturePath, 5)];
    const result = filterSuppressedDiagnostics("other-rule", diagnostics);
    expect(result).toHaveLength(1);
  });

  test("unhappy: does not suppress when comment is on wrong line", () => {
    const diagnostics = [makeDiagnostic(fixturePath, 6)];
    const result = filterSuppressedDiagnostics("no-console", diagnostics);
    expect(result).toHaveLength(1);
  });

  test("happy: returns empty array when given empty diagnostics", () => {
    const result = filterSuppressedDiagnostics("any-rule", []);
    const errorCount = result.length;
    const firstResult = result[0];
    const summary = { errorCount, firstResult };

    expect(summary).toEqual({ errorCount: 0, firstResult: undefined });
  });

  test("happy: keeps diagnostics without a file", () => {
    const diagnostics = [{ error: "test", description: "Test", recommendation: "Fix" } as Diagnostic];
    const result = filterSuppressedDiagnostics("any-rule", diagnostics);
    expect(result).toHaveLength(1);
  });
});
