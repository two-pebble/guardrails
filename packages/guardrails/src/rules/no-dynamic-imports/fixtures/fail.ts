// This file should FAIL the no-dynamic-imports rule
const mod = import("./other-module");

type Foo = import("./types").Foo;
