import { readFileSync } from "node:fs";
import { posix } from "node:path";
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

  protected createReporter(file?: string) {
    const reporter = new Reporter(this.name, file);
    this.reporters.push(reporter);
    return reporter;
  }

  protected addReporter(reporter: Reporter) {
    this.reporters.push(reporter);
  }

  protected async failOnRegex(paths: string | readonly string[], pattern: RegExp, error: DiagnosticError) {
    await this.forEachFileContent(paths, (_file, content, reporter) => {
      const lines = content.split("\n");
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        if (pattern.test(lines[lineIndex])) {
          reporter.fail(error, lineIndex + 1);
        }
      }
    });
  }

  protected async forEachFile(paths: string | readonly string[], callback: FileCallback) {
    const matchedPaths = Array.isArray(paths) ? paths : [paths];
    const files = await this.resolvePaths(matchedPaths);
    for (const file of files) {
      const reporter = this.createReporter(file);
      await callback(file, reporter);
    }
  }

  protected async forEachMatchedFile(paths: string | readonly string[], callback: FileCallback) {
    await this.forEachFile(paths, callback);
  }

  protected async forEachFileContent(paths: string | readonly string[], callback: FileContentCallback) {
    await this.forEachFile(paths, async (file, reporter) => {
      const content = readFileSync(file, "utf-8");
      await callback(file, content, reporter);
    });
  }

  protected async forEachTypeScriptFile(paths: string | readonly string[], callback: TypeScriptFileCallback) {
    const matchedPaths = Array.isArray(paths) ? paths : [paths];
    const files = await this.resolvePaths(matchedPaths);

    for (const file of files) {
      const reporter = this.createReporter(file);
      const content = readFileSync(file, "utf-8");
      const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
      await callback(file, sourceFile, reporter);
    }
  }

  protected async forEachDirectory(paths: string | readonly string[], callback: DirectoryCallback) {
    await this.forEachMatchedDirectory(paths, callback);
  }

  protected async forEachMatchedDirectory(paths: string | readonly string[], callback: DirectoryCallback) {
    const matchedPaths = Array.isArray(paths) ? paths : [paths];
    const directories = await this.resolveDirectories(matchedPaths);

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

  private static toDirectoryPattern(path: string) {
    const normalizedPath = path.replaceAll("\\", "/");

    if (normalizedPath.endsWith("/")) {
      return normalizedPath;
    }

    return posix.dirname(normalizedPath);
  }
}
