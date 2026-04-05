import { Guardrail } from "../../constructs/guardrail";

/**
 * Requires Markdown sidecars to use the .md extension.
 */
export class PreferMdExtensionRule extends Guardrail {
  public readonly name = "prefer-md-extension";

  protected async check() {
    await this.forEachMatchedFile(["**/*.markdown"], (file, reporter) => {
      reporter.fail({
        error: "prefer-md-extension",
        description: "Markdown files must use the .md extension instead of .markdown.",
        recommendation: `Rename ${file} to use the .md extension.`,
      });
    });
  }
}
