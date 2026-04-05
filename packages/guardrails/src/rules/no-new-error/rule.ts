import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that the built-in Error class is not instantiated directly.
 */
export class NoNewErrorRule extends Guardrail {
  public readonly name = "no-new-error";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (ts.isNewExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "Error") {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "new-error",
              description: "Do not instantiate the built-in Error class directly.",
              recommendation: "Define and throw a custom package error.",
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
