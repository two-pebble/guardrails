import "./style.css";
import { marked } from "marked";
import { getStartedDocs } from "./content";
import { groupDocs, ruleDocs } from "./generated/rule-docs";
import {
  getDocsRoute,
  getGroupHref,
  getGroupsHref,
  getHomeHref,
  getOverviewHref,
  getRuleHref,
  getRulesHref,
  getSetupHref,
} from "./routing";

const appElement = document.querySelector<HTMLDivElement>("#app");
const basePath = import.meta.env.BASE_URL;

if (!appElement) {
  throw new Error("Expected #app element to exist.");
}

const getStartedDocsBySlug = new Map(getStartedDocs.map((entry) => [entry.slug, entry]));
const groupDocsBySlug = new Map(groupDocs.map((entry) => [entry.slug, entry]));
const ruleDocsBySlug = new Map(ruleDocs.map((entry) => [entry.slug, entry]));

renderApp(appElement);

function renderApp(rootElement: HTMLDivElement) {
  const route = getDocsRoute(window.location.pathname, basePath);

  if (route.kind === "overview") {
    const page = getStartedDocsBySlug.get("overview");
    if (!page) {
      throw new Error("Expected overview docs to exist.");
    }

    document.title = `${page.title} | Guardrails Docs`;
    rootElement.innerHTML = renderLayout(getOverviewHref(basePath), renderOverviewPage(page));
    return;
  }

  if (route.kind === "setup") {
    const page = getStartedDocsBySlug.get("setup");
    if (!page) {
      throw new Error("Expected setup docs to exist.");
    }

    document.title = `${page.title} | Guardrails Docs`;
    rootElement.innerHTML = renderLayout(
      getSetupHref(basePath),
      renderGuidePage("Get Started", page.title, page.summary, page.markdown),
    );
    return;
  }

  if (route.kind === "groups") {
    document.title = "Groups | Guardrails Docs";
    rootElement.innerHTML = renderLayout(getGroupsHref(basePath), renderGroupsIndexPage());
    return;
  }

  if (route.kind === "group") {
    const groupDoc = groupDocsBySlug.get(route.slug);

    if (!groupDoc) {
      document.title = "Guardrails Docs";
      rootElement.innerHTML = renderLayout("", renderMissingPage());
      return;
    }

    document.title = `${groupDoc.title} | Guardrails Docs`;
    rootElement.innerHTML = renderLayout(getGroupHref(groupDoc.slug, basePath), renderGroupPage(groupDoc));
    return;
  }

  if (route.kind === "rules") {
    document.title = "Rules | Guardrails Docs";
    rootElement.innerHTML = renderLayout(getRulesHref(basePath), renderRulesIndexPage());
    return;
  }

  if (route.kind === "rule") {
    const ruleDoc = ruleDocsBySlug.get(route.slug);

    if (!ruleDoc) {
      document.title = "Guardrails Docs";
      rootElement.innerHTML = renderLayout("", renderMissingPage());
      return;
    }

    document.title = `${ruleDoc.title} | Guardrails Docs`;
    rootElement.innerHTML = renderLayout(getRuleHref(ruleDoc.slug, basePath), renderRulePage(ruleDoc));
    return;
  }

  document.title = "Guardrails Docs";
  rootElement.innerHTML = renderLayout("", renderMissingPage());
}

function renderLayout(activeHref: string, content: string) {
  return `
    <div class="docs-app">
      <aside class="sidebar-shell">
        <a class="brand" href="${getHomeHref(basePath)}">
          <span class="brand-kicker">Guardrails</span>
          <span class="brand-title">Docs</span>
        </a>
        ${renderSidebar(activeHref)}
      </aside>
      <main class="content-shell">
        ${content}
      </main>
    </div>
  `;
}

