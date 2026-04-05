# no-import-meta-url

`import.meta.url` is not allowed.

## Bad

```typescript
const configPath = new URL('./config.json', import.meta.url);
```

## Good

```typescript
function loadConfig(basePath: string) {
  const configPath = join(basePath, 'config.json');
}
```

## Why

`import.meta.url` couples code to its runtime file location. Passing paths explicitly makes the code portable and easier to test.
