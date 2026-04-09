import { existsSync, readFileSync } from "node:fs";
import { posix, relative, resolve } from "node:path";
import { glob } from "tinyglobby";
import ts from "typescript";
import { InvalidGuardrailUsageError } from "../errors";
import type { DiagnosticError, GuardrailContext, RuleOptions } from "../types";
import type {
  DirectoryCallback,
  DirectoryPathsOrCallback,
  FailOnRegexPathsOrPattern,
  FailOnRegexPatternOrError,
  FileCallback,
  FileContentCallback,
  FileContentPathsOrCallback,
  FilePathsOrCallback,
  GuardrailPathSegments,
  GuardrailPaths,
  TypeScriptFileCallback,
  TypeScriptPathsOrCallback,
} from "./guardrail.contracts";
import { Reporter } from "./reporter";

/**
 * Provides shared package-scoped file iteration helpers for individual guardrail rules.
 */
export abstract class Guardrail<TOptions extends object = RuleOptions> {
  private static readonly sourceTypeScriptPaths = ["src/**/*.ts", "src/**/*.tsx"] as const;
  private static readonly testTypeScriptPaths = ["src/**/*.test.ts", "src/**/*.test.tsx"] as const;
  private static readonly tsxPaths = ["src/**/*.tsx"] as const;
  private static readonly componentStoryPaths = ["src/components/**/*.story.tsx"] as const;
  private static readonly vitestConfigPaths = ["vitest.config.ts"] as const;
  public abstract readonly name: string;
  private context!: GuardrailContext<RuleOptions>;
  private reporters: Reporter[] = [];

  // Executes the rule with package-scoped context and returns collected reporters.
  public async execute(context: GuardrailContext) {
    this.context = context;
    this.reporters = [];
    await this.check();
    return this.reporters;
  }

  protected abstract check(): Promise<void>;

  protected get options(): Readonly<TOptions> {
    return (this.context.options ?? {}) as TOptions;
  }

  protected get packageDir() {
    return this.context.packageDir;
  }

  protected getPackageRoot() {
    return this.context.packageDir;
  }

  protected resolvePackagePath(...segments: GuardrailPathSegments) {
    return resolve(this.getPackageRoot(), ...segments);
  }

  protected packageFileExists(relativePath: string) {
    return existsSync(this.resolvePackagePath(relativePath));
  }

  protected readPackageFile(relativePath: string) {
    return readFileSync(this.resolvePackagePath(relativePath), "utf-8");
  }

  protected getRelativePath(targetPath: string) {
    return relative(this.getPackageRoot(), targetPath).replaceAll("\\", "/");
  }

  protected createReporter(file?: string) {
    const reporter = new Reporter(this.name, file);
    this.reporters.push(reporter);
    return reporter;
  }

  protected addReporter(reporter: Reporter) {
    this.reporters.push(reporter);
  }

