import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";
import type { Reporter } from "../../constructs/reporter";

/**
 * Checks that snapshot tests use toMatchFileSnapshot with a path under ./snapshots/ instead of toMatchSnapshot.
 */
export class SnapshotTestsUseFileSnapshotsRule extends Guardrail {
  public readonly name = "snapshot-tests-use-file-snapshots";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (!file.endsWith(".test.ts") && !file.endsWith(".test.tsx")) return;

      this.walk(sourceFile, sourceFile, reporter);
    });
  }

  private walk(node: ts.Node, sourceFile: ts.SourceFile, reporter: Reporter) {
    if (ts.isCallExpression(node)) {
      const expr = node.expression;

      // Check for .toMatchSnapshot()
      if (ts.isPropertyAccessExpression(expr) && expr.name.text === "toMatchSnapshot") {
        reporter.fail(
          {
            error: "inline-snapshot",
            description: "Snapshot tests must not use .toMatchSnapshot().",
            recommendation: 'Use .toMatchFileSnapshot("./snapshots/...") instead.',
          },
          sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
        );
      }

      // Check for .toMatchFileSnapshot() with wrong path
      if (ts.isPropertyAccessExpression(expr) && expr.name.text === "toMatchFileSnapshot") {
        const arg = node.arguments[0];
        if (arg && ts.isStringLiteral(arg)) {
          if (!arg.text.startsWith("./snapshots/")) {
            reporter.fail(
              {
                error: "wrong-path",
                description: "Snapshot files must be written under ./snapshots relative to the test file.",
                recommendation: 'Use a path starting with "./snapshots/".',
              },
              sourceFile.getLineAndCharacterOfPosition(node.getStart()).line + 1,
            );
          }
        }
      }
    }

    ts.forEachChild(node, (child) => this.walk(child, sourceFile, reporter));
  }
}
