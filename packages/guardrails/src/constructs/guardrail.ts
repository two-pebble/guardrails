import { existsSync, readFileSync } from "node:fs";
import { posix, relative, resolve } from "node:path";
import { glob } from "tinyglobby";
import ts from "typescript";
import type { DiagnosticError, GuardrailContext } from "../types";
import type {
  DirectoryCallback,
  FileCallback,
  FileContentCallback,
  TypeScriptFileCallback,
} from "./guardrail.contracts";
import { Reporter } from "./reporter";

export abstract class Guardrail {
  private static readonly sourceTypeScriptPaths = ["src/**/*.ts", "src/**/*.tsx"] as const;
  private static readonly testTypeScriptPaths = ["src/**/*.test.ts", "src/**/*.test.tsx"] as const;
  private static readonly tsxPaths = ["src/**/*.tsx"] as const;
  private static readonly componentStoryPaths = ["src/components/**/*.story.tsx"] as const;
  private static readonly vitestConfigPaths = ["vitest.config.ts"] as const;
  public abstract readonly name: string;
  private context!: GuardrailContext;
  private reporters: Reporter[] = [];

  public async execute(context: GuardrailContext) {
    this.context = context;
    this.reporters = [];
    await this.check();
    return this.reporters;
  }

  protected abstract check(): Promise<void>;

  protected get options() {
    return this.context.options ?? {};
  }

  protected get packageDir() {
    return this.context.packageDir;
  }

  protected getPackageRoot() {
    return this.context.packageDir;
  }

  protected resolvePackagePath(...segments: string[]) {
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
  protected async failOnRegex(
    paths: string | readonly string[],
    pattern: RegExp,
    error: DiagnosticError,
  ): Promise<void>;
  protected async failOnRegex(
    pathsOrPattern: string | readonly string[] | RegExp,
    patternOrError: RegExp | DiagnosticError,
    maybeError?: DiagnosticError,
  ) {
    const paths = pathsOrPattern instanceof RegExp ? undefined : pathsOrPattern;
    const pattern = pathsOrPattern instanceof RegExp ? pathsOrPattern : (patternOrError as RegExp);
    const error = pathsOrPattern instanceof RegExp ? (patternOrError as DiagnosticError) : maybeError;

    if (!error) {
      throw new Error(`Guardrail ${this.name} must provide a diagnostic error for failOnRegex.`);
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
  protected async forEachFile(paths: string | readonly string[], callback: FileCallback): Promise<void>;
  protected async forEachFile(
    pathsOrCallback: string | readonly string[] | FileCallback,
    maybeCallback?: FileCallback,
  ) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new Error(`Guardrail ${this.name} must provide a file callback.`);
    }

    const files = await this.resolvePaths(paths);
    for (const file of files) {
      const reporter = this.createReporter(file);
      await callback(file, reporter);
    }
  }

  protected async forEachMatchedFile(callback: FileCallback): Promise<void>;
  protected async forEachMatchedFile(paths: string | readonly string[], callback: FileCallback): Promise<void>;
  protected async forEachMatchedFile(
    pathsOrCallback: string | readonly string[] | FileCallback,
    maybeCallback?: FileCallback,
  ) {
    if (typeof pathsOrCallback === "function") {
      await this.forEachFile(pathsOrCallback);
      return;
    }

    await this.forEachFile(pathsOrCallback, maybeCallback as FileCallback);
  }

  protected async forEachFileContent(callback: FileContentCallback): Promise<void>;
  protected async forEachFileContent(paths: string | readonly string[], callback: FileContentCallback): Promise<void>;
  protected async forEachFileContent(
    pathsOrCallback: string | readonly string[] | FileContentCallback,
    maybeCallback?: FileContentCallback,
  ) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new Error(`Guardrail ${this.name} must provide a file-content callback.`);
    }

    await this.forEachFile(paths, async (file, reporter) => {
      const content = readFileSync(file, "utf-8");
      await callback(file, content, reporter);
    });
  }

  protected async forEachTypeScriptFile(callback: TypeScriptFileCallback): Promise<void>;
  protected async forEachTypeScriptFile(
    paths: string | readonly string[],
    callback: TypeScriptFileCallback,
  ): Promise<void>;
  protected async forEachTypeScriptFile(
    pathsOrCallback: string | readonly string[] | TypeScriptFileCallback,
    maybeCallback?: TypeScriptFileCallback,
  ) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new Error(`Guardrail ${this.name} must provide a TypeScript callback.`);
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
  protected async forEachDirectory(paths: string | readonly string[], callback: DirectoryCallback): Promise<void>;
  protected async forEachDirectory(
    pathsOrCallback: string | readonly string[] | DirectoryCallback,
    maybeCallback?: DirectoryCallback,
  ) {
    if (typeof pathsOrCallback === "function") {
      await this.forEachMatchedDirectory(pathsOrCallback);
      return;
    }

    await this.forEachMatchedDirectory(pathsOrCallback, maybeCallback as DirectoryCallback);
  }

  protected async forEachMatchedDirectory(callback: DirectoryCallback): Promise<void>;
  protected async forEachMatchedDirectory(
    paths: string | readonly string[],
    callback: DirectoryCallback,
  ): Promise<void>;
  protected async forEachMatchedDirectory(
    pathsOrCallback: string | readonly string[] | DirectoryCallback,
    maybeCallback?: DirectoryCallback,
  ) {
    const paths = this.getOperationPaths(
      Guardrail.sourceTypeScriptPaths,
      typeof pathsOrCallback === "function" ? undefined : pathsOrCallback,
    );
    const callback = typeof pathsOrCallback === "function" ? pathsOrCallback : maybeCallback;

    if (!callback) {
      throw new Error(`Guardrail ${this.name} must provide a directory callback.`);
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
      ignore: ["**/node_modules/**", ...this.context.exclude],
    });
  }

  private async resolveDirectories(paths: readonly string[]) {
    return glob(Guardrail.toDirectoryPatterns(paths), {
      absolute: true,
      cwd: this.context.packageDir,
      ignore: ["**/node_modules/**", ...this.context.exclude],
      onlyDirectories: true,
    });
  }

  private static toDirectoryPatterns(paths: readonly string[]) {
    return [...new Set(paths.map((path) => Guardrail.toDirectoryPattern(path)))];
  }

  private getOperationPaths(defaultPaths: readonly string[], input?: string | readonly string[]) {
    if (this.context.paths && this.context.paths.length > 0) {
      return [...this.context.paths];
    }

    if (input !== undefined) {
      return Guardrail.toPathList(input);
    }

    return [...defaultPaths];
  }

  private static toPathList(paths: string | readonly string[]) {
    return Array.isArray(paths) ? [...paths] : [paths];
  }

  private static toDirectoryPattern(path: string) {
    const normalizedPath = path.replaceAll("\\", "/");

    if (normalizedPath.endsWith("/")) {
      return normalizedPath;
    }

    return posix.dirname(normalizedPath);
  }
}
