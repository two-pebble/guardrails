# require-syntax-example

Story files must use the `SyntaxExample` wrapper to show code alongside rendered output.

## Bad

```tsx
export const Default: Story = {
  args: { children: 'Hello' },
};
```

## Good

```tsx
export const Default: Story = {
  render: () => (
    <SyntaxExample code={'<Button>Hello</Button>'}>
      <Button>Hello</Button>
    </SyntaxExample>
  ),
};
```

## Why

SyntaxExample provides a consistent code-and-preview layout across all component stories, making the library self-documenting.
