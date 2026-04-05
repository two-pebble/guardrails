import { GuardrailsNextjsGroup } from "./groups/guardrails-nextjs-group";
import { GuardrailsStorybookGroup } from "./groups/guardrails-storybook-group";
import { GuardrailsTsGroup } from "./groups/guardrails-ts-group";
import { ClassFieldsAtTopRule } from "./rules/class-fields-at-top/rule";
import { ClassFileNameMatchesClassRule } from "./rules/class-file-name-matches-class/rule";
import { ClassOwnsUtilitiesRule } from "./rules/class-owns-utilities/rule";
import { CodeStructureRule } from "./rules/code-structure/rule";
import { ExportClassesRule } from "./rules/export-classes/rule";
import { FileContentRule } from "./rules/file-content/rule";
import { ItBlockFormatRule } from "./rules/it-block-format/rule";
import { ItNamePrefixesRule } from "./rules/it-name-prefixes/rule";
import { MaxIndentDepthRule } from "./rules/max-indent-depth/rule";
import { MaxTestAssertionsRule } from "./rules/max-test-assertions/rule";
import { MaxTestItBlockLinesRule } from "./rules/max-test-it-block-lines/rule";
import { NextjsAppFileLocationRule } from "./rules/nextjs-app-file-location/rule";
import { NoBannedAsCastsRule } from "./rules/no-banned-as-casts/rule";
import { NoComplexParametersRule } from "./rules/no-complex-parameters/rule";
import { NoComplexReturnsRule } from "./rules/no-complex-returns/rule";
import { NoCustomColorsRule } from "./rules/no-custom-colors/rule";
import { NoCustomStyleRule } from "./rules/no-custom-style/rule";
import { NoDynamicImportsRule } from "./rules/no-dynamic-imports/rule";
import { NoExecSyncRule } from "./rules/no-exec-sync/rule";
import { NoFunctionConstructorOverloadsRule } from "./rules/no-function-constructor-overloads/rule";
import { NoGlobalThisRule } from "./rules/no-global-this/rule";
import { NoImportMetaUrlRule } from "./rules/no-import-meta-url/rule";
import { NoImportTargetExtensionsRule } from "./rules/no-import-target-extensions/rule";
import { NoInlineAwaitRule } from "./rules/no-inline-await/rule";
import { NoLocalContractsInPureClassFilesRule } from "./rules/no-local-contracts-in-pure-class-files/rule";
import { NoMixedLogicalOperatorsInIfRule } from "./rules/no-mixed-logical-operators-in-if/rule";
import { NoNestedDescribeBlocksRule } from "./rules/no-nested-describe-blocks/rule";
import { NoNewErrorRule } from "./rules/no-new-error/rule";
import { NoObjectAssignRule } from "./rules/no-object-assign/rule";
import { NoObjectDestructuringParametersRule } from "./rules/no-object-destructuring-parameters/rule";
import { NoSatisfiesKeywordRule } from "./rules/no-satisfies-keyword/rule";
import { NoSingleLineBlockCommentsRule } from "./rules/no-single-line-block-comments/rule";
import { NoSoloFilesRule } from "./rules/no-solo-files/rule";
import { NoStoryClassnameOrStyleRule } from "./rules/no-story-classname-or-style/rule";
import { NoUnderscoreNamesRule } from "./rules/no-underscore-names/rule";
import { NoViMockRule } from "./rules/no-vi-mock/rule";
import { NoVitestConfigOverridesRule } from "./rules/no-vitest-config-overrides/rule";
import { PackageErrorsFileRule } from "./rules/package-errors-file/rule";
import { PackageReadmeMdRule } from "./rules/package-readme-md/rule";
import { PathNamesKebabCaseRule } from "./rules/path-names-kebab-case/rule";
import { PreferMdExtensionRule } from "./rules/prefer-md-extension/rule";
import { PureClassExportsRule } from "./rules/pure-class-exports/rule";
import { PureContractFilesRule } from "./rules/pure-contract-files/rule";
import { PureIndexFilesRule } from "./rules/pure-index-files/rule";
import { PureTestFilesRule } from "./rules/pure-test-files/rule";
import { PureTsxFilesRule } from "./rules/pure-tsx-files/rule";
import { PureUtilsFoldersRule } from "./rules/pure-utils-folders/rule";
import { RequireClassJsdocRule } from "./rules/require-class-jsdoc/rule";
import { RequireComponentStoryRule } from "./rules/require-component-story/rule";
import { RequirePageDataFileRule } from "./rules/require-page-data-file/rule";
import { RequirePublicMethodCommentsRule } from "./rules/require-public-method-comments/rule";
import { RequireSyntaxExampleRule } from "./rules/require-syntax-example/rule";
import { RequiredScriptsRule } from "./rules/required-scripts/rule";
import { ReservedContractFileNamesRule } from "./rules/reserved-contract-file-names/rule";
import { SingleTsxExportRule } from "./rules/single-tsx-export/rule";
import { SnapshotTestsUseFileSnapshotsRule } from "./rules/snapshot-tests-use-file-snapshots/rule";
import { StoryTitleMatchesPathRule } from "./rules/story-title-matches-path/rule";
import { StringMappingRule } from "./rules/string-mapping/rule";
import { TestFilesUseVitestRule } from "./rules/test-files-use-vitest/rule";
import { ThrowPackageErrorsRule } from "./rules/throw-package-errors/rule";
import { TypesOnlyInTypesFilesRule } from "./rules/types-only-in-types-files/rule";

