export interface DiagnosticError {
  error: string;
  description: string;
  recommendation: string;
}

export interface Diagnostic extends DiagnosticError {
  file?: string;
  line?: number;
  snippet?: string;
}

export type RuleOptions = Record<string, unknown>;

export interface GuardrailContext<TOptions = RuleOptions> {
  packageDir: string;
  exclude: string[];
  options?: TOptions;
  paths?: string[];
}

export interface ExcludeEntry {
  rules: string[];
  paths: string[];
  justification: string;
}

export type ExcludeList = ExcludeEntry[];

export interface GuardrailConfig {
  inherit?: string;
  additional?: Record<string, RuleConfig>;
  exclude?: ExcludeEntry[];
}

export type RuleConfig<TOptions = RuleOptions> = TOptions;

export interface GroupRuleEntry {
  rule: string;
  config: RuleConfig;
}

export interface CheckResult {
  rule: string;
  passed: boolean;
  diagnostics: Diagnostic[];
  filesScanned: Set<string>;
  durationMs: number;
}

export interface RunResult {
  passed: boolean;
  results: CheckResult[];
  totalDurationMs: number;
}
