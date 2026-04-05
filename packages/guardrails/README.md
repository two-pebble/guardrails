# Guardrails

## Intent

Guardrails is linting for agents, not humans.

The package exists to narrow the range of solutions an AI coding agent can produce inside a repository. We believe agents are often paralyzed by too many choices and will frequently choose the quickest plausible implementation rather than the most correct, repo-aligned one. Guardrails pushes back on that by enforcing very opinionated rules about how a codebase is structured and what a valid solution should look like.

In practice, that means Guardrails is a restrictive linting framework for repository conventions, package shape, and rule-driven project constraints. The intent is not to maximize flexibility. It is to reduce the number of acceptable implementations so agents converge on higher-quality output more reliably.

Docs: [https://two-pebble.github.io/guardrails/](https://two-pebble.github.io/guardrails/)

## Examples

```bash
pnpm run guard
```
