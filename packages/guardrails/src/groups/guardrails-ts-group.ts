import { Group } from "../group";

export class GuardrailsTsGroup extends Group {
  public readonly name = "guardrails-typescript";

  public rules() {
    return [
      { rule: "path-names-kebab-case", config: {} },
      { rule: "no-dynamic-imports", config: {} },
      { rule: "package-readme-md", config: {} },
      { rule: "prefer-md-extension", config: {} },
    ];
  }
}
