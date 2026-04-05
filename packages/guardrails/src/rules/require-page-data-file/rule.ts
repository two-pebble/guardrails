import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that every page.tsx has a sidecar data.ts file exporting an async loadPageData function.
 */
export class RequirePageDataFileRule extends Guardrail {
  public readonly name = "require-page-data-file";

  protected async check() {
    await this.forEachFile((file, reporter) => {
      if (!file.endsWith("/page.tsx")) return;

      const dir = dirname(file);
      const dataFile = join(dir, "data.ts");

      if (!existsSync(dataFile)) {
        reporter.fail({
          error: "missing-data-file",
          description: "page.tsx must have a sidecar data.ts file.",
          recommendation: "Create a data.ts file next to this page with an exported async loadPageData function.",
        });
        return;
      }

      const content = readFileSync(dataFile, "utf-8");
      if (!/export\s+async\s+function\s+loadPageData/.test(content)) {
        reporter.fail({
          error: "missing-load-page-data",
          description: "data.ts must export an async function named loadPageData.",
          recommendation: 'Add "export async function loadPageData() { ... }" to data.ts.',
        });
      }
    });
  }
}
