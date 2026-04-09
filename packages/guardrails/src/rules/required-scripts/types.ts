export interface PackageJsonShape {
  scripts?: Record<string, unknown>;
}

export interface RequiredScriptsRuleConfig {
  requiredScripts: string[];
}
