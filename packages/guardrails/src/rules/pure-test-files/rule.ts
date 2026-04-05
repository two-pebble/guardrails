import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";
import type { Reporter } from "../../constructs/reporter";

/**
 * Checks that test files contain only imports, constants, and describe blocks with direct test() calls.
 */
export class PureTestFilesRule extends Guardrail {
  public readonly name = "pure-test-files";

  protected async check() {
    await this.forEachTypeScriptFile((file, sourceFile, reporter) => {
      if (!file.endsWith(".test.ts") && !file.endsWith(".test.tsx")) return;

      for (const statement of sourceFile.statements) {
        if (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) {
          continue;
        }

        // Allow const declarations (fixtures, rule instances, etc.)
        if (ts.isVariableStatement(statement)) {
          const flags = statement.declarationList.flags;
          if (flags & ts.NodeFlags.Const) {
            continue;
          }
        }

        // Allow describe(...) calls at top level
        if (ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression)) {
          const expr = statement.expression.expression;
          if (ts.isIdentifier(expr) && expr.text === "describe") {
            this.checkDescribeBody(statement.expression, sourceFile, reporter);
            continue;
          }
        }

        reporter.fail(
          {
            error: "top-level-non-describe",
            description: "Test files must not define local functions, classes, or types outside describe blocks.",
            recommendation: "Move helpers to testing utilities.",
          },
          sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1,
        );
      }
    });
  }

  private checkDescribeBody(call: ts.CallExpression, sourceFile: ts.SourceFile, reporter: Reporter) {
    const callback = call.arguments[call.arguments.length - 1];
    const isCallbackFunction = callback && (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback));
    if (!isCallbackFunction) return;

    const body = callback.body;
    if (!ts.isBlock(body)) return;

    for (const statement of body.statements) {
      if (ts.isExpressionStatement(statement) && ts.isCallExpression(statement.expression)) {
        const expr = statement.expression.expression;
        const isTestCall = ts.isIdentifier(expr) && (expr.text === "test" || expr.text === "it");
        if (isTestCall) {
          continue;
        }
      }

      // Allow const declarations inside describe (setup variables)
      if (ts.isVariableStatement(statement)) {
        const flags = statement.declarationList.flags;
        if (flags & ts.NodeFlags.Const) {
          continue;
        }
      }

      reporter.fail(
        {
          error: "non-it-in-describe",
          description: "Test describe blocks must contain only direct test(...) calls and const declarations.",
          recommendation: "Keep tests declarative.",
        },
        sourceFile.getLineAndCharacterOfPosition(statement.getStart()).line + 1,
      );
    }
  }
}
