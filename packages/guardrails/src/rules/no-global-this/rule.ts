import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Bans usage of globalThis to prevent implicit global pollution.
 */
export class NoGlobalThisRule extends Guardrail {
  public readonly name = "no-global-this";

  protected async check() {
    await this.forEachSourceTypeScriptFile((_file, sourceFile, reporter) => {
      ts.forEachChild(sourceFile, function visit(node) {
        if (ts.isIdentifier(node) && node.text === "globalThis") {
          const line = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
          reporter.fail(
            {
              error: "global-this",
              description: "Do not use globalThis.",
              recommendation: "Use dependency injection or a factory pattern instead of mutating globals.",
            },
            line,
          );
        }

        ts.forEachChild(node, visit);
      });
    });
  }
}
