import { Group } from "../group";
import { GuardrailsTsGroup } from "./guardrails-ts-group";

/**
 * Extends the TypeScript baseline with Storybook-specific rules.
 */
export class GuardrailsStorybookGroup extends Group {
  public readonly name = "guardrails-storybook";

  // Returns the Storybook guardrail set.
  public rules() {
    return [
      ...GuardrailsTsGroup.baseRules(),
      {
        rule: "code-structure",
        config: {
          "no-direct-files": ["src/components"],
          "no-sub-folders": ["src/components/**/**"],
        },
      },
      { rule: "no-custom-colors", config: {} },
      { rule: "require-component-story", config: {} },
      { rule: "require-syntax-example", config: {} },
      { rule: "story-title-matches-path", config: {} },
      { rule: "no-story-classname-or-style", config: {} },
    ];
  }
}
