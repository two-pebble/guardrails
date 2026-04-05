import type { GroupRuleEntry } from "./types";

/**
 * Defines a reusable collection of guardrail rules.
 */
export abstract class Group {
  public abstract readonly name: string;

  // Returns the rules that should be enabled for this group.
  public abstract rules(): GroupRuleEntry[];
}
