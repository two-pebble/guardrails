import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that story files import and use SyntaxExample. Skips layout stories.
 */
export class RequireSyntaxExampleRule extends Guardrail {
  public readonly name = "require-syntax-example";

  protected async check() {
    await this.forEachFileContent((file, content, reporter) => {
      if (!file.endsWith(".story.tsx")) return;
      if (file.includes("/layout/")) return;

      if (!content.includes("SyntaxExample")) {
        reporter.fail({
          error: "missing-syntax-example",
          description: "Story files must use the SyntaxExample wrapper.",
          recommendation: "Import SyntaxExample and wrap each story render with it.",
        });
      }
    });
  }
}
