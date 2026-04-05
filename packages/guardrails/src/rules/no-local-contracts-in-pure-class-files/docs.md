# no-local-contracts-in-pure-class-files

Files that export a class must not define local types or interfaces.

## Bad

```typescript
interface UserData {
  name: string;
}

export class UserService {
  public create(data: UserData) {}
}
```

## Good

```typescript
// types.ts
export interface UserData { name: string; }

// user-service.ts
import type { UserData } from './types';

export class UserService {
  public create(data: UserData) {}
}
```

## Why

Mixing type declarations with class definitions clutters the file. Moving contracts to a dedicated module keeps class files focused on behavior.
