# require-class-jsdoc

Every class must have a JSDoc block comment.

## Bad

```typescript
export class Tokenizer {
  public tokenize(input: string) {}
}
```

## Good

```typescript
/** Splits raw input into a sequence of tokens. */
export class Tokenizer {
  public tokenize(input: string) {}
}
```

## Why

A JSDoc comment on each class documents its responsibility, helping readers understand the purpose without reading the implementation.
