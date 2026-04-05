# no-vitest-config-overrides

`coverage.exclude` and `passWithNoTests: true` are not allowed in vitest config files.

## Bad

```typescript
export default defineConfig({
  test: {
    passWithNoTests: true,
    coverage: {
      exclude: ['src/**/*.test.ts'],
    },
  },
});
```

## Good

```typescript
export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
    },
  },
});
```

## Why

Every package must have tests, and all source files must have coverage. Excluding coverage hides untested code, and `passWithNoTests` allows packages to silently ship without any tests.
