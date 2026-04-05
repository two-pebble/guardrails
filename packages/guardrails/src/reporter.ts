import pc from "picocolors";
import type { Diagnostic, RunResult } from "./types";

export function formatResults(result: RunResult) {
  const lines: string[] = [];

  lines.push("");

  for (const check of result.results) {
    if (check.passed) {
      lines.push(
        `  ${pc.bgGreen(pc.black(" PASS "))} ${pc.green(`@rule/${check.rule}`)}  ${pc.dim(`${check.durationMs}ms`)}`,
      );
    }
  }

  for (const check of result.results) {
    if (check.passed) {
      continue;
    }

    const diagnosticsByError = new Map<string, Diagnostic[]>();

    for (const diagnostic of check.diagnostics) {
      let diagnostics = diagnosticsByError.get(diagnostic.error);
      if (!diagnostics) {
        diagnostics = [];
        diagnosticsByError.set(diagnostic.error, diagnostics);
      }
      diagnostics.push(diagnostic);
    }

    for (const [errorName, diagnostics] of diagnosticsByError) {
      const files = new Set(diagnostics.map((diagnostic) => diagnostic.file).filter(Boolean));
      const errorId = `@rule/${check.rule}/${errorName}`;
      const count = diagnostics.length;
      const fileCount = files.size;

      lines.push("");
      lines.push(
        `  ${pc.bgRed(pc.white(" FAIL "))} ${pc.red(pc.bold(errorId))}  ${pc.dim("—")}  ${pc.yellow(`${count} error${count === 1 ? "" : "s"}`)} in ${pc.yellow(`${fileCount} file${fileCount === 1 ? "" : "s"}`)}  ${pc.dim(`${check.durationMs}ms`)}`,
      );
      lines.push(`         ${diagnostics[0].description}`);
      lines.push(`         ${pc.cyan("fix:")} ${diagnostics[0].recommendation}`);

      const diagnosticsByFile = new Map<string, Diagnostic[]>();
      for (const diagnostic of diagnostics) {
        const file = diagnostic.file ?? "<unknown>";
        let fileDiagnostics = diagnosticsByFile.get(file);
        if (!fileDiagnostics) {
          fileDiagnostics = [];
          diagnosticsByFile.set(file, fileDiagnostics);
        }
        fileDiagnostics.push(diagnostic);
      }

      for (const [file, fileDiagnostics] of diagnosticsByFile) {
        lines.push("");
        lines.push(`         ${pc.underline(file)}`);
        for (const diagnostic of fileDiagnostics) {
          if (!diagnostic.snippet) {
            continue;
          }

          for (const snippetLine of diagnostic.snippet.split("\n")) {
            const colored = snippetLine.startsWith(">") ? pc.red(snippetLine) : pc.dim(snippetLine);
            lines.push(`           ${colored}`);
          }

          lines.push("");
        }
      }
    }
  }

  const totalRules = result.results.length;
  const totalFiles = new Set(
    result.results.flatMap((resultEntry) =>
      resultEntry.diagnostics.map((diagnostic) => diagnostic.file).filter(Boolean),
    ),
  ).size;
  const allFilesScanned = new Set(result.results.flatMap((resultEntry) => [...resultEntry.filesScanned]));
  const totalErrors = result.results.reduce((sum, resultEntry) => sum + resultEntry.diagnostics.length, 0);
  const rulesText = `${pc.bold(String(totalRules))} rule${totalRules === 1 ? "" : "s"} checked`;
  const filesText = `${pc.bold(String(allFilesScanned.size))} file${allFilesScanned.size === 1 ? "" : "s"} scanned`;
  const timeText = pc.dim(`${result.totalDurationMs}ms`);

  lines.push(pc.dim("  ─".repeat(30)));
  lines.push("");

  if (result.passed) {
    lines.push(
      `  ${pc.green("✓")} ${rulesText}  ${pc.dim("·")}  ${filesText}  ${pc.dim("·")}  ${pc.green("0 errors")}  ${pc.dim("·")}  ${timeText}`,
    );
  } else {
    const errorsText = `${pc.red(pc.bold(String(totalErrors)))} error${totalErrors === 1 ? "" : "s"}`;
    const failedFilesText = `${pc.red(pc.bold(String(totalFiles)))} file${totalFiles === 1 ? "" : "s"} with errors`;
    lines.push(
      `  ${pc.red("✗")} ${rulesText}  ${pc.dim("·")}  ${filesText}  ${pc.dim("·")}  ${errorsText} across ${failedFilesText}  ${pc.dim("·")}  ${timeText}`,
    );
  }

  lines.push("");
  return lines.join("\n");
}
