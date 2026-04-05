import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that TSX files do not use className or style attributes or property assignments.
 */
export class NoCustomStyleRule extends Guardrail {
  public readonly name = "no-custom-style";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      if (!sourceFile.fileName.endsWith(".tsx")) return;

      const visit = (node: ts.Node) => {
        // Check JSX attributes: className or style
        if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
          const attrName = node.name.text;
          if (attrName === "className" || attrName === "style") {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "custom-style",
                description: "Must not use className or style in TSX files.",
                recommendation: "Use the component library API instead of applying local styles.",
              },
              line,
            );
          }
        }

        // Check property assignments: obj.className = ... or obj.style = ...
        if (
          ts.isBinaryExpression(node) &&
          node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
          ts.isPropertyAccessExpression(node.left)
        ) {
          const propName = node.left.name.text;
          if (propName === "className" || propName === "style") {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "custom-style",
                description: "Must not use className or style in TSX files.",
                recommendation: "Use the component library API instead of applying local styles.",
              },
              line,
            );
          }
        }

        ts.forEachChild(node, visit);
      };
      visit(sourceFile);
    });
  }
}
