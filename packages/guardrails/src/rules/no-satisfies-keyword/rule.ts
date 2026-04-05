import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that the TypeScript satisfies keyword is not used.
 */
export class NoSatisfiesKeywordRule extends Guardrail {
  public readonly name = "no-satisfies-keyword";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (ts.isSatisfiesExpression(node)) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "satisfies",
              description: 'The TypeScript "satisfies" keyword is not allowed.',
              recommendation: "Use an explicit type annotation or named contract.",
            },
            line,
          );
        }
        ts.forEachChild(node, visit);
      };
      visit(sourceFile);
    });
  }
}
