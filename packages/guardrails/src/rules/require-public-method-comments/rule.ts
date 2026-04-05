import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that all public class methods have a comment above them.
 * Accepts any comment style — single-line, multiline, or JSDoc.
 */
export class RequirePublicMethodCommentsRule extends Guardrail {
  public readonly name = "require-public-method-comments";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      const fullText = sourceFile.getFullText();

      ts.forEachChild(sourceFile, function visit(node) {
        if (!ts.isClassDeclaration(node)) {
          ts.forEachChild(node, visit);
          return;
        }

        for (const member of node.members) {
          const isPublicMethod = RequirePublicMethodCommentsRule.isPublicMethod(member);
          if (!isPublicMethod) continue;

          const ranges = ts.getLeadingCommentRanges(fullText, member.getFullStart());
          if (!ranges || ranges.length === 0) {
            const line = sourceFile.getLineAndCharacterOfPosition(member.getStart()).line + 1;
            reporter.fail(
              {
                error: "missing-method-comment",
                description: "Public methods must have a comment.",
                recommendation: "Add a // or /** ... */ comment above the method.",
              },
              line,
            );
          }
        }
      });
    });
  }

  private static isPublicMethod(member: ts.ClassElement) {
    if (ts.isConstructorDeclaration(member)) return false;
    const isMethod =
      ts.isMethodDeclaration(member) || ts.isGetAccessorDeclaration(member) || ts.isSetAccessorDeclaration(member);
    if (!isMethod) return false;

    const hasPublic = member.modifiers?.some((m) => m.kind === ts.SyntaxKind.PublicKeyword);
    const hasPrivate = member.modifiers?.some((m) => m.kind === ts.SyntaxKind.PrivateKeyword);
    const hasProtected = member.modifiers?.some((m) => m.kind === ts.SyntaxKind.ProtectedKeyword);

    return hasPublic || (!hasPrivate && !hasProtected);
  }
}
