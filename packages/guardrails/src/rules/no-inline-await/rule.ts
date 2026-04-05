import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that await expressions are used only as standalone statements or direct variable assignments.
 */
export class NoInlineAwaitRule extends Guardrail {
  public readonly name = "no-inline-await";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (ts.isAwaitExpression(node)) {
          const parent = node.parent;

          // Allowed: standalone expression statement — `await foo();`
          if (ts.isExpressionStatement(parent)) {
            ts.forEachChild(node, visit);
            return;
          }

          // Allowed: direct variable declaration — `const x = await foo();`
          if (ts.isVariableDeclaration(parent) && parent.initializer === node) {
            ts.forEachChild(node, visit);
            return;
          }

          // Allowed: assignment expression — `x = await foo();`
          if (
            ts.isBinaryExpression(parent) &&
            parent.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
            parent.right === node &&
            ts.isExpressionStatement(parent.parent)
          ) {
            ts.forEachChild(node, visit);
            return;
          }

          // Check for return await specifically
          if (ts.isReturnStatement(parent)) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "return-await",
                description: "return await is redundant.",
                recommendation: "Remove the await and return the promise directly.",
              },
              line,
            );
            ts.forEachChild(node, visit);
            return;
          }

          // Everything else is inline await
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "inline-await",
              description: "Await calls must be assigned directly or used as standalone expressions.",
              recommendation: "Move the awaited call into its own statement.",
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
