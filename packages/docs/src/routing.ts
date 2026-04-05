export interface DocsRouteIndex {
  kind: "index";
}

export interface DocsRouteRule {
  kind: "rule";
  slug: string;
}

export interface DocsRouteMissing {
  kind: "missing";
}

export type DocsRoute = DocsRouteIndex | DocsRouteRule | DocsRouteMissing;

export function getDocsRoute(pathname: string, basePath: string): DocsRoute {
  const relativePath = stripBasePath(pathname, basePath);
  const segments = relativePath.split("/").filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    return { kind: "index" };
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

export function getHomeHref(basePath: string) {
  return normalizeBasePath(basePath);
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
