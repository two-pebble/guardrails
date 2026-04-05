import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that block comments are never on a single line.
 * Use a regular single-line comment or expand to a multiline block.
 */
export class NoSingleLineBlockCommentsRule extends Guardrail {
  public readonly name = "no-single-line-block-comments";

  protected async check() {
    await this.forEachFileContent((_file, content, reporter) => {
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trim();
        const isSingleLineBlock = trimmed.startsWith("/**") && trimmed.endsWith("*/") && !trimmed.includes("\n");
        if (isSingleLineBlock) {
          reporter.fail(
            {
              error: "single-line-block-comment",
              description: "Block comments must span multiple lines.",
              recommendation: "Use a // comment or expand to a multiline /** ... */ block.",
            },
            i + 1,
          );
        }
      }
    });
  }
}
