/**
 * Reports that a config referenced a group name that is not registered.
 */
export class UnknownGroupError extends Error {
  public constructor(groupName: string) {
    super(`Unknown guardrail group: ${groupName}`);
  }
}

/**
 * Reports that a config referenced a rule name that is not registered.
 */
export class UnknownRuleError extends Error {
  public constructor(ruleName: string) {
    super(`Unknown guardrail rule: ${ruleName}`);
  }
}

/**
 * Reports that guardrail configuration is structurally invalid.
 */
export class InvalidGuardrailConfigError extends Error {
  public constructor(message: string) {
    super(`Invalid guardrail config: ${message}`);
  }
}

/**
 * Reports that the framework was used incorrectly while executing a guardrail.
 */
export class InvalidGuardrailUsageError extends Error {
  public constructor(message: string) {
    super(`Invalid guardrail usage: ${message}`);
  }
}
