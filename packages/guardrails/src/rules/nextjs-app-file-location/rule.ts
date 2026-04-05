import { basename, relative } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Files under src/app that are not Next.js route files must live inside
 * a "components" or "actions" folder.
 */
export class NextjsAppFileLocationRule extends Guardrail {
  public readonly name = "nextjs-app-file-location";
  private readonly allowedFiles = new Set(['page.tsx', 'layout.tsx', 'route.ts', 'data.ts', 'loading.tsx', 'error.tsx', 'not-found.tsx']); // biome-ignore format: keep on one line
  private readonly allowedParents = new Set(["components", "actions"]);

  protected async check() {
    await this.forEachFile((file, reporter) => {
      const rel = relative(this.packageDir, file);

      if (!rel.startsWith("src/app")) return;

      const fileName = basename(file);
      if (this.allowedFiles.has(fileName)) return;

      const parts = rel.split("/");
      const hasAllowedParent = parts.some((part) => this.allowedParents.has(part));

      if (!hasAllowedParent) {
        reporter.fail({
          error: "misplaced-app-file",
          description: `"${fileName}" is not a Next.js route file and must be inside a components/ or actions/ folder.`,
          recommendation: "Move this file into a components/ or actions/ subdirectory.",
        });
      }
    });
  }
}
