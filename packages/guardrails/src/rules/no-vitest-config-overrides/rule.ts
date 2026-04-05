import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that vitest config files do not exclude coverage or skip tests with no test files.
 */
export class NoVitestConfigOverridesRule extends Guardrail {
  public readonly name = "no-vitest-config-overrides";

  protected async check() {
    await this.forEachVitestConfigFileContent((_file, content, reporter) => {
      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (/passWithNoTests\s*:\s*true/.test(line)) {
          reporter.fail(
            {
              error: "pass-with-no-tests",
              description: "passWithNoTests: true is not allowed in vitest config.",
              recommendation: "Remove passWithNoTests. Every package must have tests.",
            },
            i + 1,
          );
        }
      }

      // Check for coverage.exclude anywhere in the file
      if (/coverage[\s\S]*?exclude\s*:/.test(content)) {
        // Find the line with "exclude" inside a coverage block for accurate reporting
        let inCoverage = false;
        for (let i = 0; i < lines.length; i++) {
          if (/coverage\s*[:{]/.test(lines[i])) {
            inCoverage = true;
          }
          if (inCoverage && /exclude\s*:/.test(lines[i])) {
            reporter.fail(
              {
                error: "coverage-exclude",
                description: "Excluding files from coverage is not allowed in vitest config.",
                recommendation: "Remove the coverage.exclude configuration. All source files must have coverage.",
              },
              i + 1,
            );
          }
        }
      }
    });
  }
}
