import { basename } from "node:path";
import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that files which only export types/interfaces are named types.ts.
 * If a .ts file exports nothing but type aliases, interfaces, and re-exports
 * of types, it must be called types.ts (or *.contracts.ts).
 */
export class TypesOnlyInTypesFilesRule extends Guardrail {
  public readonly name = "types-only-in-types-files";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      const name = basename(file);

      if (name === "types.ts" || name.endsWith(".contracts.ts") || name === "index.ts") return;
      if (name.endsWith(".test.ts") || name.endsWith(".story.tsx") || name.endsWith(".tsx")) return;

      const hasRuntimeExport = this.hasRuntimeExports(sourceFile);
      if (hasRuntimeExport) return;

      const hasTypeExport = this.hasTypeExports(sourceFile);
      if (!hasTypeExport) return;

      reporter.fail({
        error: "types-not-in-types-file",
        description: "Files that only export types and interfaces must be named types.ts.",
        recommendation: "Rename this file to types.ts or merge its contents into an existing types.ts.",
      });
    });
  }

  private hasTypeExports(sourceFile: ts.SourceFile) {
    for (const statement of sourceFile.statements) {
      if (ts.isInterfaceDeclaration(statement) && this.isExported(statement)) return true;
      if (ts.isTypeAliasDeclaration(statement) && this.isExported(statement)) return true;
      if (ts.isExportDeclaration(statement) && statement.isTypeOnly) return true;
    }
    return false;
  }

  private hasRuntimeExports(sourceFile: ts.SourceFile) {
    for (const statement of sourceFile.statements) {
      if (ts.isImportDeclaration(statement)) continue;
      if (ts.isInterfaceDeclaration(statement)) continue;
      if (ts.isTypeAliasDeclaration(statement)) continue;
      if (ts.isExportDeclaration(statement) && statement.isTypeOnly) continue;

      if (ts.isFunctionDeclaration(statement) && this.isExported(statement)) return true;
      if (ts.isClassDeclaration(statement) && this.isExported(statement)) return true;
      if (ts.isVariableStatement(statement) && this.isExported(statement)) return true;
      if (ts.isEnumDeclaration(statement) && this.isExported(statement)) return true;
      if (ts.isExportDeclaration(statement) && !statement.isTypeOnly) return true;
      if (ts.isExportAssignment(statement)) return true;
    }
    return false;
  }

  private isExported(node: ts.Node) {
    const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
    return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
  }
}
