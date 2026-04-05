# Guardrails

Linting for agents, not humans.

Guardrails is an opinionated linting framework built to constrain AI agents into producing higher-quality, more repo-aligned code.

We believe agents are often paralyzed by choice and tend to reach for the fastest plausible solution instead of the most correct one. The goal of Guardrails is to shrink that choice surface dramatically. By enforcing restrictive rules about repository structure, package shape, naming, and required project conventions, we make the correct path easier for an agent to discover and much harder to sidestep.

This repository is a `pnpm` monorepo with two workspace packages:

- `packages/guardrails`: the publishable TypeScript package and CLI
- `packages/docs`: the GitHub Pages documentation site

Docs: [https://two-pebble.github.io/guardrails/](https://two-pebble.github.io/guardrails/)
