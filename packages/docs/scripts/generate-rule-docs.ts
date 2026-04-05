import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { writeGeneratedRuleDocs } from "./rule-docs";

const docsPackageDir = resolve(fileURLToPath(new URL("..", import.meta.url)));

await writeGeneratedRuleDocs(docsPackageDir);
