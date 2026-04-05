import ts from "typescript";
import { Guardrail } from "../../constructs/guardrail";

/**
 * Checks that functions and constructors do not use overload signatures.
 */
export class NoFunctionConstructorOverloadsRule extends Guardrail {
  public readonly name = "no-function-constructor-overloads";

  protected async check() {
    await this.forEachTypeScriptFile((_file, sourceFile, reporter) => {
      // Check for function overloads at module level
      const functionNames = new Map<string, ts.FunctionDeclaration[]>();

      const collectFunctions = (node: ts.Node) => {
        if (ts.isFunctionDeclaration(node) && node.name) {
          const name = node.name.text;
          const existing = functionNames.get(name) || [];
          existing.push(node);
          functionNames.set(name, existing);
        }
      };

      ts.forEachChild(sourceFile, collectFunctions);

      for (const [, declarations] of functionNames) {
        if (declarations.length > 1) {
          // Report on the first declaration
          const firstDecl = declarations[0];
          const line = sourceFile.getLineAndCharacterOfPosition(firstDecl.getStart()).line + 1;
          reporter.fail(
            {
              error: "function-overloads",
              description: "Multiple function signatures are not allowed.",
              recommendation: "Use one explicit contract or split into separate functions.",
            },
            line,
          );
        }
      }

      // Check for constructor overloads in classes
      const visitClasses = (node: ts.Node) => {
        if (ts.isClassDeclaration(node) || ts.isClassExpression(node)) {
          const constructors = node.members.filter((m): m is ts.ConstructorDeclaration =>
            ts.isConstructorDeclaration(m),
          );
          if (constructors.length > 1) {
            const line = sourceFile.getLineAndCharacterOfPosition(constructors[0].getStart()).line + 1;
            reporter.fail(
              {
                error: "constructor-overloads",
                description: "Multiple constructor signatures are not allowed.",
                recommendation: "Split distinct creation paths into named factories.",
              },
              line,
            );
          }
        }
        ts.forEachChild(node, visitClasses);
      };
      visitClasses(sourceFile);
    });
  }
}
