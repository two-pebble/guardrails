import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that each test block does not exceed a maximum number of non-comment lines.
 */
export class MaxTestItBlockLinesRule extends Guardrail {
  public readonly name = "max-test-it-block-lines";

  protected async check() {
    const maxLines = (this.options.maxLines as number) ?? 10;

    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const checkNode = (node: ts.Node) => {
        const block = MaxTestItBlockLinesRule.getTestBlock(node);
        if (block) {
          const nonCommentLines = MaxTestItBlockLinesRule.countNonCommentLines(block, sourceFile);
          if (nonCommentLines > maxLines) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "test-block-too-long",
                description: `Each test(...) block must stay at ${maxLines} non-comment lines or fewer.`,
                recommendation: "Extract setup or split the case.",
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

  private static countNonCommentLines(block: ts.Block, sourceFile: ts.SourceFile) {
    const fullText = sourceFile.getFullText();
    const startLine = sourceFile.getLineAndCharacterOfPosition(block.getStart()).line;
    const endLine = sourceFile.getLineAndCharacterOfPosition(block.getEnd()).line;

    const lines = fullText.split("\n").slice(startLine + 1, endLine);

    let count = 0;
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed === "") continue;
      if (trimmed.startsWith("//")) continue;
      if (trimmed.startsWith("/*") || trimmed.startsWith("*") || trimmed.startsWith("*/")) continue;
      count++;
    }
    return count;
  }
}
