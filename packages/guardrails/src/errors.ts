export class UnknownGroupError extends Error {
  public constructor(groupName: string) {
    super(`Unknown guardrail group: ${groupName}`);
  }
}

export class UnknownRuleError extends Error {
  public constructor(ruleName: string) {
    super(`Unknown guardrail rule: ${ruleName}`);
  }
}

export class InvalidGuardrailConfigError extends Error {
  public constructor(message: string) {
    super(`Invalid guardrail config: ${message}`);
  }
}
