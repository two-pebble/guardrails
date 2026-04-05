import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that vi.mock() is not used in test files.
 */
export class NoViMockRule extends Guardrail {
  public readonly name = "no-vi-mock";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === "vi" &&
          node.expression.name.text === "mock"
        ) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "vi-mock",
              description: "vi.mock(...) is not allowed.",
              recommendation: "Replace with an explicit fake, injected dependency, or direct construction.",
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
