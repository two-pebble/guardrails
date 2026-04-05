import { readFileSync } from "node:fs";
import { parse, relative } from "node:path";
import { Guardrail } from "../../constructs/guardrail";
import { Reporter } from "../../constructs/reporter";

/**
 * Checks that every source file resolves to a required mapped string inside target files.
 */
export class StringMappingRule extends Guardrail {
  public readonly name = "string-mapping";

  protected async check() {
    const cases = (this.options.cases ?? []) as Record<string, unknown>[];

    for (const entry of cases) {
      const source = (entry.source ?? {}) as Record<string, unknown>;
      const matches = (entry.matches ?? {}) as Record<string, unknown>;

      if (source.type !== "files-like" || matches.type !== "strings-like") {
        continue;
      }

      const sourceFiles = await this.resolvePaths(StringMappingRule.asPatterns(source.files));
      const targetFiles = await this.resolvePaths(StringMappingRule.asPatterns(matches.files));
      const targetContents = targetFiles.map((file) => ({
        file,
        content: readFileSync(file, "utf-8"),
      }));

      for (const sourceFile of sourceFiles) {
        const reporter = new Reporter(this.name, sourceFile);
        const expectedString = StringMappingRule.interpolate(matches.pattern as string, this.packageDir, sourceFile);
        const hasMatch = targetContents.some((target) => target.content.includes(expectedString));

        if (!hasMatch) {
          reporter.fail({
            error: "missing-mapped-string",
            description: `Expected to find "${expectedString}" in files matching the target pattern.`,
            recommendation:
              (entry.reason as string | undefined) ?? "Add the required mapped string to one of the target files.",
          });
        }

        this.addReporter(reporter);
      }
    }
  }

  private static interpolate(pattern: string, packageDir: string, sourceFile: string) {
    const relativePath = relative(packageDir, sourceFile);
    const parsed = parse(sourceFile);

    return pattern.replaceAll("$0", relativePath).replaceAll("$1", parsed.name).replaceAll("$2", parsed.base);
  }

  private static asPatterns(value: unknown) {
    if (typeof value === "string") {
      return [value];
    }

    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
  }
}
