import { readFileSync } from "node:fs";
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

  protected addReporter(reporter: Reporter) {
    this.reporters.push(reporter);
  }

  protected async failOnRegex(pattern: RegExp, error: DiagnosticError) {
    await this.forEachFileContent((_file, content, reporter) => {
      const lines = content.split("\n");
      for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
        if (pattern.test(lines[lineIndex])) {
          reporter.fail(error, lineIndex + 1);
        }
      }
    });
  }

  protected async forEachFile(callback: FileCallback) {
    const files = await this.resolveFiles();
    for (const file of files) {
      const reporter = new Reporter(this.name, file);
      this.reporters.push(reporter);
      await callback(file, reporter);
    }
  }

  protected async forEachMatchedFile(paths: string | readonly string[], callback: FileCallback) {
    const matchedPaths = Array.isArray(paths) ? paths : [paths];
    const files = await this.resolvePaths(matchedPaths);

    for (const file of files) {
      const reporter = new Reporter(this.name, file);
      this.reporters.push(reporter);
      await callback(file, reporter);
    }
  }

  protected async forEachFileContent(callback: FileContentCallback) {
    await this.forEachFile(async (file, reporter) => {
      const content = readFileSync(file, "utf-8");
      await callback(file, content, reporter);
    });
  }

  protected async forEachTypeScriptFile(callback: TypeScriptFileCallback) {
    const resolved = await this.resolveFiles();
    const files = resolved.filter((file) => /\.tsx?$/.test(file));

    for (const file of files) {
      const reporter = new Reporter(this.name, file);
      this.reporters.push(reporter);
      const content = readFileSync(file, "utf-8");
      const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
      await callback(file, sourceFile, reporter);
    }
  }

  protected async forEachDirectory(callback: DirectoryCallback) {
    const files = await this.resolveFiles();
    const directories = new Set<string>();

    for (const file of files) {
      directories.add(file.substring(0, file.lastIndexOf("/")));
    }

    for (const directory of directories) {
      const reporter = new Reporter(this.name, directory);
      this.reporters.push(reporter);
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

  private async resolveFiles() {
    return this.resolvePaths(this.context.paths);
  }
}
