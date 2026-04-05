# no-vi-mock

`vi.mock(...)` is not allowed in test files.

## Bad

```typescript
vi.mock('./database', () => ({
  query: vi.fn().mockReturnValue([]),
}));
```

## Good

```typescript
const database = new FakeDatabase();
const service = new UserService(database);
```

## Why

`vi.mock` silently replaces modules at a distance, making test behavior hard to trace. Explicit fakes or injected dependencies keep tests transparent.
