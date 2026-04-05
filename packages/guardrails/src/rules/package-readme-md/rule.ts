import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

export class PackageReadmeMdRule extends Guardrail {
  public readonly name = "package-readme-md";

  protected async check() {
    const readmePath = resolve(this.getPackageRoot(), "README.md");
    const reporter = this.createReporter(readmePath);

    if (!existsSync(readmePath)) {
      reporter.fail({
        error: "missing-readme-md",
        description: "Packages must include a sidecar README.md at the package root.",
        recommendation: "Add README.md with Intent and Examples sections.",
      });
      return;
    }

    const content = readFileSync(readmePath, "utf-8");
    const lines = content.split("\n").map((line) => line.trim());
    const hasTopHeading = lines.some((line) => /^# /.test(line));
    const intentIndex = lines.indexOf("## Intent");
    const examplesIndex = lines.indexOf("## Examples");
    const h2Sections = lines.filter((line) => /^## /.test(line));
    const onlyAllowedH2 = h2Sections.every((line) => line === "## Intent" || line === "## Examples");

    if (!hasTopHeading || intentIndex === -1 || examplesIndex === -1 || examplesIndex < intentIndex || !onlyAllowedH2) {
      reporter.fail({
        error: "invalid-structure",
        description: "README.md must start with a # heading and contain only ## Intent followed by ## Examples.",
        recommendation: "Structure the document with the required headings.",
      });
    }
  }
}
