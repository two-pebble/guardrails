import { Group } from "../group";
import { GuardrailsTsGroup } from "./guardrails-ts-group";

export class GuardrailsNextjsGroup extends Group {
  public readonly name = "guardrails-nextjs";

  public rules() {
    return [
      ...GuardrailsTsGroup.baseRules().filter((entry) => entry.rule !== "no-object-destructuring-parameters"),
      { rule: "no-custom-style", config: {} },
      { rule: "no-custom-colors", config: {} },
      { rule: "single-tsx-export", config: {} },
      { rule: "require-page-data-file", config: {} },
      { rule: "nextjs-app-file-location", config: {} },
    ];
  }
}
