// This file should FAIL the no-exec-sync rule
import { execSync } from "node:child_process";

const output = execSync("ls -la").toString();
