# string-mapping

Ensure a set of source files has matching marker strings in another set of files.

```json
{
  "@rule/string-mapping": {
    "cases": [
      {
        "source": {
          "type": "files-like",
          "files": "src/operations/*.ts"
        },
        "matches": {
          "type": "strings-like",
          "files": "src/testing/*.ts",
          "pattern": "describe('Operation: $1'"
        }
      }
    ]
  }
}
```

Placeholders:

- `$0`: source file path relative to the package root
- `$1`: source file basename without extension
- `$2`: source filename with extension
