import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that story files do not use className or style JSX attributes.
 */
export class NoStoryClassnameOrStyleRule extends Guardrail {
  public readonly name = "no-story-classname-or-style";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (!file.includes(".story.")) return;

      const visit = (node: ts.Node) => {
        if (ts.isJsxAttribute(node) && ts.isIdentifier(node.name)) {
          const name = node.name.text;
          if (name === "className" || name === "style") {
            const line = sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1;
            reporter.fail(
              {
                error: "story-style",
                description: "Stories must not use className or style.",
                recommendation: "Move presentation into the component API.",
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
