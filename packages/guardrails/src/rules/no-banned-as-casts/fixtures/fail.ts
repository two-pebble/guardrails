// This file should FAIL the no-banned-as-casts rule
const x = "hello" as any;
const y = 42 as unknown;
const z = true as never;
