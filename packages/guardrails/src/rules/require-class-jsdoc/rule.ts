import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that all classes have a multiline JSDoc block comment.
 * Single-line block comments are not accepted.
 */
export class RequireClassJsdocRule extends Guardrail {
  public readonly name = "require-class-jsdoc";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      for (const statement of sourceFile.statements) {
        if (!ts.isClassDeclaration(statement)) continue;

        const fullText = sourceFile.getFullText();
        const ranges = ts.getLeadingCommentRanges(fullText, statement.getFullStart());
        const blockDoc = ranges?.find((r) => fullText.slice(r.pos, r.end).startsWith("/**"));

        if (!blockDoc) {
          reporter.fail(
            {
              error: "missing-jsdoc",
              description: "Classes must have a multiline JSDoc block comment.",
              recommendation: "Add a /** ... */ comment spanning multiple lines above the class.",
            },
            sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1,
          );
          continue;
        }

        const commentText = fullText.slice(blockDoc.pos, blockDoc.end);
        const lineCount = commentText.split("\n").length;
        if (lineCount < 2) {
          reporter.fail(
            {
              error: "single-line-jsdoc",
              description: "Class JSDoc comments must span multiple lines.",
              recommendation: "Expand the /** ... */ comment to multiple lines.",
            },
            sourceFile.getLineAndCharacterOfPosition(blockDoc.pos).line + 1,
          );
        }
      }
    });
  }
}
