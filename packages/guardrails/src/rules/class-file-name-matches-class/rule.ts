import { basename } from "node:path";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";
import type { Reporter } from "../../constructs/reporter";

/**
 * Checks that files defining a top-level class use the kebab-case form of the class name as the filename.
 */
export class ClassFileNameMatchesClassRule extends Guardrail {
  public readonly name = "class-file-name-matches-class";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      const fileName = basename(file).replace(/\.tsx?$/, "");
      if (fileName === "errors" || fileName === "rule") return;

      ClassFileNameMatchesClassRule.checkStatements(fileName, sourceFile, reporter);
    });
  }

  private static checkStatements(fileName: string, sourceFile: ts.SourceFile, reporter: Reporter) {
    for (const statement of sourceFile.statements) {
      if (!ts.isClassDeclaration(statement) || !statement.name) continue;

      const expected = ClassFileNameMatchesClassRule.toKebabCase(statement.name.text);
      if (fileName === expected) continue;

      const line = sourceFile.getLineAndCharacterOfPosition(statement.getStart(sourceFile)).line + 1;
      reporter.fail(
        {
          error: "filename-mismatch",
          description: "Class files must use the kebab-case form of the class name as the filename.",
          recommendation: "Rename the file to match the class name in kebab-case.",
        },
        line,
      );
    }
  }

  private static toKebabCase(name: string) {
    return name
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
      .toLowerCase();
  }
}
