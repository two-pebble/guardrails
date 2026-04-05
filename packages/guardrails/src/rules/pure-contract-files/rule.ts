import { basename } from "node:path";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that types.ts files contain only imports, exports, interfaces, and type aliases.
 */
export class PureContractFilesRule extends Guardrail {
  public readonly name = "pure-contract-files";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (basename(file) !== "types.ts") return;

      for (const statement of sourceFile.statements) {
        if (
          ts.isImportDeclaration(statement) ||
          ts.isExportDeclaration(statement) ||
          ts.isExportAssignment(statement) ||
          ts.isInterfaceDeclaration(statement) ||
          ts.isTypeAliasDeclaration(statement)
        ) {
          continue;
        }

        reporter.fail(
          {
            error: "non-declarative",
            description: "types.ts files must contain only imports, exports, interfaces, and type aliases.",
            recommendation: "Keep types modules purely declarative.",
          },
          sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1,
        );
      }
    });
  }
}
