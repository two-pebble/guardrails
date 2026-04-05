# max-test-assertions

Each `it(...)` block must contain exactly one `expect(...)` or `assert(...)` call.

## Bad

```typescript
it('happy: validates user', () => {
  const user = createUser('Alice');

  expect(user.name).toBe('Alice');
  expect(user.active).toBe(true);
});
```

## Good

```typescript
it('happy: sets the user name', () => {
  const user = createUser('Alice');

  expect(user.name).toBe('Alice');
});
```

## Why

One assertion per test makes failures pinpoint exactly what broke. Multiple assertions mask the root cause when a test fails.
