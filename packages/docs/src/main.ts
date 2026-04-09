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
const githubSourceBaseUrl = "https://github.com/two-pebble/guardrails/blob/main/";

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
    renderPage(rootElement, getOverviewHref(basePath), renderOverviewPage(page));
    return;
  }

  if (route.kind === "setup") {
    const page = getRequiredStartedDoc("setup");
    document.title = `${page.title} | Guardrails Docs`;
    renderPage(rootElement, getSetupHref(basePath), renderGuidePage("Get Started", page));
    return;
  }

  if (route.kind === "groups") {
    document.title = "Groups | Guardrails Docs";
    renderPage(rootElement, getGroupsHref(basePath), renderGroupsIndexPage());
    return;
  }

  if (route.kind === "group") {
    const groupDoc = groupDocsBySlug.get(route.slug);

    if (!groupDoc) {
      renderPage(rootElement, "", renderMissingPage());
      return;
    }

    document.title = `${groupDoc.title} | Guardrails Docs`;
    renderPage(rootElement, getGroupHref(groupDoc.slug, basePath), renderGroupPage(groupDoc));
    return;
  }

  if (route.kind === "rules") {
    document.title = "Rules | Guardrails Docs";
    renderPage(rootElement, getRulesHref(basePath), renderRulesIndexPage());
    return;
  }

  if (route.kind === "rule") {
    const ruleDoc = ruleDocsBySlug.get(route.slug);

    if (!ruleDoc) {
      renderPage(rootElement, "", renderMissingPage());
      return;
    }

    document.title = `${ruleDoc.title} | Guardrails Docs`;
    renderPage(rootElement, getRuleHref(ruleDoc.slug, basePath), renderRulePage(ruleDoc));
    return;
  }

  renderPage(rootElement, "", renderMissingPage());
}

