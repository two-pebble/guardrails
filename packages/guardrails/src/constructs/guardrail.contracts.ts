import type ts from "typescript";
import type { DiagnosticError } from "../types";
import type { Reporter } from "./reporter";

export type GuardrailPaths = string | readonly string[];
export type GuardrailPathSegments = string[];
export type FileCallback = (file: string, reporter: Reporter) => void | Promise<void>;
export type FileContentCallback = (file: string, content: string, reporter: Reporter) => void | Promise<void>;
export type TypeScriptFileCallback = (
  file: string,
  sourceFile: ts.SourceFile,
  reporter: Reporter,
) => void | Promise<void>;
export type DirectoryCallback = (dir: string, reporter: Reporter) => void | Promise<void>;
export type FailOnRegexPathsOrPattern = GuardrailPaths | RegExp;
export type FailOnRegexPatternOrError = RegExp | DiagnosticError;
export type FilePathsOrCallback = GuardrailPaths | FileCallback;
export type FileContentPathsOrCallback = GuardrailPaths | FileContentCallback;
export type TypeScriptPathsOrCallback = GuardrailPaths | TypeScriptFileCallback;
export type DirectoryPathsOrCallback = GuardrailPaths | DirectoryCallback;
