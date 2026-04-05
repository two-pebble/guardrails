# snapshot-tests-use-file-snapshots

Snapshot tests must use `.toMatchFileSnapshot('./snapshots/...')` instead of `.toMatchSnapshot()`.

## Bad

```typescript
it('snapshot: renders card', () => {
  const html = render(Card);

  expect(html).toMatchSnapshot();
});
```

## Good

```typescript
it('snapshot: renders card', () => {
  const html = render(Card);

  expect(html).toMatchFileSnapshot('./snapshots/card.snap');
});
```

## Why

File-based snapshots store output in dedicated files under a `snapshots` directory, making diffs reviewable and keeping test files clean.