function renderPage(rootElement: HTMLDivElement, activeHref: string, content: string) {
  rootElement.innerHTML = renderLayout(activeHref, content);
  enhanceCodeBlocks(rootElement);
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
      ${renderSidebarGroupPills(activeHref)}
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

function renderSidebarGroupPills(activeHref: string) {
  return `
    <section class="nav-section">
      <div class="nav-section-title-row">
        <span class="nav-section-icon">${renderIcon("stack")}</span>
        <p class="nav-section-title">Groups</p>
      </div>
      <div class="group-pill-list">
        ${groupDocs
          .map((groupDoc) => {
            const href = getGroupHref(groupDoc.slug, basePath);
            const isActive = href === activeHref;

            return `
              <a class="group-pill${isActive ? " is-active" : ""}" href="${href}">
                <span class="group-pill-label">${groupDoc.title}</span>
                <span class="group-pill-count">${groupDoc.ruleSlugs.length}</span>
              </a>
            `;
          })
          .join("")}
      </div>
    </section>
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
    ${renderPageHeader("Get Started", "Build the repo around a narrow idea of correct.", page.summary, [
      { label: "Groups", value: String(groupDocs.length) },
      { label: "Rules", value: String(ruleDocs.length) },
      { label: "Focus", value: "Agent-aligned repos" },
    ])}
    <section class="page-columns">
      <div class="page-main">
        <section class="feature-grid">
          <section class="panel">
            <div class="panel-heading">
              <p class="eyebrow">Why This Exists</p>
              <h2>Agents need fewer valid moves.</h2>
            </div>
            <p class="panel-copy">
              Guardrails turns repository structure and implementation preferences into runnable checks so an agent has
              fewer “technically possible” paths and more repo-aligned ones.
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
        ${renderArticlePanel(page.markdown)}
      </div>
      <aside class="page-rail">
        ${renderKeyValuePanel("Get Started", [
          { label: "Best first page", value: "Setup" },
          { label: "Recommended inherit", value: "@group/guardrails-typescript" },
          { label: "Docs model", value: "Generated from source sidecars" },
        ])}
      </aside>
    </section>
  `;
}

function renderGuidePage(section: string, page: (typeof getStartedDocs)[number]) {
  return `
    ${renderPageHeader(section, page.title, page.summary)}
    <section class="page-columns">
      <div class="page-main">
        ${renderArticlePanel(page.markdown)}
      </div>
      <aside class="page-rail">
        ${renderKeyValuePanel("Setup", [
          { label: "Package", value: "@two-pebble/guard" },
          { label: "Entrypoint", value: "guardrails" },
          { label: "Config file", value: "guard.json" },
        ])}
      </aside>
    </section>
  `;
}

function renderGroupsIndexPage() {
  return `
    ${renderPageHeader(
      "Groups",
      "Choose a baseline and let the rule list come with it.",
      "Groups bundle related checks into a single inherit entry so packages can adopt a coherent stance fast.",
    )}
    <section class="catalog-list">
      ${groupDocs.map((groupDoc) => renderGroupCard(groupDoc)).join("")}
    </section>
  `;
}

function renderGroupPage(groupDoc: (typeof groupDocs)[number]) {
  const includedRules = groupDoc.ruleSlugs
    .map((ruleSlug) => ruleDocsBySlug.get(ruleSlug))
    .filter((ruleDoc): ruleDoc is (typeof ruleDocs)[number] => Boolean(ruleDoc));

  return `
    ${renderPageHeader("Group", groupDoc.title, groupDoc.summary, [
      { label: "Rule count", value: String(includedRules.length) },
      { label: "Config", value: `@group/${groupDoc.slug}` },
    ])}
    <section class="page-columns">
      <div class="page-main">
        ${renderArticlePanel(groupDoc.markdown)}
        <section class="panel">
          <div class="panel-heading">
            <p class="eyebrow">Included Rules</p>
            <h2>Everything in this group</h2>
          </div>
          <div class="catalog-list compact-list">
            ${includedRules.map((ruleDoc) => renderRuleCard(ruleDoc)).join("")}
          </div>
        </section>
      </div>
      <aside class="page-rail">
        ${renderCommandPanel("Enable this group", `{ "inherit": "@group/${groupDoc.slug}" }`)}
        ${renderTagPanel(
          "Coverage",
          `${includedRules.length} rules ship by default`,
          includedRules.slice(0, 10).map((ruleDoc) => ({
            href: getRuleHref(ruleDoc.slug, basePath),
            label: ruleDoc.title,
          })),
          includedRules.length > 10 ? `+${includedRules.length - 10} more` : undefined,
        )}
      </aside>
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
    <section class="catalog-list">
      ${ruleDocs.map((ruleDoc) => renderRuleCard(ruleDoc)).join("")}
    </section>
  `;
}

function renderRulePage(ruleDoc: (typeof ruleDocs)[number]) {
  const owningGroups = groupDocs.filter((groupDoc) => groupDoc.ruleSlugs.includes(ruleDoc.slug));

  return `
    ${renderPageHeader("Rule", ruleDoc.title, ruleDoc.summary, [
      { label: "Rule id", value: `@rule/${ruleDoc.slug}` },
      { label: "Ships in", value: owningGroups.length > 0 ? `${owningGroups.length} groups` : "Standalone" },
    ])}
    <section class="page-columns">
      <div class="page-main">
        ${renderArticlePanel(ruleDoc.markdown)}
      </div>
      <aside class="page-rail">
        ${renderKeyValuePanel("Source", [
          {
            label: "Rule file",
            value: ruleDoc.ruleSourcePath,
            code: true,
            href: getGithubSourceHref(ruleDoc.ruleSourcePath),
          },
          {
            label: "Docs file",
            value: ruleDoc.docsSourcePath,
            code: true,
            href: getGithubSourceHref(ruleDoc.docsSourcePath),
          },
        ])}
        ${
          owningGroups.length > 0
            ? renderTagPanel(
                "Groups",
                "Where it ships by default",
                owningGroups.map((groupDoc) => ({
                  href: getGroupHref(groupDoc.slug, basePath),
                  label: groupDoc.title,
                })),
              )
            : renderKeyValuePanel("Groups", [{ label: "Availability", value: "Standalone rule" }])
        }
      </aside>
    </section>
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

function renderPageHeader(
  kicker: string,
  title: string,
  summary: string,
  metaItems: Array<{ label: string; value: string }> = [],
) {
  return `
    <section class="page-header">
      <p class="page-kicker">${kicker}</p>
      <h1>${title}</h1>
      <p class="page-summary">${summary}</p>
      ${
        metaItems.length > 0
          ? `<div class="header-meta">
              ${metaItems
                .map(
                  (item) => `
                    <div class="header-meta-item">
                      <span class="header-meta-label">${item.label}</span>
                      <span class="header-meta-value">${item.value}</span>
                    </div>
                  `,
                )
                .join("")}
            </div>`
          : ""
      }
    </section>
  `;
}

function renderArticlePanel(markdown: string) {
  return `
    <section class="panel article-panel">
      <article class="markdown-body">
        ${marked.parse(stripLeadingHeading(markdown))}
      </article>
    </section>
  `;
}

function stripLeadingHeading(markdown: string) {
  return markdown.replace(/^# .+\n+/, "");
}

function enhanceCodeBlocks(rootElement: HTMLDivElement) {
  const codeBlocks = rootElement.querySelectorAll<HTMLPreElement>(".markdown-body pre");

  codeBlocks.forEach((preElement) => {
    if (preElement.parentElement?.classList.contains("code-block")) {
      return;
    }

    const codeElement = preElement.querySelector("code");

    if (!codeElement) {
      return;
    }

    const language = getCodeBlockLanguage(codeElement);
    const source = codeElement.textContent ?? "";

    if (language === "json" || language === "jsonc") {
      codeElement.innerHTML = highlightJson(source);
    }

    const wrapperElement = document.createElement("div");
    wrapperElement.className = "code-block";

    const headerElement = document.createElement("div");
    headerElement.className = "code-block-header";

    const labelElement = document.createElement("span");
    labelElement.className = "code-block-label";
    labelElement.textContent = language ?? "text";

    const copyButtonElement = document.createElement("button");
    copyButtonElement.type = "button";
    copyButtonElement.className = "code-copy-button";
    copyButtonElement.textContent = "Copy";
    copyButtonElement.addEventListener("click", async () => {
      await navigator.clipboard.writeText(source);
      copyButtonElement.textContent = "Copied";
      window.setTimeout(() => {
        copyButtonElement.textContent = "Copy";
      }, 1200);
    });

    headerElement.append(labelElement, copyButtonElement);
    preElement.replaceWith(wrapperElement);
    wrapperElement.append(headerElement, preElement);
  });
}

function getCodeBlockLanguage(codeElement: HTMLElement) {
  const languageClassName = Array.from(codeElement.classList).find((className) => className.startsWith("language-"));

  return languageClassName?.replace("language-", "");
}

function highlightJson(source: string) {
  const escapedSource = escapeHtml(source);

  return escapedSource.replace(
    /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b/g,
    (match, quotedValue: string | undefined, colon: string | undefined, literal: string | undefined) => {
      if (quotedValue) {
        if (colon) {
          return `<span class="token token-key">${quotedValue}</span>${colon}`;
        }

        return `<span class="token token-string">${quotedValue}</span>`;
      }

      if (literal === "true" || literal === "false") {
        return `<span class="token token-boolean">${match}</span>`;
      }

      if (literal === "null") {
        return `<span class="token token-null">${match}</span>`;
      }

      return `<span class="token token-number">${match}</span>`;
    },
  );
}

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function renderCommandPanel(title: string, command: string) {
  return `
    <section class="panel rail-panel">
      <div class="panel-heading">
        <p class="eyebrow">Config</p>
        <h2>${title}</h2>
      </div>
      <div class="command-bar">
        <span class="command-label">guard.json</span>
        <code>${command}</code>
      </div>
    </section>
  `;
}

function getGithubSourceHref(sourcePath: string) {
  return `${githubSourceBaseUrl}${sourcePath}`;
}

function renderKeyValuePanel(
  title: string,
  items: Array<{ label: string; value: string; code?: boolean; href?: string }>,
) {
  return `
    <section class="panel rail-panel">
      <div class="panel-heading">
        <p class="eyebrow">${title}</p>
      </div>
      <dl class="detail-list">
        ${items
          .map(
            (item) => `
              <div>
                <dt>${item.label}</dt>
                <dd>${
                  item.href
                    ? `<a class="detail-link" href="${item.href}" target="_blank" rel="noreferrer">${item.code ? `<code>${item.value}</code>` : item.value}</a>`
                    : item.code
                      ? `<code>${item.value}</code>`
                      : item.value
                }</dd>
              </div>
            `,
          )
          .join("")}
      </dl>
    </section>
  `;
}

function renderTagPanel(
  title: string,
  summary: string,
  items: Array<{ href: string; label: string }>,
  remainderLabel?: string,
) {
  return `
    <section class="panel rail-panel">
      <div class="panel-heading">
        <p class="eyebrow">${title}</p>
        <h2>${summary}</h2>
      </div>
      <div class="tag-list">
        ${items.map((item) => `<a class="tag" href="${item.href}">${item.label}</a>`).join("")}
        ${remainderLabel ? `<span class="tag tag-muted">${remainderLabel}</span>` : ""}
      </div>
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
      <div class="catalog-main">
        <div class="catalog-copy-block">
          <h2>${groupDoc.title}</h2>
          <p class="catalog-copy">${groupDoc.summary}</p>
        </div>
        <div class="catalog-trailing">
          <div class="catalog-meta">${groupDoc.ruleSlugs.length} rules</div>
          <a class="inline-link" href="${getGroupHref(groupDoc.slug, basePath)}">Open</a>
        </div>
      </div>
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
      <div class="catalog-main">
        <div class="catalog-copy-block">
          <h2>${ruleDoc.title}</h2>
          <p class="catalog-copy">${ruleDoc.summary}</p>
        </div>
        <div class="catalog-trailing">
          <div class="catalog-meta">Rule</div>
          <a class="inline-link" href="${getRuleHref(ruleDoc.slug, basePath)}">Open</a>
        </div>
      </div>
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
