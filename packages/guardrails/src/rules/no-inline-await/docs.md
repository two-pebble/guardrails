# no-inline-await

Await expressions must be assigned to a variable or used as standalone statements, not inlined into other expressions.

## Bad

```typescript
const name = (await getUser()).name;
return await fetchData();
```

## Good

```typescript
const user = await getUser();
const name = user.name;

const data = await fetchData();
return data;
```

## Why

Inlined awaits bury async boundaries inside larger expressions, making the code harder to debug and step through.