function renderSidebar(activeHref: string) {
  return `
    <nav class="sidebar-nav" aria-label="Guardrails documentation">
      ${renderNavSection(
        "Get Started",
        [
          { href: getOverviewHref(basePath), label: "Overview" },
          { href: getSetupHref(basePath), label: "Setup" },
        ],
        activeHref,
      )}
      ${renderNavSection(
        "Groups",
        [
          { href: getGroupsHref(basePath), label: `All Groups (${groupDocs.length})` },
          ...groupDocs.map((groupDoc) => ({
            href: getGroupHref(groupDoc.slug, basePath),
            label: groupDoc.title,
            detail: `${groupDoc.ruleSlugs.length} rules`,
            nested: true,
          })),
        ],
        activeHref,
      )}
      ${renderNavSection(
        "Rules",
        [
          { href: getRulesHref(basePath), label: `All Rules (${ruleDocs.length})` },
          ...ruleDocs.map((ruleDoc) => ({
            href: getRuleHref(ruleDoc.slug, basePath),
            label: ruleDoc.title,
            nested: true,
          })),
        ],
        activeHref,
      )}
    </nav>
  `;
}

function renderNavSection(
  title: string,
  items: Array<{ href: string; label: string; detail?: string; nested?: boolean }>,
  activeHref: string,
) {
  return `
    <section class="nav-section">
      <p class="nav-section-title">${title}</p>
      <div class="nav-links">
        ${items
          .map((item) => {
            const isActive = item.href === activeHref;

            return `
              <a class="nav-link${isActive ? " is-active" : ""}${item.nested ? " is-nested" : ""}" href="${item.href}">
                <span>${item.label}</span>
                ${item.detail ? `<span class="nav-link-detail">${item.detail}</span>` : ""}
              </a>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderOverviewPage(page: (typeof getStartedDocs)[number]) {
  return `
    <section class="page-header">
      <p class="page-kicker">Get Started</p>
      <h1>Documentation that follows the source tree.</h1>
      <p class="page-summary">${page.summary}</p>
    </section>
    <section class="spotlight-grid">
      <article class="spotlight-card">
        <p class="spotlight-label">Quick Stats</p>
        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-value">${groupDocs.length}</span>
            <span class="metric-label">Groups</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${ruleDocs.length}</span>
            <span class="metric-label">Rules</span>
          </div>
          <div class="metric-card">
            <span class="metric-value">${getStartedDocs.length}</span>
            <span class="metric-label">Starter Pages</span>
          </div>
        </div>
      </article>
      <article class="spotlight-card">
        <p class="spotlight-label">Suggested First Config</p>
        <pre class="inline-panel"><code>{
  "inherit": "@group/guardrails-typescript"
}</code></pre>
      </article>
    </section>
    ${renderArticlePanel(page.title, page.markdown)}
  `;
}

function renderGuidePage(section: string, title: string, summary: string, markdown: string) {
  return `
    <section class="page-header">
      <p class="page-kicker">${section}</p>
      <h1>${title}</h1>
      <p class="page-summary">${summary}</p>
    </section>
    ${renderArticlePanel(title, markdown)}
  `;
}

function renderGroupsIndexPage() {
  return `
    <section class="page-header">
      <p class="page-kicker">Groups</p>
      <h1>Start from a baseline, then layer in specifics.</h1>
      <p class="page-summary">
        Groups bundle related rules into a single opt-in entry so teams can adopt a coherent policy with one config line.
      </p>
    </section>
    <section class="card-grid">
      ${groupDocs.map((groupDoc) => renderGroupCard(groupDoc)).join("")}
    </section>
  `;
}

function renderGroupPage(groupDoc: (typeof groupDocs)[number]) {
  const includedRules = groupDoc.ruleSlugs
    .map((ruleSlug) => ruleDocsBySlug.get(ruleSlug))
    .filter((ruleDoc): ruleDoc is (typeof ruleDocs)[number] => Boolean(ruleDoc));

  return `
    <section class="page-header">
      <p class="page-kicker">Group</p>
      <h1>${groupDoc.title}</h1>
      <p class="page-summary">${groupDoc.summary}</p>
    </section>
    <section class="spotlight-grid">
      <article class="spotlight-card">
        <p class="spotlight-label">Enable This Group</p>
        <pre class="inline-panel"><code>{
  "inherit": "@group/${groupDoc.slug}"
}</code></pre>
      </article>
      <article class="spotlight-card">
        <p class="spotlight-label">Included Rules</p>
        <div class="metric-grid metric-grid-compact">
          <div class="metric-card">
            <span class="metric-value">${includedRules.length}</span>
            <span class="metric-label">Rules</span>
          </div>
        </div>
      </article>
    </section>
    ${renderArticlePanel(groupDoc.title, groupDoc.markdown)}
    <section class="panel">
      <div class="panel-heading">
        <p class="page-kicker">Rules</p>
        <h2>Included in this group</h2>
      </div>
      <div class="card-grid">
        ${includedRules.map((ruleDoc) => renderRuleCard(ruleDoc)).join("")}
      </div>
    </section>
  `;
}

function renderRulesIndexPage() {
  return `
    <section class="page-header">
      <p class="page-kicker">Rules</p>
      <h1>Inspect each check on its own terms.</h1>
      <p class="page-summary">
        Rule docs are generated from the markdown sidecars that sit next to each rule implementation in the source tree.
      </p>
    </section>
    <section class="card-grid">
      ${ruleDocs.map((ruleDoc) => renderRuleCard(ruleDoc)).join("")}
    </section>
  `;
}

function renderRulePage(ruleDoc: (typeof ruleDocs)[number]) {
  const owningGroups = groupDocs.filter((groupDoc) => groupDoc.ruleSlugs.includes(ruleDoc.slug));

  return `
    <section class="page-header">
      <p class="page-kicker">Rule</p>
      <h1>${ruleDoc.title}</h1>
      <p class="page-summary">${ruleDoc.summary}</p>
    </section>
    <section class="spotlight-grid">
      <article class="spotlight-card">
        <p class="spotlight-label">Source</p>
        <dl class="detail-list">
          <div>
            <dt>Rule</dt>
            <dd><code>${ruleDoc.ruleSourcePath}</code></dd>
          </div>
          <div>
            <dt>Docs</dt>
            <dd><code>${ruleDoc.docsSourcePath}</code></dd>
          </div>
        </dl>
      </article>
      <article class="spotlight-card">
        <p class="spotlight-label">Used In</p>
        <div class="tag-list">
          ${
            owningGroups.length > 0
              ? owningGroups
                  .map(
                    (groupDoc) =>
                      `<a class="tag" href="${getGroupHref(groupDoc.slug, basePath)}">${groupDoc.title}</a>`,
                  )
                  .join("")
              : '<span class="tag tag-muted">Standalone</span>'
          }
        </div>
      </article>
    </section>
    ${renderArticlePanel(ruleDoc.title, ruleDoc.markdown)}
  `;
}

function renderMissingPage() {
  return `
    <section class="page-header">
      <p class="page-kicker">Guardrails</p>
      <h1>That page does not exist.</h1>
      <p class="page-summary">The docs site could not map this URL to a generated docs page.</p>
      <a class="primary-link" href="${getHomeHref(basePath)}">Return to overview</a>
    </section>
  `;
}

function renderArticlePanel(title: string, markdown: string) {
  return `
    <section class="panel">
      <div class="panel-heading">
        <p class="page-kicker">Details</p>
        <h2>${title}</h2>
      </div>
      <article class="markdown-body">
        ${marked.parse(markdown)}
      </article>
    </section>
  `;
}

function renderGroupCard(groupDoc: (typeof groupDocs)[number]) {
  return `
    <article class="card">
      <p class="card-label">@group/${groupDoc.slug}</p>
      <h2>${groupDoc.title}</h2>
      <p class="card-copy">${groupDoc.summary}</p>
      <div class="tag-list">
        <span class="tag">${groupDoc.ruleSlugs.length} rules</span>
      </div>
      <a class="primary-link" href="${getGroupHref(groupDoc.slug, basePath)}">Open group</a>
    </article>
  `;
}

function renderRuleCard(ruleDoc: (typeof ruleDocs)[number]) {
  return `
    <article class="card">
      <p class="card-label">@rule/${ruleDoc.slug}</p>
      <h2>${ruleDoc.title}</h2>
      <p class="card-copy">${ruleDoc.summary}</p>
      <div class="tag-list">
        <span class="tag">Rule</span>
      </div>
      <a class="primary-link" href="${getRuleHref(ruleDoc.slug, basePath)}">Open rule</a>
    </article>
  `;
}
