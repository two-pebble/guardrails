import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";
import type { Reporter } from "../../constructs/reporter";

/**
 * Checks that class fields are declared at the top of the class with no blank lines between them.
 */
export class ClassFieldsAtTopRule extends Guardrail {
  public readonly name = "class-fields-at-top";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
          ClassFieldsAtTopRule.checkClass(node, sourceFile, reporter);
        }
        ts.forEachChild(node, visit);
      });
    });
  }

  private static checkClass(node: ts.ClassLikeDeclaration, sourceFile: ts.SourceFile, reporter: Reporter) {
    let seenNonField = false;
    let lastFieldLine: number | undefined;

    for (const member of node.members) {
      const isField = ts.isPropertyDeclaration(member);
      const line = sourceFile.getLineAndCharacterOfPosition(member.getStart(sourceFile)).line + 1;

      if (isField) {
        if (seenNonField) {
          reporter.fail(
            {
              error: "fields-after-methods",
              description: "Class fields must be declared before constructors and methods.",
              recommendation: "Move the field into the top-of-class state block.",
            },
            line,
          );
        }

        if (lastFieldLine !== undefined && line - lastFieldLine > 1) {
          reporter.fail(
            {
              error: "blank-lines-between-fields",
              description: "Class fields must not be separated by blank lines.",
              recommendation: "Keep the field block visually compact so readers can inventory class state.",
            },
            line,
          );
        }

        lastFieldLine = line;
      } else {
        seenNonField = true;
      }
    }
  }
}
