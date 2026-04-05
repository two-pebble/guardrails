import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeStaticRulePages } from "./rule-docs";

const docsPackageDir = resolve(fileURLToPath(new URL("..", import.meta.url)));

await writeStaticRulePages(docsPackageDir);
