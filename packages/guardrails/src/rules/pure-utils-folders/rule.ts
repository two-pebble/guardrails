import { readdirSync } from "node:fs";
import { basename, dirname } from "node:path";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that utils folders are flat, contain only TypeScript files, and each file exports exactly one function.
 */
export class PureUtilsFoldersRule extends Guardrail {
  public readonly name = "pure-utils-folders";

  protected async check() {
    const checkedDirs = new Set<string>();

    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      const dir = dirname(file);
      if (basename(dir) !== "utils") return;

      // Check directory-level rules once per utils folder
      if (!checkedDirs.has(dir)) {
        checkedDirs.add(dir);
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && entry.name !== "snapshots") {
            reporter.fail({
              error: "utils-subdir",
              description: "Utils folders must not contain subdirectories.",
              recommendation: "Keep utils flat.",
            });
          }
          if (entry.isFile() && !/\.tsx?$/.test(entry.name)) {
            reporter.fail({
              error: "utils-non-ts",
              description: "Utils folders must contain only TypeScript utility files.",
              recommendation: "Remove non-TS files.",
            });
          }
        }
      }

      // Skip test files and test helpers from the single-function export check
      const fileName = basename(file);
      if (fileName.endsWith(".test.ts") || fileName.endsWith(".test.tsx") || fileName.includes("test-")) return;

      // Check each file exports exactly one function
      let exportedFunctions = 0;

      for (const statement of sourceFile.statements) {
        const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
        const isExported = modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
        if (!isExported) continue;

        if (ts.isFunctionDeclaration(statement)) {
          exportedFunctions++;
        } else if (ts.isVariableStatement(statement)) {
          for (const decl of statement.declarationList.declarations) {
            const isFnInit =
              decl.initializer && (ts.isArrowFunction(decl.initializer) || ts.isFunctionExpression(decl.initializer));
            if (isFnInit) {
              exportedFunctions++;
            }
          }
        }
      }

      if (exportedFunctions !== 1) {
        reporter.fail(
          {
            error: "utils-not-single-fn",
            description: "Each file in a utils folder must export exactly one function.",
            recommendation: "Split into single-function modules.",
          },
          1,
        );
      }
    });
  }
}
