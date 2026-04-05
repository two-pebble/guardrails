import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Controller } from "./controller";
import { formatResults } from "./reporter";
import type { GuardrailConfig } from "./types";

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  return typeof error === "object" && error !== null && "code" in error;
}

const packageDir = process.cwd();
const guardPath = resolve(packageDir, "guard.json");

let raw: string;

try {
  raw = readFileSync(guardPath, "utf-8");
} catch (error) {
  if (isErrnoException(error) && error.code === "ENOENT") {
    process.stdout.write("No guard.json found, nothing to check.\n");
    process.exit(0);
  }

  process.stderr.write(`Could not read ${guardPath}\n`);
  process.exit(1);
}

let config: GuardrailConfig;

try {
  config = JSON.parse(raw) as GuardrailConfig;
} catch {
  process.stderr.write(`Could not parse ${guardPath} as JSON.\n`);
  process.exit(1);
}

if (config === null || typeof config !== "object" || Array.isArray(config)) {
  process.stdout.write("guard.json must contain a JSON object, nothing to check.\n");
  process.exit(0);
}

const controller = new Controller();

try {
  const result = await controller.run(packageDir, config);
  process.stdout.write(`${formatResults(result)}\n`);
  process.exit(result.passed ? 0 : 1);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown guardrail failure.";
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