  protected async failOnRegex(pattern: RegExp, error: DiagnosticError): Promise<void>;
  protected async failOnRegex(paths: GuardrailPaths, pattern: RegExp, error: DiagnosticError): Promise<void>;
  protected async failOnRegex(
    pathsOrPattern: FailOnRegexPathsOrPattern,
    patternOrError: FailOnRegexPatternOrError,
    maybeError?: DiagnosticError,
  ) {
    const paths = pathsOrPattern instanceof RegExp ? undefined : pathsOrPattern;
    const pattern = pathsOrPattern instanceof RegExp ? pathsOrPattern : (patternOrError as RegExp);
    const error = pathsOrPattern instanceof RegExp ? (patternOrError as DiagnosticError) : maybeError;

    if (!error) {
      throw new InvalidGuardrailUsageError(`Guardrail ${this.name} must provide a diagnostic error for failOnRegex.`);
    }

    await this.forEachFileContent(paths ?? Guardrail.sourceTypeScriptPaths, (_file, content, reporter) => {
      const lines = content.split("\n");
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        if (pattern.test(lines[lineIndex])) {
          reporter.fail(error, lineIndex + 1);
        }
      }
    });
  }

  protected async forEachSourceFile(callback: FileCallback) {
    await this.forEachFile(Guardrail.sourceTypeScriptPaths, callback);
  }

  protected async forEachSourceFileContent(callback: FileContentCallback) {
    await this.forEachFileContent(Guardrail.sourceTypeScriptPaths, callback);
  }

  protected async forEachSourceTypeScriptFile(callback: TypeScriptFileCallback) {
    await this.forEachTypeScriptFile(Guardrail.sourceTypeScriptPaths, callback);
  }

  protected async forEachSourceDirectory(callback: DirectoryCallback) {
    await this.forEachDirectory(Guardrail.sourceTypeScriptPaths, callback);
  }

  protected async forEachTestTypeScriptFile(callback: TypeScriptFileCallback) {
    await this.forEachTypeScriptFile(Guardrail.testTypeScriptPaths, callback);
  }

  protected async forEachTsxTypeScriptFile(callback: TypeScriptFileCallback) {
    await this.forEachTypeScriptFile(Guardrail.tsxPaths, callback);
  }

  protected async forEachComponentStoryFile(callback: FileCallback) {
    await this.forEachFile(Guardrail.componentStoryPaths, callback);
  }

  protected async forEachComponentStoryContent(callback: FileContentCallback) {
    await this.forEachFileContent(Guardrail.componentStoryPaths, callback);
  }

  protected async forEachVitestConfigFileContent(callback: FileContentCallback) {
    await this.forEachFileContent(Guardrail.vitestConfigPaths, callback);
  }

  protected async forEachFile(callback: FileCallback): Promise<void>;
  protected async forEachFile(paths: GuardrailPaths, callback: FileCallback): Promise<void>;
  protected async forEachFile(pathsOrCallback: FilePathsOrCallback, maybeCallback?: FileCallback) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new InvalidGuardrailUsageError(`Guardrail ${this.name} must provide a file callback.`);
    }

    const files = await this.resolvePaths(paths);
    for (const file of files) {
      const reporter = this.createReporter(file);
      await callback(file, reporter);
    }
  }

  protected async forEachMatchedFile(callback: FileCallback): Promise<void>;
  protected async forEachMatchedFile(paths: GuardrailPaths, callback: FileCallback): Promise<void>;
  protected async forEachMatchedFile(pathsOrCallback: FilePathsOrCallback, maybeCallback?: FileCallback) {
    if (typeof pathsOrCallback === "function") {
      await this.forEachFile(pathsOrCallback);
      return;
    }

    await this.forEachFile(pathsOrCallback, maybeCallback as FileCallback);
  }

  protected async forEachFileContent(callback: FileContentCallback): Promise<void>;
  protected async forEachFileContent(paths: GuardrailPaths, callback: FileContentCallback): Promise<void>;
  protected async forEachFileContent(pathsOrCallback: FileContentPathsOrCallback, maybeCallback?: FileContentCallback) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new InvalidGuardrailUsageError(`Guardrail ${this.name} must provide a file-content callback.`);
    }

    await this.forEachFile(paths, async (file, reporter) => {
      const content = readFileSync(file, "utf-8");
      await callback(file, content, reporter);
    });
  }

  protected async forEachTypeScriptFile(callback: TypeScriptFileCallback): Promise<void>;
  protected async forEachTypeScriptFile(paths: GuardrailPaths, callback: TypeScriptFileCallback): Promise<void>;
  protected async forEachTypeScriptFile(
    pathsOrCallback: TypeScriptPathsOrCallback,
    maybeCallback?: TypeScriptFileCallback,
  ) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new InvalidGuardrailUsageError(`Guardrail ${this.name} must provide a TypeScript callback.`);
    }

    const files = await this.resolvePaths(paths);

    for (const file of files) {
      const reporter = this.createReporter(file);
      const content = readFileSync(file, "utf-8");
      const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
      await callback(file, sourceFile, reporter);
    }
  }

  protected async forEachDirectory(callback: DirectoryCallback): Promise<void>;
  protected async forEachDirectory(paths: GuardrailPaths, callback: DirectoryCallback): Promise<void>;
  protected async forEachDirectory(pathsOrCallback: DirectoryPathsOrCallback, maybeCallback?: DirectoryCallback) {
    if (typeof pathsOrCallback === "function") {
      await this.forEachMatchedDirectory(pathsOrCallback);
      return;
    }

    await this.forEachMatchedDirectory(pathsOrCallback, maybeCallback as DirectoryCallback);
  }

  protected async forEachMatchedDirectory(callback: DirectoryCallback): Promise<void>;
  protected async forEachMatchedDirectory(paths: GuardrailPaths, callback: DirectoryCallback): Promise<void>;
  protected async forEachMatchedDirectory(
    pathsOrCallback: DirectoryPathsOrCallback,
    maybeCallback?: DirectoryCallback,
  ) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new InvalidGuardrailUsageError(`Guardrail ${this.name} must provide a directory callback.`);
    }

    const directories = await this.resolveDirectories(paths);

    for (const directory of directories) {
      const reporter = this.createReporter(directory);
      await callback(directory, reporter);
    }
  }

  protected async resolvePaths(paths: readonly string[]) {
    return glob(paths, {
      absolute: true,
      cwd: this.context.packageDir,
      ignore: this.getIgnorePatterns(),
    });
  }

  private async resolveDirectories(paths: readonly string[]) {
    return glob(Guardrail.toDirectoryPatterns(paths), {
      absolute: true,
      cwd: this.context.packageDir,
      ignore: this.getIgnorePatterns(),
      onlyDirectories: true,
    });
  }

  private getIgnorePatterns() {
    return ["**/node_modules/**", ...this.context.exclude, ...this.getDefaultIgnores()];
  }

  private getDefaultIgnores() {
    if (this.context.paths && this.context.paths.length > 0) {
      return [];
    }

    if (Guardrail.isTestFocusedRule(this.name)) {
      return Guardrail.getPackageImplicitIgnores();
    }

    return [...Guardrail.getPackageImplicitIgnores(), ...Guardrail.getSourceRuleImplicitIgnores()];
  }

  private static toDirectoryPatterns(paths: readonly string[]) {
    return [...new Set(paths.map((path) => Guardrail.toDirectoryPattern(path)))];
  }

  private getOperationPaths(defaultPaths: readonly string[], input?: GuardrailPaths) {
    if (this.context.paths && this.context.paths.length > 0) {
      return [...this.context.paths];
    }

    if (input !== undefined) {
      return Guardrail.toPathList(input);
    }

    return [...defaultPaths];
  }

  private static toPathList(paths: GuardrailPaths) {
    return Array.isArray(paths) ? [...paths] : [paths];
  }

  private static getPackageImplicitIgnores() {
    return ["**/fixtures/**", "**/__snapshots__/**", "**/snapshots/**", "**/*.snap"] as const;
  }

  private static getSourceRuleImplicitIgnores() {
    return ["**/*.test.ts", "**/*.test.tsx"] as const;
  }

  private static isTestFocusedRule(ruleName: string) {
    return new Set<string>([
      "test-block-format",
      "test-name-prefixes",
      "max-test-assertions",
      "max-test-it-block-lines",
      "no-nested-describe-blocks",
      "no-vi-mock",
      "snapshot-tests-use-file-snapshots",
      "test-files-use-vitest",
      "pure-test-files",
    ]).has(ruleName);
  }

  private static toDirectoryPattern(path: string) {
    const normalizedPath = path.replaceAll("\\", "/");

    if (normalizedPath.endsWith("/")) {
      return normalizedPath;
    }

    return posix.dirname(normalizedPath);
  }
}
