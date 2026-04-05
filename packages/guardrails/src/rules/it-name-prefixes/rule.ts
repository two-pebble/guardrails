import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that test titles start with an approved prefix such as "happy: " or "unhappy: ".
 */
export class ItNamePrefixesRule extends Guardrail {
  public readonly name = "test-name-prefixes";
  private static readonly DEFAULT_PREFIXES = ["happy: ", "unhappy: ", "snapshot: "];

  protected async check() {
    const prefixes = (this.options.prefixes as string[]) ?? ItNamePrefixesRule.DEFAULT_PREFIXES;

    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const lineOf = (node: ts.Node) => sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;

      const checkTestCall = (node: ts.CallExpression, name: string) => {
        if (name === "it") {
          reporter.fail(
            {
              error: "prefer-test",
              description: "Use test(...) instead of it(...) in test files.",
              recommendation: "Replace it() with test() from vitest.",
            },
            lineOf(node),
          );
          return;
        }
        const titleArg = node.arguments[0];
        if (!ts.isStringLiteral(titleArg) && !ts.isNoSubstitutionTemplateLiteral(titleArg)) return;
        if (prefixes.some((p) => titleArg.text.startsWith(p))) return;
        reporter.fail(
          {
            error: "invalid-prefix",
            description: `Every test(...) title must start with ${prefixes.map((p) => `"${p.trim()}"`).join(", ")}.`,
            recommendation: "Prefix each test title with its intent.",
          },
          lineOf(node),
        );
      };

      ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.arguments.length >= 1) {
          const name = node.expression.text;
          if (name === "it" || name === "test") {
            checkTestCall(node, name);
            if (name === "it") return;
          }
        }
        ts.forEachChild(node, visit);
      });
    });
  }
}
