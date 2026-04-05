// This file should PASS the no-exec-sync rule
import { exec } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(exec);
