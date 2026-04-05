import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that files exporting a class do not define local interfaces or type aliases.
 */
export class NoLocalContractsInPureClassFilesRule extends Guardrail {
  public readonly name = "no-local-contracts-in-pure-class-files";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      let exportsClass = false;
      const localContracts: { name: string; line: number }[] = [];

      for (const statement of sourceFile.statements) {
        const modifiers = ts.canHaveModifiers(statement) ? ts.getModifiers(statement) : undefined;
        const isExported = modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;

        if (ts.isClassDeclaration(statement) && isExported) {
          exportsClass = true;
        }

        if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
          const line = sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1;
          localContracts.push({ name: statement.name?.getText() ?? "<anonymous>", line });
        }
      }

      if (exportsClass && localContracts.length > 0) {
        for (const contract of localContracts) {
          reporter.fail(
            {
              error: "local-contract",
              description: "Files that export a class must not define local types or interfaces.",
              recommendation: "Move supporting types into a separate module.",
            },
            contract.line,
          );
        }
      }
    });
  }
}
