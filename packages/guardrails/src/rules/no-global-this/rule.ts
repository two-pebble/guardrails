import { Guardrail } from "../../constructs/guardrail";

/**
 * Bans usage of globalThis to prevent implicit global pollution.
 */
export class NoGlobalThisRule extends Guardrail {
  public readonly name = "no-global-this";

  protected async check() {
    await this.failOnRegex(new RegExp(`\\bglobal${"This"}\\b`), {
      error: "global-this",
      description: "Do not use globalThis.",
      recommendation: "Use dependency injection or a factory pattern instead of mutating globals.",
    });
  }
}
