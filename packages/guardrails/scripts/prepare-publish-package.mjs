import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const registryUrl = "https://npm.pkg.github.com";
const timeZone = "America/Los_Angeles";
const packageJsonPath = resolve(import.meta.dirname, "..", "package.json");

const owner = process.env.OWNER_LOWER;

if (!owner) {
  throw new Error("OWNER_LOWER is required.");
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageName = `@${owner}/guardrails`;
const existingVersions = loadExistingVersions(packageName);
const publishVersion = getNextPublishVersion(existingVersions, getPublishDateParts());

packageJson.name = packageName;
packageJson.version = publishVersion;

writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

console.log(`Prepared ${packageName}@${publishVersion}`);

function loadExistingVersions(packageName) {
  const overriddenVersions = process.env.PUBLISHED_VERSIONS_JSON;

  if (overriddenVersions) {
    return parseVersionsJson(overriddenVersions);
  }

  try {
    const result = execFileSync("npm", ["view", packageName, "versions", "--json", "--registry", registryUrl], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    return parseVersionsJson(result);
  } catch (error) {
    const stderr = error instanceof Error && "stderr" in error ? String(error.stderr ?? "") : "";

    if (stderr.includes("E404") || stderr.includes("404")) {
      return [];
    }

    throw error;
  }
}

function parseVersionsJson(rawValue) {
  const parsed = JSON.parse(rawValue);

  if (typeof parsed === "string") {
    return [parsed];
  }

  return Array.isArray(parsed) ? parsed.filter((entry) => typeof entry === "string") : [];
}

function getPublishDateParts() {
  const overriddenDate = process.env.PUBLISH_DATE;
  const date = overriddenDate ? new Date(overriddenDate) : new Date();

  const formatter = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "numeric",
    timeZone,
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);

  return {
    year: Number(getDatePart(parts, "year")),
    month: Number(getDatePart(parts, "month")),
    day: Number(getDatePart(parts, "day")),
  };
}

function getDatePart(parts, type) {
  const part = parts.find((entry) => entry.type === type);

  if (!part) {
    throw new Error(`Missing ${type} in publish date.`);
  }

  return part.value;
}

function getNextPublishVersion(existingVersions, dateParts) {
  const baseVersion = `${dateParts.year}.${dateParts.month}.${dateParts.day}`;

  if (!existingVersions.includes(baseVersion)) {
    return baseVersion;
  }

  const usedSuffixes = existingVersions
    .filter((version) => version.startsWith(`${baseVersion}-`))
    .map((version) => version.slice(`${baseVersion}-`.length))
    .filter((suffix) => /^[a-z]+$/.test(suffix));

  let suffixIndex = 1;

  while (usedSuffixes.includes(toLetterSuffix(suffixIndex))) {
    suffixIndex += 1;
  }

  return `${baseVersion}-${toLetterSuffix(suffixIndex)}`;
}

function toLetterSuffix(index) {
  return toAlphabeticLabel(index + 1);
}

function toAlphabeticLabel(index) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let remaining = index;
  let result = "";

  while (remaining > 0) {
    remaining -= 1;
    result = `${alphabet[remaining % 26]}${result}`;
    remaining = Math.floor(remaining / 26);
  }

  return result;
}
