# reserved-contract-file-names

Only files named exactly `types.ts` may contain "types" in the file name.

## Bad

```
src/
  user-types.ts
  api-types.ts
```

## Good

```
src/
  types.ts
```

## Why

Reserving the name ensures there is one canonical location for type definitions per directory, preventing type declarations from scattering across files.
