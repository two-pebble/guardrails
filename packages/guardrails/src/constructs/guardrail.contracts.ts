import type ts from "typescript";
import type { Reporter } from "./reporter";

export type FileCallback = (file: string, reporter: Reporter) => void | Promise<void>;

export type FileContentCallback = (file: string, content: string, reporter: Reporter) => void | Promise<void>;

export type TypeScriptFileCallback = (
  file: string,
  sourceFile: ts.SourceFile,
  reporter: Reporter,
) => void | Promise<void>;

export type DirectoryCallback = (dir: string, reporter: Reporter) => void | Promise<void>;
