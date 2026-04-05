import { describe, expect, test } from "vitest";
import { validateGuardrailConfig } from "./config-validator";
import { Controller } from "./controller";
import type { GuardrailConfig } from "./types";

const validConfig: GuardrailConfig = {
  exclude: [
    {
      rules: ["no-process-env"],
      paths: ["src/**"],
      justification: "This package intentionally reads environment variables at its boundary.",
    },
  ],
};

const missingJustificationConfig = {
  exclude: [{ rules: ["no-process-env"], paths: ["src/**"] }],
} as GuardrailConfig;

const incompleteJustificationConfig = {
  exclude: [
    {
      rules: ["no-process-env"],
      paths: ["src/**"],
      justification: "",
    },
  ],
} as GuardrailConfig;

const missingJustificationError = "Invalid guardrail config: exclude[0].justification must be a non-empty string.";
const incompleteJustificationError = "Invalid guardrail config: exclude[0].justification must be a non-empty string.";
const invalidControllerConfig = { exclude: [{ rules: ["*"], paths: ["src/**"] }] } as GuardrailConfig;

describe("validateGuardrailConfig", () => {
  test("happy: accepts exclusion entries with string justification", () => {
    expect(() => {
      validateGuardrailConfig(validConfig);
    }).not.toThrow();
  });

  test("unhappy: rejects exclusions without justification", () => {
    expect(() => {
      validateGuardrailConfig(missingJustificationConfig);
    }).toThrowError(missingJustificationError);
  });

  test("unhappy: rejects incomplete justifications", () => {
    expect(() => {
      validateGuardrailConfig(incompleteJustificationConfig);
    }).toThrowError(incompleteJustificationError);
  });
});

describe("Controller", () => {
  test("unhappy: rejects invalid exclusion config before execution", async () => {
    const controller = new Controller();
    const runController = async () => controller.run(process.cwd(), invalidControllerConfig);

    await expect(runController()).rejects.toThrowError(missingJustificationError);
  });
});
