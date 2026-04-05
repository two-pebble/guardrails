import type { GroupRuleEntry } from "./types";

export abstract class Group {
  public abstract readonly name: string;

  public abstract rules(): GroupRuleEntry[];
}
