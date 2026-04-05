# max-test-it-block-lines

Each `it(...)` block must stay at twelve non-comment lines or fewer.

## Bad

```typescript
it('happy: processes data', () => {
  const a = createA();
  const b = createB();
  const c = merge(a, b);
  const d = transform(c);
  const e = validate(d);
  const f = normalize(e);
  const g = format(f);
  const h = enrich(g);
  const i = finalize(h);
  const j = wrap(i);
  const k = send(j);
  const l = confirm(k);
  expect(l.ok).toBe(true);
});
```

## Good

```typescript
it('happy: processes data', () => {
  const input = buildTestInput();

  const result = processData(input);

  expect(result.ok).toBe(true);
});
```

## Why

Short test bodies are easier to scan. If a test needs many lines of setup, the setup should be extracted into a helper.
