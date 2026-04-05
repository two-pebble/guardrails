import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that files defining a class do not also define top-level functions or variables.
 */
export class ClassOwnsUtilitiesRule extends Guardrail {
  public readonly name = "class-owns-utilities";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      let hasClass = false;

      for (const statement of sourceFile.statements) {
        if (ts.isClassDeclaration(statement)) {
          hasClass = true;
          break;
        }
      }

      if (!hasClass) {
        return;
      }

      for (const statement of sourceFile.statements) {
        if (ts.isFunctionDeclaration(statement) || ts.isVariableStatement(statement)) {
          const line = sourceFile.getLineAndCharacterOfPosition(statement.getStart(sourceFile)).line + 1;
          reporter.fail(
            {
              error: "top-level-non-class",
              description: "Files that define a class cannot also define top-level constants or functions.",
              recommendation: "Move supporting behavior into the class.",
            },
            line,
          );
        }
      }
    });
  }
}
