import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that each test block contains at most a configured number of assertions.
 */
export class MaxTestAssertionsRule extends Guardrail {
  public readonly name = "max-test-assertions";

  protected async check() {
    const maxAssertions = (this.options.maxAssertions as number) ?? 1;

    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const checkNode = (node: ts.Node) => {
        const block = MaxTestAssertionsRule.getTestBlock(node);
        if (block) {
          const count = MaxTestAssertionsRule.countAssertions(block);
          if (count > maxAssertions) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "too-many-assertions",
                description: `Each test(...) block must contain at most ${maxAssertions} expect(...) or assert(...) call${maxAssertions === 1 ? "" : "s"}.`,
                recommendation: "One visible assertion per case keeps tests explicit.",
              },
              line,
            );
          }
        }
        ts.forEachChild(node, checkNode);
      };
      checkNode(sourceFile);
    });
  }

  private static getTestBlock(node: ts.Node) {
    if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression)) return undefined;
    const name = node.expression.text;
    if (name !== "test" && name !== "it") return undefined;
    if (node.arguments.length < 2) return undefined;
    const callback = node.arguments[1];
    if (!ts.isFunctionLike(callback) || !callback.body || !ts.isBlock(callback.body)) return undefined;
    return callback.body;
  }

  private static countAssertions(block: ts.Block) {
    let count = 0;
    const visit = (node: ts.Node) => {
      if (ts.isCallExpression(node)) {
        const text = MaxTestAssertionsRule.nodeText(node.expression);
        if (text.startsWith("expect") || text.startsWith("assert")) {
          count++;
          return;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(block);
    return count;
  }

  private static nodeText(node: ts.Node): string {
    if (ts.isIdentifier(node)) return node.text;
    if (ts.isPropertyAccessExpression(node)) return MaxTestAssertionsRule.nodeText(node.expression);
    if (ts.isCallExpression(node)) return MaxTestAssertionsRule.nodeText(node.expression);
    return "";
  }
}
