import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Bans execSync usage. All exec calls must be async.
 */
export class NoExecSyncRule extends Guardrail {
  public readonly name = "no-exec-sync";

  protected async check() {
    await this.forEachSourceTypeScriptFile((_file, sourceFile, reporter) => {
      ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isIdentifier(node) && node.text === "execSync") {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
          reporter.fail(
            {
              error: "exec-sync",
              description: "execSync is not allowed. Use async exec instead.",
              recommendation:
                "Replace execSync with the async exec from node:child_process. Sync calls can be bad for performance and can block the event loop.",
            },
            line,
          );
        }

        ts.forEachChild(node, visit);
      });
    });
  }
}
