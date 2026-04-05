# no-function-constructor-overloads

Multiple function or constructor overload signatures are not allowed.

## Bad

```typescript
function parse(input: string): Result;
function parse(input: Buffer): Result;
function parse(input: string | Buffer): Result {
  // ...
}
```

## Good

```typescript
function parseString(input: string) {
  // ...
}

function parseBuffer(input: Buffer) {
  // ...
}
```

## Why

Overloads add hidden complexity and make call-site behavior less predictable. Separate named functions or a single explicit contract are clearer.
