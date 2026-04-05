import { basename } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that code does not use the built-in Error constructor directly.
 * Use custom error classes from errors.ts instead.
 */
export class ThrowPackageErrorsRule extends Guardrail {
  public readonly name = "throw-package-errors";
  private static readonly pattern = new RegExp(["\\bnew", "Error\\s*\\("].join(" "));

  protected async check() {
    await this.forEachFileContent((file, content, reporter) => {
      if (basename(file) === "errors.ts") return;

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (ThrowPackageErrorsRule.pattern.test(lines[i])) {
          reporter.fail(
            {
              error: "new-error",
              description: "Do not use the built-in Error constructor directly.",
              recommendation: "Define a custom error class in errors.ts and use that instead.",
            },
            i + 1,
          );
        }
      }
    });
  }
}
