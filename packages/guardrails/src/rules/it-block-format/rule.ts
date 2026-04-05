import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that test blocks use test() instead of it(), have inline block bodies, and meet a minimum line count.
 */
export class ItBlockFormatRule extends Guardrail {
  public readonly name = "test-block-format";

  protected async check() {
    const minLines = (this.options.minLines as number) ?? 5;

    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      ts.forEachChild(sourceFile, function visit(node) {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === "it" &&
          node.arguments.length >= 2
        ) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
          reporter.fail(
            {
              error: "prefer-test",
              description: "Use test(...) instead of it(...) in test files.",
              recommendation: "Replace it() with test() from vitest.",
            },
            line,
          );
          return;
        }

        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          node.expression.text === "test" &&
          node.arguments.length >= 2
        ) {
          const callback = node.arguments[1];

          const isInlineBlock =
            (ts.isFunctionExpression(callback) || ts.isArrowFunction(callback)) &&
            callback.body &&
            ts.isBlock(callback.body);

          if (!isInlineBlock) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
            reporter.fail(
              {
                error: "no-block-body",
                description: "Each test(...) callback must be declared inline with a block body.",
                recommendation: "Use an inline block callback.",
              },
              line,
            );
            return;
          }

          const body = (callback as ts.FunctionExpression | ts.ArrowFunction).body as ts.Block;
          const bodyText = sourceFile.text.substring(body.getStart(sourceFile), body.getEnd());
          const bodyLines = bodyText.split("\n");
          let nonCommentLines = 0;

          for (const l of bodyLines) {
            const trimmed = l.trim();
            if (trimmed !== "" && !trimmed.startsWith("//") && !trimmed.startsWith("/*") && !trimmed.startsWith("*")) {
              nonCommentLines++;
            }
          }

          if (nonCommentLines < minLines) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
            reporter.fail(
              {
                error: "too-short",
                description: `Each test(...) block must span at least ${minLines} non-comment lines.`,
                recommendation: "Expand the test body.",
              },
              line,
            );
          }
        }

        ts.forEachChild(node, visit);
      });
    });
  }
}
