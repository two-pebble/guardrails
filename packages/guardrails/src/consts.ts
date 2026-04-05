import { GuardrailsTsGroup } from "./groups/guardrails-ts-group";
import { NoDynamicImportsRule } from "./rules/no-dynamic-imports/rule";
import { PackageReadmeMdRule } from "./rules/package-readme-md/rule";
import { PathNamesKebabCaseRule } from "./rules/path-names-kebab-case/rule";
import { PreferMdExtensionRule } from "./rules/prefer-md-extension/rule";
import { RequiredScriptsRule } from "./rules/required-scripts/rule";

export const rules = [
  new PathNamesKebabCaseRule(),
  new NoDynamicImportsRule(),
  new PackageReadmeMdRule(),
  new PreferMdExtensionRule(),
  new RequiredScriptsRule(),
];

export const groups = [new GuardrailsTsGroup()];
