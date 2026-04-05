export interface DocsRouteOverview {
  kind: "overview";
}

export interface DocsRouteSetup {
  kind: "setup";
}

export interface DocsRouteGroups {
  kind: "groups";
}

export interface DocsRouteGroup {
  kind: "group";
  slug: string;
}

export interface DocsRouteRules {
  kind: "rules";
}

export interface DocsRouteRule {
  kind: "rule";
  slug: string;
}

export interface DocsRouteMissing {
  kind: "missing";
}

export type DocsRoute =
  | DocsRouteOverview
  | DocsRouteSetup
  | DocsRouteGroups
  | DocsRouteGroup
  | DocsRouteRules
  | DocsRouteRule
  | DocsRouteMissing;

export function getDocsRoute(pathname: string, basePath: string): DocsRoute {
  const relativePath = stripBasePath(pathname, basePath);
  const segments = relativePath.split("/").filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    return { kind: "overview" };
  }

  if (segments[0] === "get-started" && (segments[1] === undefined || segments[1] === "overview")) {
    return { kind: "overview" };
  }

  if (segments[0] === "get-started" && segments[1] === "setup") {
    return { kind: "setup" };
  }

  if (segments[0] === "groups" && segments[1] === undefined) {
    return { kind: "groups" };
  }

  if (segments[0] === "groups" && segments[1]) {
    return { kind: "group", slug: segments[1] };
  }

  if (segments[0] === "rules" && segments[1] === undefined) {
    return { kind: "rules" };
  }

  if (segments[0] === "rules" && segments[1]) {
    return { kind: "rule", slug: segments[1] };
  }

  return { kind: "missing" };
}

export function getRuleHref(slug: string, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  return `${normalizedBasePath}rules/${slug}/`;
}

export function getRulesHref(basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  return `${normalizedBasePath}rules/`;
}

export function getGroupHref(slug: string, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  return `${normalizedBasePath}groups/${slug}/`;
}

export function getGroupsHref(basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  return `${normalizedBasePath}groups/`;
}

export function getOverviewHref(basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  return `${normalizedBasePath}get-started/overview/`;
}

export function getSetupHref(basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  return `${normalizedBasePath}get-started/setup/`;
}

export function getHomeHref(basePath: string) {
  return getOverviewHref(basePath);
}

function stripBasePath(pathname: string, basePath: string) {
  const normalizedBasePath = normalizeBasePath(basePath);
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (normalizedBasePath === "/") {
    return normalizedPathname;
  }

  if (normalizedPathname === normalizedBasePath.slice(0, -1)) {
    return "/";
  }

  if (normalizedPathname.startsWith(normalizedBasePath)) {
    return normalizedPathname.slice(normalizedBasePath.length - 1);
  }

  return normalizedPathname;
}

function normalizeBasePath(basePath: string) {
  const withLeadingSlash = basePath.startsWith("/") ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}
