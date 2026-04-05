import { GuardrailsTsGroup } from "./groups/guardrails-ts-group";
import { NoDynamicImportsRule } from "./rules/no-dynamic-imports/rule";
import { PackageReadmeMdRule } from "./rules/package-readme-md/rule";
import { PathNamesKebabCaseRule } from "./rules/path-names-kebab-case/rule";

export const rules = [new PathNamesKebabCaseRule(), new NoDynamicImportsRule(), new PackageReadmeMdRule()];

export const groups = [new GuardrailsTsGroup()];
