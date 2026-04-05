import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that test files import from Vitest instead of Node built-in testing modules.
 */
export class TestFilesUseVitestRule extends Guardrail {
  public readonly name = "test-files-use-vitest";
  private static readonly BANNED_MODULES = new Set([
    "node:test",
    "assert",
    "assert/strict",
    "node:assert",
    "node:assert/strict",
  ]);

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (!file.endsWith(".test.ts") && !file.endsWith(".test.tsx")) return;

      for (const statement of sourceFile.statements) {
        if (!ts.isImportDeclaration(statement)) continue;

        const moduleSpecifier = statement.moduleSpecifier;
        if (ts.isStringLiteral(moduleSpecifier) && TestFilesUseVitestRule.BANNED_MODULES.has(moduleSpecifier.text)) {
          reporter.fail(
            {
              error: "node-test-import",
              description: "Test files must use Vitest instead of Node built-in testing modules.",
              recommendation: "Replace with vitest imports.",
            },
            sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1,
          );
        }
      }
    });
  }
}
