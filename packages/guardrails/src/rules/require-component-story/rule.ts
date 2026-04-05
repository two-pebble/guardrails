import { existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that primary component TSX files have a corresponding .story.tsx file.
 * A primary component is one whose filename matches its parent directory name.
 */
export class RequireComponentStoryRule extends Guardrail {
  public readonly name = "require-component-story";

  protected async check() {
    await this.forEachFile((file, reporter) => {
      if (!file.endsWith(".tsx")) return;
      if (file.endsWith(".story.tsx") || file.endsWith(".test.tsx")) return;

      const dir = dirname(file);
      const dirName = basename(dir);
      const fileName = basename(file, ".tsx");

      if (fileName !== dirName) return;

      const storyFile = join(dir, `${fileName}.story.tsx`);

      if (!existsSync(storyFile)) {
        reporter.fail({
          error: "missing-story",
          description: "Component files must have a corresponding .story.tsx file.",
          recommendation: "Create a story file for this component.",
        });
      }
    });
  }
}
