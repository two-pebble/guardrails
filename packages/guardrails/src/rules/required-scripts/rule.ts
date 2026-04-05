import { Guardrail } from "../../constructs/guardrail";
import type { PackageJsonShape } from "./types";

/**
 * Requires package.json to define a configured list of scripts.
 */
export class RequiredScriptsRule extends Guardrail {
  public readonly name = "required-scripts";

  protected async check() {
    const packageJsonPath = this.resolvePackagePath("package.json");
    const reporter = this.createReporter(packageJsonPath);

    if (!this.packageFileExists("package.json")) {
      reporter.fail({
        error: "missing-package-json",
        description: "The required-scripts rule expects a package.json at the package root.",
        recommendation: "Add a package.json before enabling this rule.",
      });
      return;
    }

    const packageJson = JSON.parse(this.readPackageFile("package.json")) as PackageJsonShape;
    const scripts = packageJson.scripts ?? {};
    const requiredScripts = this.getRequiredScripts();
    const missingScripts = requiredScripts.filter((scriptName) => !this.hasScript(scripts, scriptName));

    if (missingScripts.length > 0) {
      reporter.fail({
        error: "missing-required-scripts",
        description: `package.json must define the required scripts: ${missingScripts.join(", ")}.`,
        recommendation: "Add each missing script to package.json#scripts.",
      });
    }
  }

  private getRequiredScripts() {
    return this.options.requiredScripts as string[];
  }

  private hasScript(scripts: Record<string, unknown>, scriptName: string) {
    const value = scripts[scriptName];
    return typeof value === "string" && value.trim().length > 0;
  }
}
