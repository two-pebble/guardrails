import { basename } from "node:path";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that only files named exactly types.ts may contain "types" in their file name.
 */
export class ReservedContractFileNamesRule extends Guardrail {
  public readonly name = "reserved-contract-file-names";

  protected async check() {
    await this.forEachFile((file, reporter) => {
      const name = basename(file);
      if (name === "types.ts") return;

      if (name.includes("types") && /\.tsx?$/.test(name)) {
        reporter.fail({
          error: "reserved-name",
          description: 'Only files named exactly "types.ts" may contain "types" in the file name.',
          recommendation: "Rename the file or move definitions into types.ts.",
        });
      }
    });
  }
}
