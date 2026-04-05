# types-only-in-types-files

Files that only export types and interfaces must be named `types.ts`.

## Bad

```ts
// my-options.ts — only exports types, should be types.ts
export interface MyOptions {
  url: string;
}
```

## Good

```ts
// types.ts
export interface MyOptions {
  url: string;
}
```