export const rules = [
  new CodeStructureRule(),
  new ClassFieldsAtTopRule(),
  new ClassFileNameMatchesClassRule(),
  new ClassOwnsUtilitiesRule(),
  new ExportClassesRule(),
  new FileContentRule(),
  new ItBlockFormatRule(),
  new ItNamePrefixesRule(),
  new MaxIndentDepthRule(),
  new MaxTestAssertionsRule(),
  new MaxTestItBlockLinesRule(),
  new NoBannedAsCastsRule(),
  new NoComplexParametersRule(),
  new NoComplexReturnsRule(),
  new NoCustomColorsRule(),
  new NoCustomStyleRule(),
  new NoDynamicImportsRule(),
  new NoExecSyncRule(),
  new NoFunctionConstructorOverloadsRule(),
  new NoGlobalThisRule(),
  new NoImportMetaUrlRule(),
  new NoImportTargetExtensionsRule(),
  new NoInlineAwaitRule(),
  new NoLocalContractsInPureClassFilesRule(),
  new NoMixedLogicalOperatorsInIfRule(),
  new NoNestedDescribeBlocksRule(),
  new NoNewErrorRule(),
  new NoObjectAssignRule(),
  new NoObjectDestructuringParametersRule(),
  new NoSatisfiesKeywordRule(),
  new NoSingleLineBlockCommentsRule(),
  new NoSoloFilesRule(),
  new NoStoryClassnameOrStyleRule(),
  new NoUnderscoreNamesRule(),
  new NoViMockRule(),
  new NoVitestConfigOverridesRule(),
  new PackageErrorsFileRule(),
  new PackageReadmeMdRule(),
  new PathNamesKebabCaseRule(),
  new PreferMdExtensionRule(),
  new PureClassExportsRule(),
  new PureContractFilesRule(),
  new PureIndexFilesRule(),
  new PureTestFilesRule(),
  new PureTsxFilesRule(),
  new PureUtilsFoldersRule(),
  new RequireClassJsdocRule(),
  new RequireComponentStoryRule(),
  new RequiredScriptsRule(),
  new RequirePageDataFileRule(),
  new RequirePublicMethodCommentsRule(),
  new RequireSyntaxExampleRule(),
  new ReservedContractFileNamesRule(),
  new SingleTsxExportRule(),
  new SnapshotTestsUseFileSnapshotsRule(),
  new StoryTitleMatchesPathRule(),
  new StringMappingRule(),
  new TestFilesUseVitestRule(),
  new ThrowPackageErrorsRule(),
  new TypesOnlyInTypesFilesRule(),
  new NextjsAppFileLocationRule(),
];

export const groups = [new GuardrailsTsGroup(), new GuardrailsStorybookGroup(), new GuardrailsNextjsGroup()];
