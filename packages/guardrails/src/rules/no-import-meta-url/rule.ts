import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that import.meta.url is not used in source files.
 */
export class NoImportMetaUrlRule extends Guardrail {
  public readonly name = "no-import-meta-url";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (
          ts.isPropertyAccessExpression(node) &&
          node.name.text === "url" &&
          ts.isMetaProperty(node.expression) &&
          node.expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
          node.expression.name.text === "meta"
        ) {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
          reporter.fail(
            {
              error: "import-meta-url",
              description: "import.meta.url is not allowed.",
              recommendation: "Pass the relevant path in explicitly.",
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
