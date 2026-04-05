import { validateGuardrailConfig } from "./config-validator";
import { groups, rules } from "./consts";
import { UnknownGroupError, UnknownRuleError } from "./errors";
import { filterSuppressedDiagnostics } from "./inline-suppression";
import type { CheckResult, ExcludeList, GuardrailConfig, GuardrailContext, RuleConfig } from "./types";

export class Controller {
  public async run(packageDir: string, config: GuardrailConfig) {
    validateGuardrailConfig(config);

    const ruleMap = new Map<string, RuleConfig>();

    if (config.inherit) {
      const name = Controller.stripPrefix(config.inherit, "@group/");
      const group = groups.find((groupEntry) => groupEntry.name === name);

      if (!group) {
        throw new UnknownGroupError(config.inherit);
      }

      for (const entry of group.rules()) {
        ruleMap.set(entry.rule, entry.config);
      }
    }

    for (const [ruleName, ruleConfig] of Object.entries(config.additional ?? {})) {
      ruleMap.set(Controller.stripPrefix(ruleName, "@rule/"), ruleConfig);
    }

    const excludes = config.exclude ?? [];
    const results: CheckResult[] = [];
    const totalStart = performance.now();

    for (const [ruleName, ruleConfig] of ruleMap) {
      const rule = rules.find((ruleEntry) => ruleEntry.name === ruleName);
      if (!rule) {
        throw new UnknownRuleError(ruleName);
      }

      const context: GuardrailContext = {
        packageDir,
        exclude: Controller.getExcludesForRule(ruleName, excludes),
        options: { ...ruleConfig.options, ...ruleConfig },
      };

      const ruleStart = performance.now();
      const reporters = await rule.execute(context);
      const durationMs = Math.round(performance.now() - ruleStart);
      const diagnostics = filterSuppressedDiagnostics(
        ruleName,
        reporters.flatMap((reporter) => reporter.diagnostics),
      );
      const filesScanned = new Set(
        reporters.map((reporter) => reporter.file).filter((file): file is string => Boolean(file)),
      );

      results.push({
        rule: ruleName,
        passed: diagnostics.length === 0,
        diagnostics,
        filesScanned,
        durationMs,
      });
    }

    return {
      passed: results.every((result) => result.passed),
      results,
      totalDurationMs: Math.round(performance.now() - totalStart),
    };
  }

  private static stripPrefix(name: string, prefix: string) {
    return name.startsWith(prefix) ? name.slice(prefix.length) : name;
  }

  private static getExcludesForRule(ruleName: string, excludes: ExcludeList) {
    const paths: string[] = [];

    for (const entry of excludes) {
      if (entry.rules.some((pattern) => pattern === "*" || Controller.stripPrefix(pattern, "@rule/") === ruleName)) {
        paths.push(...entry.paths);
      }
    }

    return paths;
  }
}
