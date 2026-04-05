import { Group } from "../group";
import type { RuleConfig } from "../types";

export class GuardrailsTsGroup extends Group {
  public readonly name = "guardrails-typescript";

  private static get tsPaths(): RuleConfig {
    return { paths: ["src/**/*.ts", "src/**/*.tsx"] };
  }

  public rules() {
    const ts = GuardrailsTsGroup.tsPaths;

    return [
      { rule: "path-names-kebab-case", config: ts },
      { rule: "no-dynamic-imports", config: ts },
      { rule: "package-readme-md", config: { paths: ["**/package.json"] } },
    ];
  }
}
