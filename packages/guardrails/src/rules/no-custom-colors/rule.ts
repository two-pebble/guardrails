import { Guardrail } from "../../constructs/guardrail";

/**
 * Bans hardcoded color values in TSX files. Components must use theme tokens instead.
 */
export class NoCustomColorsRule extends Guardrail {
  public readonly name = "no-custom-colors";
  private static readonly patterns = [
    /(?:^|[\s"'`:{,])#[0-9a-fA-F]{3,8}\b/,
    /\brgba?\s*\(/,
    /\bhsla?\s*\(/,
    /(?:["'`]|:\s*)(red|blue|green|yellow|orange|purple|pink|white|black|gray|grey|cyan|magenta|teal|lime|indigo|violet|amber|emerald|fuchsia|rose|sky|slate|zinc|stone|neutral)\b/i,
    /\b(?:text|bg|border|from|to|via|ring|outline|shadow|fill|stroke)-(?:red|blue|green|yellow|orange|purple|pink|white|black|gray|grey|cyan|magenta|teal|lime|indigo|violet|amber|emerald|fuchsia|rose|sky|slate|zinc|stone|neutral)-\d{2,3}\b/,
  ];

  protected async check() {
    await this.forEachFileContent((file, content, reporter) => {
      if (!file.endsWith(".tsx")) return;
      if (file.endsWith(".story.tsx") || file.endsWith(".test.tsx")) return;
      if (this.getRelativePath(file).includes("src/components/branding/")) return;

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (NoCustomColorsRule.lineHasCustomColor(line)) {
          reporter.fail(
            {
              error: "custom-color",
              description: "Hardcoded colors are not allowed. Use theme tokens from the Tailwind config.",
              recommendation: "Replace with a theme token class like bg-surface, text-content, text-accent, etc.",
            },
            i + 1,
          );
        }
      }
    });
  }

  private static lineHasCustomColor(line: string) {
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) return false;

    for (const pattern of NoCustomColorsRule.patterns) {
      if (pattern.test(line)) return true;
    }
    return false;
  }
}
