# no-single-line-block-comments

Block comments (`/** ... */`) must span multiple lines.

## Bad

```ts
/** This is wrong. */
export class Foo {}
```

## Good

```ts
/**
 * This is correct.
 */
export class Foo {}

// Single-line comments are also fine.
```

## Why

Single-line block comments create visual ambiguity between doc comments and inline notes. Use `//` for short notes or expand to a proper multiline block.
