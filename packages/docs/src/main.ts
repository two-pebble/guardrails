import "./style.css";
import { marked } from "marked";
import { ruleDocs } from "./generated/rule-docs";
import { getDocsRoute, getHomeHref, getRuleHref } from "./routing";

const appElement = document.querySelector<HTMLDivElement>("#app");
const basePath = import.meta.env.BASE_URL;

if (!appElement) {
  throw new Error("Expected #app element to exist.");
}

renderApp(appElement);

function renderApp(rootElement: HTMLDivElement) {
  const route = getDocsRoute(window.location.pathname, basePath);

  if (route.kind === "rule") {
    const ruleDoc = ruleDocs.find((entry) => entry.slug === route.slug);

    if (!ruleDoc) {
      document.title = "Guardrails Docs";
      rootElement.innerHTML = renderMissingPage();
      return;
    }

    document.title = `${ruleDoc.title} | Guardrails Docs`;
    rootElement.innerHTML = renderRulePage(ruleDoc);
    return;
  }

  if (route.kind === "missing") {
    document.title = "Guardrails Docs";
    rootElement.innerHTML = renderMissingPage();
    return;
  }

  document.title = "Guardrails Docs";
  rootElement.innerHTML = renderIndexPage();
}

function renderIndexPage() {
  return `
    <main class="page-shell">
      <section class="hero">
        <p class="eyebrow">Guardrails</p>
        <h1>Rule docs generated from source sidecars.</h1>
        <p class="lede">
          Every rule page is inferred from its folder on disk and rendered from the adjacent <code>docs.md</code> file.
        </p>
      </section>
      <section class="rule-list">
        ${ruleDocs
          .map(
            (ruleDoc) => `
              <article class="rule-card">
                <p class="rule-label">@rule/${ruleDoc.slug}</p>
                <h2>${ruleDoc.title}</h2>
                <p>${ruleDoc.summary}</p>
                <dl class="meta-list">
                  <div>
                    <dt>Rule source</dt>
                    <dd><code>${ruleDoc.ruleSourcePath}</code></dd>
                  </div>
                  <div>
                    <dt>Docs source</dt>
                    <dd><code>${ruleDoc.docsSourcePath}</code></dd>
                  </div>
                </dl>
                <a class="rule-link" href="${getRuleHref(ruleDoc.slug, basePath)}">Open rule page</a>
              </article>
            `,
          )
          .join("")}
      </section>
    </main>
  `;
}

function renderRulePage(ruleDoc: (typeof ruleDocs)[number]) {
  return `
    <main class="page-shell page-shell-detail">
      <a class="back-link" href="${getHomeHref(basePath)}">Back to all rules</a>
      <section class="rule-hero">
        <p class="eyebrow">@rule/${ruleDoc.slug}</p>
        <h1>${ruleDoc.title}</h1>
        <p class="lede">${ruleDoc.summary}</p>
        <dl class="meta-list">
          <div>
            <dt>Rule source</dt>
            <dd><code>${ruleDoc.ruleSourcePath}</code></dd>
          </div>
          <div>
            <dt>Docs source</dt>
            <dd><code>${ruleDoc.docsSourcePath}</code></dd>
          </div>
        </dl>
      </section>
      <article class="markdown-body">
        ${marked.parse(ruleDoc.markdown)}
      </article>
    </main>
  `;
}

function renderMissingPage() {
  return `
    <main class="page-shell page-shell-detail">
      <p class="eyebrow">Guardrails</p>
      <h1>That rule page does not exist.</h1>
      <p class="lede">The docs site could not map this URL to a generated rule page.</p>
      <a class="back-link" href="${getHomeHref(basePath)}">Return to the docs index</a>
    </main>
  `;
}
