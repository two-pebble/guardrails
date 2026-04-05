// This file should PASS the no-dynamic-imports rule
import { readFileSync } from "node:fs";
import type { Readable } from "node:stream";

const data = readFileSync("file.txt", "utf-8");
