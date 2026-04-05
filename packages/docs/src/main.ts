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

  document.documentElement.style.colorScheme = "dark";

  if (route.kind === "overview") {
    const page = getRequiredStartedDoc("overview");
    document.title = `${page.title} | Guardrails Docs`;
    rootElement.innerHTML = renderLayout(getOverviewHref(basePath), renderOverviewPage(page));
    return;
  }

  if (route.kind === "setup") {
    const page = getRequiredStartedDoc("setup");
    document.title = `${page.title} | Guardrails Docs`;
    rootElement.innerHTML = renderLayout(getSetupHref(basePath), renderGuidePage("Get Started", page));
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
      rootElement.innerHTML = renderLayout("", renderMissingPage());
      return;
    }

    document.title = `${ruleDoc.title} | Guardrails Docs`;
    rootElement.innerHTML = renderLayout(getRuleHref(ruleDoc.slug, basePath), renderRulePage(ruleDoc));
    return;
  }

  rootElement.innerHTML = renderLayout("", renderMissingPage());
}

function getRequiredStartedDoc(slug: string) {
  const page = getStartedDocsBySlug.get(slug);

  if (!page) {
    throw new Error(`Expected started doc "${slug}" to exist.`);
  }

  return page;
}

function renderLayout(activeHref: string, content: string) {
  return `
    <div class="docs-app">
      <aside class="sidebar-shell">
        <a class="brand" href="${getHomeHref(basePath)}">
          <span class="brand-mark">${renderIcon("brand")}</span>
          <span class="brand-copy">
            <span class="brand-title">Guardrails</span>
            <span class="brand-subtitle">Linting for agents, not humans.</span>
          </span>
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
      ${renderSidebarSection(
        "Get Started",
        "guide",
        [
          { href: getOverviewHref(basePath), label: "Overview" },
          { href: getSetupHref(basePath), label: "Setup" },
        ],
        activeHref,
      )}
      ${renderSidebarSection(
        "Groups",
        "stack",
        groupDocs.map((groupDoc) => ({
          href: getGroupHref(groupDoc.slug, basePath),
          label: groupDoc.title,
          detail: `${groupDoc.ruleSlugs.length}`,
        })),
        activeHref,
      )}
      ${renderSidebarSection(
        "Rules",
        "rule",
        ruleDocs.map((ruleDoc) => ({
          href: getRuleHref(ruleDoc.slug, basePath),
          label: ruleDoc.title,
        })),
        activeHref,
      )}
    </nav>
  `;
}

