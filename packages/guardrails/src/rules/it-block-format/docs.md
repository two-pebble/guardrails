# it-block-format

Each `it(...)` callback must be an inline block body spanning at least five non-comment lines.

## Bad

```typescript
it('happy: returns true', () => expect(isValid('x')).toBe(true));
```

## Good

```typescript
it('happy: returns true', () => {
  const input = 'x';

  const result = isValid(input);

  expect(result).toBe(true);
});
```

## Why

Requiring a minimum block size encourages the arrange/act/assert pattern and prevents tests from collapsing into unreadable one-liners.
