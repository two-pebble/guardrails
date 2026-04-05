import { Guardrail } from "../../constructs/guardrail";

/**
 * Bans execSync usage. All exec calls must be async.
 */
export class NoExecSyncRule extends Guardrail {
  public readonly name = "no-exec-sync";

  protected async check() {
    await this.failOnRegex(/\bexecSync\b/, {
      error: "exec-sync",
      description: "execSync is not allowed. Use async exec instead.",
      recommendation:
        "Replace execSync with the async exec from node:child_process. Sync calls can be bad for performance and can block the event loop.",
    });
  }
}
