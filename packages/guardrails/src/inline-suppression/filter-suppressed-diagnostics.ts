import { existsSync, readFileSync, statSync } from "node:fs";
import type { Diagnostic } from "../types";

type Diagnostics = Diagnostic[];

const disableNextLinePattern = /\/\/\s*guardrail-disable\s+(\S+)/;
const disableFilePattern = /\/\/\s*guardrail-disable-file\s+(\S+)/;

/**
 * Filters diagnostics that have been suppressed by inline comments.
 *
 * Supported comment formats:
 *   // guardrail-disable <rule> [justification]   — suppresses the next line
 *   // guardrail-disable-file <rule> [justification] — suppresses the entire file
 */
export function filterSuppressedDiagnostics(ruleName: string, diagnostics: Diagnostics) {
  if (diagnostics.length === 0) return diagnostics;

  const fileCache = new Map<string, string[]>();

  const getLines = (file: string) => {
    let lines = fileCache.get(file);
    if (!lines) {
      if (!existsSync(file)) {
        lines = [];
        fileCache.set(file, lines);
        return lines;
      }

      if (!statSync(file).isFile()) {
        lines = [];
        fileCache.set(file, lines);
        return lines;
      }

      lines = readFileSync(file, "utf-8").split("\n");
      fileCache.set(file, lines);
    }
    return lines;
  };

  return diagnostics.filter((diagnostic) => {
    if (!diagnostic.file) return true;

    const lines = getLines(diagnostic.file);

    for (const line of lines) {
      const fileMatch = disableFilePattern.exec(line);
      if (fileMatch && matchesRule(fileMatch[1], ruleName)) {
        return false;
      }
    }

    if (diagnostic.line == null) return true;

    const prevLineIndex = diagnostic.line - 2;
    if (prevLineIndex >= 0) {
      const prevLine = lines[prevLineIndex];
      const lineMatch = disableNextLinePattern.exec(prevLine);
      if (lineMatch && !disableFilePattern.test(prevLine) && matchesRule(lineMatch[1], ruleName)) {
        return false;
      }
    }

    return true;
  });
}

function matchesRule(commentRule: string, ruleName: string) {
  return commentRule === ruleName || commentRule === "*";
}
