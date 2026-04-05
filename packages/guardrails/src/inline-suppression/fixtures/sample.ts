// guardrail-disable-file no-process-env This file needs direct env access
const a = 1;
const b = 2;
// guardrail-disable no-console Debug logging needed here
console.log("hello");
const c = 3;
const d = 4;
const e = process.env.FOO;
const f = 5;
// guardrail-disable * Temporary workaround
const g = 6;
