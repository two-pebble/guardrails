# no-solo-files

Directories must not exist only to hold a single TypeScript file.

## Bad

```
src/
  helpers/
    format.ts      <-- only file in the directory
```

## Good

```
src/
  helpers/
    format.ts
    validate.ts
```

## Why

A folder with a single file adds unnecessary nesting. Either flatten the file into its parent directory or grow the folder with related modules.
