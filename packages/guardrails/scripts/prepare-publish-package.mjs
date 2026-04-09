import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const registryUrl = "https://registry.npmjs.org";
const packageJsonPath = resolve(import.meta.dirname, "..", "package.json");

const publishScope = process.env.PUBLISH_SCOPE;
const publishPackageName = process.env.PUBLISH_PACKAGE_NAME;

if (!publishScope) {
  throw new Error("PUBLISH_SCOPE is required.");
}

if (!publishPackageName) {
  throw new Error("PUBLISH_PACKAGE_NAME is required.");
}

const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
const packageName = `@${publishScope}/${publishPackageName}`;
const existingVersions = loadExistingVersions(packageName);
const publishVersion = getNextPublishVersion(packageJson.version, existingVersions);

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

function getNextPublishVersion(configuredVersion, existingVersions) {
  const normalizedConfiguredVersion = parseSemver(configuredVersion);
  const latestPublishedVersion = getLatestPublishedVersion(existingVersions);

  if (!latestPublishedVersion) {
    return configuredVersion;
  }

  if (compareSemver(normalizedConfiguredVersion, latestPublishedVersion) > 0) {
    return configuredVersion;
  }

  return formatSemver({
    major: latestPublishedVersion.major,
    minor: latestPublishedVersion.minor,
    patch: latestPublishedVersion.patch + 1,
  });
}

function getLatestPublishedVersion(existingVersions) {
  return existingVersions
    .map((version) => tryParseSemver(version))
    .filter((version) => version !== null)
    .reduce((latestVersion, version) => {
      if (!latestVersion) {
        return version;
      }

      return compareSemver(version, latestVersion) > 0 ? version : latestVersion;
    }, null);
}

function parseSemver(version) {
  const parsedVersion = tryParseSemver(version);

  if (!parsedVersion) {
    throw new Error(`Expected a semantic version like x.y.z, received "${version}".`);
  }

  return parsedVersion;
}

function tryParseSemver(version) {
  const match = /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)$/.exec(version);

  if (!match?.groups) {
    return null;
  }

  return {
    major: Number(match.groups.major),
    minor: Number(match.groups.minor),
    patch: Number(match.groups.patch),
  };
}

function compareSemver(leftVersion, rightVersion) {
  if (leftVersion.major !== rightVersion.major) {
    return leftVersion.major - rightVersion.major;
  }

  if (leftVersion.minor !== rightVersion.minor) {
    return leftVersion.minor - rightVersion.minor;
  }

  return leftVersion.patch - rightVersion.patch;
}

function formatSemver(version) {
  return `${version.major}.${version.minor}.${version.patch}`;
}
