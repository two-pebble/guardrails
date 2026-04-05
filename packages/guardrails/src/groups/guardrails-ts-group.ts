import { Group } from "../group";

export class GuardrailsTsGroup extends Group {
  public readonly name = "guardrails-typescript";

  public rules() {
    return GuardrailsTsGroup.baseRules();
  }

  public static baseRules() {
    return [
      { rule: "class-fields-at-top", config: {} },
      { rule: "class-file-name-matches-class", config: {} },
      { rule: "class-owns-utilities", config: {} },
      { rule: "export-classes", config: {} },
      { rule: "no-local-contracts-in-pure-class-files", config: {} },
      { rule: "pure-class-exports", config: {} },
      { rule: "require-class-jsdoc", config: {} },
      { rule: "require-public-method-comments", config: {} },
      { rule: "no-single-line-block-comments", config: {} },
      { rule: "max-indent-depth", config: { maxLevels: 8, indentWidth: 2 } },
      { rule: "path-names-kebab-case", config: {} },
      { rule: "pure-contract-files", config: {} },
      { rule: "pure-index-files", config: {} },
      { rule: "pure-tsx-files", config: {} },
      { rule: "pure-utils-folders", config: {} },
      { rule: "reserved-contract-file-names", config: {} },
      { rule: "no-complex-parameters", config: {} },
      { rule: "no-complex-returns", config: {} },
      { rule: "no-function-constructor-overloads", config: {} },
      { rule: "no-object-destructuring-parameters", config: {} },
      { rule: "no-dynamic-imports", config: {} },
      { rule: "no-exec-sync", config: {} },
      { rule: "no-import-meta-url", config: {} },
      { rule: "no-import-target-extensions", config: {} },
      { rule: "no-banned-as-casts", config: {} },
      { rule: "no-global-this", config: {} },
      { rule: "no-inline-await", config: {} },
      { rule: "no-mixed-logical-operators-in-if", config: {} },
      { rule: "no-new-error", config: {} },
      { rule: "no-object-assign", config: {} },
      { rule: "no-satisfies-keyword", config: {} },
      { rule: "test-block-format", config: { minLines: 5 } },
      { rule: "test-name-prefixes", config: { prefixes: ["happy: ", "unhappy: ", "snapshot: "] } },
      { rule: "max-test-assertions", config: { maxAssertions: 1 } },
      { rule: "max-test-it-block-lines", config: { maxLines: 10 } },
      { rule: "no-nested-describe-blocks", config: {} },
      { rule: "no-vi-mock", config: {} },
      { rule: "snapshot-tests-use-file-snapshots", config: {} },
      { rule: "test-files-use-vitest", config: {} },
      { rule: "pure-test-files", config: {} },
      { rule: "no-vitest-config-overrides", config: {} },
      { rule: "package-errors-file", config: {} },
      { rule: "package-readme-md", config: {} },
      { rule: "throw-package-errors", config: {} },
      { rule: "types-only-in-types-files", config: {} },
      { rule: "prefer-md-extension", config: {} },
    ];
  }
}
