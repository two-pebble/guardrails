import { basename, dirname } from "node:path";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that Storybook story titles use the format "Category/Name" with exactly one slash.
 * The category must match an ancestor folder name in kebab-case.
 */
export class StoryTitleMatchesPathRule extends Guardrail {
  public readonly name = "story-title-matches-path";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (!file.endsWith(".story.tsx")) return;

      const title = StoryTitleMatchesPathRule.extractTitle(sourceFile);
      if (!title) return;

      const segments = title.split("/");
      if (segments.length !== 2) {
        reporter.fail({
          error: "title-path-mismatch",
          description: `Story title "${title}" must have exactly two segments (Category/Name). Found ${segments.length}.`,
          recommendation: 'Use the format "Category/Component Name" with exactly one slash.',
        });
        return;
      }

      const category = StoryTitleMatchesPathRule.toKebab(segments[0]);
      let current = dirname(file);

      // Walk up until we find the category folder
      let found = false;
      for (let i = 0; i < 10; i++) {
        if (basename(current) === category) {
          found = true;
          break;
        }
        current = dirname(current);
      }

      if (!found) {
        reporter.fail({
          error: "title-path-mismatch",
          description: `Story title "${title}" category "${segments[0]}" does not match any ancestor folder.`,
          recommendation: "The first segment must match an ancestor folder name.",
        });
      }
    });
  }

  private static extractTitle(sourceFile: ts.SourceFile) {
    let title: string | undefined;
    const visit = (node: ts.Node) => {
      if (title) return;
      if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && node.name.text === "title") {
        if (ts.isStringLiteral(node.initializer)) {
          title = node.initializer.text;
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
    return title;
  }

  private static toKebab(segment: string) {
    return segment
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/\s+/g, "-")
      .toLowerCase();
  }
}
