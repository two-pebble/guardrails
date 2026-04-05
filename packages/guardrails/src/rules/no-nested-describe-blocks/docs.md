# no-nested-describe-blocks

Nested `describe(...)` blocks are not allowed.

## Bad

```typescript
describe('UserService', () => {
  describe('create', () => {
    it('happy: creates a user', () => {});
  });
});
```

## Good

```typescript
describe('UserService.create', () => {
  it('happy: creates a user', () => {});
});
```

## Why

Nesting describe blocks adds indentation and visual complexity without meaningful benefit. Flat structures are easier to scan.
