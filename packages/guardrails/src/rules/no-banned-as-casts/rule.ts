import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that type assertions do not use banned target types like any, unknown, or never.
 */
export class NoBannedAsCastsRule extends Guardrail {
  public readonly name = "no-banned-as-casts";
  private static readonly BANNED_TYPES = new Set(["any", "unknown", "never"]);

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const visit = (node: ts.Node) => {
        if (ts.isAsExpression(node)) {
          const typeNode = node.type;
          let typeName: string | undefined;

          if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
            typeName = typeNode.typeName.text;
          } else if (typeNode.kind === ts.SyntaxKind.AnyKeyword) {
            typeName = "any";
          } else if (typeNode.kind === ts.SyntaxKind.UnknownKeyword) {
            typeName = "unknown";
          } else if (typeNode.kind === ts.SyntaxKind.NeverKeyword) {
            typeName = "never";
          }

          if (typeName && NoBannedAsCastsRule.BANNED_TYPES.has(typeName)) {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "banned-cast",
                description: `Type assertions using "as ${typeName}" are not allowed.`,
                recommendation: "Replace with proper narrowing or a real named type.",
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
