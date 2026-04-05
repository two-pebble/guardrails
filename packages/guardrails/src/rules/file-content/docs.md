# file-content

Ensures files matching a path pattern contain a required substring.

## Configuration

```json
{
  "@rule/file-content": {
    "cases": [
      {
        "string": "tenantId: string",
        "paths": "src/operations/**/*.ts"
      }
    ]
  }
}
```

## Pass

A file at `src/operations/application.create.ts` containing `tenantId: string`.

## Fail

A file at `src/operations/application.create.ts` that does not contain `tenantId: string`.