function renderSidebarSection(
  title: string,
  icon: IconName,
  items: Array<{ href: string; label: string; detail?: string }>,
  activeHref: string,
) {
  return `
    <section class="nav-section">
      <div class="nav-section-title-row">
        <span class="nav-section-icon">${renderIcon(icon)}</span>
        <p class="nav-section-title">${title}</p>
      </div>
      <div class="nav-links">
        ${items
          .map((item) => {
            const isActive = item.href === activeHref;

            return `
              <a class="nav-link${isActive ? " is-active" : ""}" href="${item.href}">
                <span class="nav-link-label">${item.label}</span>
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
    ${renderPageHeader("Get Started", "Build the repo around a narrow idea of correct.", page.summary)}
    <section class="content-grid">
      <section class="panel">
        <div class="panel-heading">
          <p class="eyebrow">Why This Exists</p>
          <h2>Agents need fewer valid moves.</h2>
        </div>
        <p class="panel-copy">
          Guardrails turns repository structure and implementation preferences into runnable checks so an agent has fewer
          “technically possible” paths and more repo-aligned ones.
        </p>
        <div class="stat-row">
          <div class="stat">
            <span class="stat-value">${groupDocs.length}</span>
            <span class="stat-label">Groups</span>
          </div>
          <div class="stat">
            <span class="stat-value">${ruleDocs.length}</span>
            <span class="stat-label">Rules</span>
          </div>
        </div>
      </section>
      <section class="panel">
        <div class="panel-heading">
          <p class="eyebrow">Quick Start</p>
          <h2>Start with one group.</h2>
        </div>
        <div class="command-bar">
          <span class="command-label">guard.json</span>
          <code>{ "inherit": "@group/guardrails-typescript" }</code>
        </div>
        <div class="action-row">
          <a class="inline-link" href="${getSetupHref(basePath)}">Read setup</a>
          <a class="inline-link" href="${getGroupsHref(basePath)}">Browse groups</a>
        </div>
      </section>
    </section>
    ${renderArticlePanel(page.title, page.markdown)}
  `;
}

function renderGuidePage(section: string, page: (typeof getStartedDocs)[number]) {
  return `
    ${renderPageHeader(section, page.title, page.summary)}
    ${renderArticlePanel(page.title, page.markdown)}
  `;
}

function renderGroupsIndexPage() {
  return `
    ${renderPageHeader(
      "Groups",
      "Choose a baseline and let the rule list come with it.",
      "Groups bundle related checks into a single inherit entry so packages can adopt a coherent stance fast.",
    )}
    <section class="catalog-grid">
      ${groupDocs.map((groupDoc) => renderGroupCard(groupDoc)).join("")}
    </section>
  `;
}

function renderGroupPage(groupDoc: (typeof groupDocs)[number]) {
  const includedRules = groupDoc.ruleSlugs
    .map((ruleSlug) => ruleDocsBySlug.get(ruleSlug))
    .filter((ruleDoc): ruleDoc is (typeof ruleDocs)[number] => Boolean(ruleDoc));

  return `
    ${renderPageHeader("Group", groupDoc.title, groupDoc.summary)}
    <section class="content-grid">
      <section class="panel">
        <div class="panel-heading">
          <p class="eyebrow">Config</p>
          <h2>Enable this group</h2>
        </div>
        <div class="command-bar">
          <span class="command-label">guard.json</span>
          <code>{ "inherit": "@group/${groupDoc.slug}" }</code>
        </div>
      </section>
      <section class="panel">
        <div class="panel-heading">
          <p class="eyebrow">Coverage</p>
          <h2>${includedRules.length} included rules</h2>
        </div>
        <div class="tag-list">
          ${includedRules
            .slice(0, 8)
            .map((ruleDoc) => `<a class="tag" href="${getRuleHref(ruleDoc.slug, basePath)}">${ruleDoc.title}</a>`)
            .join("")}
          ${includedRules.length > 8 ? `<span class="tag tag-muted">+${includedRules.length - 8} more</span>` : ""}
        </div>
      </section>
    </section>
    ${renderArticlePanel(groupDoc.title, groupDoc.markdown)}
    <section class="panel">
      <div class="panel-heading">
        <p class="eyebrow">Rules</p>
        <h2>Everything in this group</h2>
      </div>
      <div class="catalog-grid">
        ${includedRules.map((ruleDoc) => renderRuleCard(ruleDoc)).join("")}
      </div>
    </section>
  `;
}

function renderRulesIndexPage() {
  return `
    ${renderPageHeader(
      "Rules",
      "Inspect the exact check before you opt in.",
      "Every rule page is generated from the markdown sidecar that sits next to the implementation.",
    )}
    <section class="catalog-grid">
      ${ruleDocs.map((ruleDoc) => renderRuleCard(ruleDoc)).join("")}
    </section>
  `;
}

function renderRulePage(ruleDoc: (typeof ruleDocs)[number]) {
  const owningGroups = groupDocs.filter((groupDoc) => groupDoc.ruleSlugs.includes(ruleDoc.slug));

  return `
    ${renderPageHeader("Rule", ruleDoc.title, ruleDoc.summary)}
    <section class="content-grid">
      <section class="panel">
        <div class="panel-heading">
          <p class="eyebrow">Source</p>
          <h2>Implementation files</h2>
        </div>
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
      </section>
      <section class="panel">
        <div class="panel-heading">
          <p class="eyebrow">Groups</p>
          <h2>Where it ships by default</h2>
        </div>
        <div class="tag-list">
          ${
            owningGroups.length > 0
              ? owningGroups
                  .map(
                    (groupDoc) =>
                      `<a class="tag" href="${getGroupHref(groupDoc.slug, basePath)}">${groupDoc.title}</a>`,
                  )
                  .join("")
              : '<span class="tag tag-muted">Standalone rule</span>'
          }
        </div>
      </section>
    </section>
    ${renderArticlePanel(ruleDoc.title, ruleDoc.markdown)}
  `;
}

function renderMissingPage() {
  return `
    ${renderPageHeader("Guardrails", "That page does not exist.", "The docs site could not map this URL to a known page.")}
    <section class="panel">
      <div class="action-row">
        <a class="inline-link" href="${getHomeHref(basePath)}">Go to overview</a>
      </div>
    </section>
  `;
}

function renderPageHeader(kicker: string, title: string, summary: string) {
  return `
    <section class="page-header">
      <p class="page-kicker">${kicker}</p>
      <h1>${title}</h1>
      <p class="page-summary">${summary}</p>
    </section>
  `;
}

function renderArticlePanel(title: string, markdown: string) {
  return `
    <section class="panel article-panel">
      <div class="panel-heading">
        <p class="eyebrow">Details</p>
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
    <article class="catalog-card">
      <div class="catalog-card-header">
        <span class="catalog-icon">${renderIcon("stack")}</span>
        <p class="catalog-label">@group/${groupDoc.slug}</p>
      </div>
      <h2>${groupDoc.title}</h2>
      <p class="catalog-copy">${groupDoc.summary}</p>
      <div class="catalog-meta">${groupDoc.ruleSlugs.length} rules</div>
      <a class="inline-link" href="${getGroupHref(groupDoc.slug, basePath)}">Open group</a>
    </article>
  `;
}

function renderRuleCard(ruleDoc: (typeof ruleDocs)[number]) {
  return `
    <article class="catalog-card">
      <div class="catalog-card-header">
        <span class="catalog-icon">${renderIcon("rule")}</span>
        <p class="catalog-label">@rule/${ruleDoc.slug}</p>
      </div>
      <h2>${ruleDoc.title}</h2>
      <p class="catalog-copy">${ruleDoc.summary}</p>
      <div class="catalog-meta">Rule</div>
      <a class="inline-link" href="${getRuleHref(ruleDoc.slug, basePath)}">Open rule</a>
    </article>
  `;
}

type IconName = "brand" | "guide" | "rule" | "stack";

function renderIcon(icon: IconName) {
  if (icon === "brand") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M3 3.5h10v2H3zm0 3.5h7v2H3zm0 3.5h10v2H3z" fill="currentColor" />
      </svg>
    `;
  }

  if (icon === "guide") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="M4 3h8a1 1 0 0 1 1 1v8.5a.5.5 0 0 1-.8.4L10 11.3H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" fill="none" stroke="currentColor" stroke-width="1.2" />
      </svg>
    `;
  }

  if (icon === "stack") {
    return `
      <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path d="m8 2 5 2.6L8 7.2 3 4.6 8 2Zm-5 5 5 2.6L13 7M3 9.4 8 12l5-2.6" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M3.5 3.5h9v9h-9z" fill="none" stroke="currentColor" stroke-width="1.2" />
      <path d="M5.5 5.5h5v1.5h-5zm0 3h5v1.5h-5z" fill="currentColor" />
    </svg>
  `;
}
