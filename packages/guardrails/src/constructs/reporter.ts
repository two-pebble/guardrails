import { readFileSync } from "node:fs";
import type { Diagnostic, DiagnosticError } from "../types";

export class Reporter {
  public readonly rule: string;
  public readonly file?: string;
  public readonly diagnostics: Diagnostic[] = [];
  private static fileCache = new Map<string, string[]>();

  public constructor(rule: string, file?: string) {
    this.rule = rule;
    this.file = file;
  }

  public fail(error: DiagnosticError, line?: number) {
    this.diagnostics.push({
      file: this.file,
      line,
      snippet: this.file && line ? Reporter.getSnippet(this.file, line) : undefined,
      ...error,
    });
  }

  public get passed() {
    return this.diagnostics.length === 0;
  }

  private static getLines(file: string) {
    let lines = Reporter.fileCache.get(file);
    if (!lines) {
      lines = readFileSync(file, "utf-8").split("\n");
      Reporter.fileCache.set(file, lines);
    }

    return lines;
  }

  private static getSnippet(file: string, line: number, context = 1) {
    const lines = Reporter.getLines(file);
    const start = Math.max(0, line - 1 - context);
    const end = Math.min(lines.length, line + context);
    const gutterWidth = String(end).length;

    return lines
      .slice(start, end)
      .map((text, index) => {
        const lineNumber = start + index + 1;
        const gutter = String(lineNumber).padStart(gutterWidth);
        const marker = lineNumber === line ? ">" : " ";
        return `${marker} ${gutter} | ${text}`;
      })
      .join("\n");
  }
}
