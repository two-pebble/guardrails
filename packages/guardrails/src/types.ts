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

export interface GuardrailContext {
  packageDir: string;
  paths: string[];
  exclude: string[];
  options?: Record<string, unknown>;
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

export interface RuleConfig {
  paths?: string[];
  options?: Record<string, unknown>;
  [key: string]: unknown;
}

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
