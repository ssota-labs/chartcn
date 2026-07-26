# Notion information architecture

Path: `skills/oh-my-doc/references/` (name **`references`**, not `ref`).

Machine-readable companion: `notion-ia-graph.json` (`schemaVersion` 1.2).

Catalog destinations are **pages** that embed their database **inline**. The
navigable object is the page; the database is not a top-level sidebar target.

## Sources parenting (`home-toggle`)

The user-supplied `--notion-root` URL **is** `pages.home` (role `home`). Do not
create a separate Home child page.

Top-level managed pages are parented under Home and rendered inside a
`<details>` toggle titled **데이터 원본** (`toggles.sources`, kind `toggle`) on
the Home page body — not under a separate sources page.

```text
Home (= user-supplied --notion-root)
├── <details> 데이터 원본
│   ├── Vision
│   ├── Start here
│   ├── Workflow
│   │   ├── Workflow Planning
│   │   └── Development
│   ├── Domain
│   │   ├── Glossary (page → inline DB)
│   │   ├── Models (page → inline DB)
│   │   └── Policies (page → inline DB)
│   ├── Planning
│   │   ├── PRDs (page → inline DB)
│   │   └── Stories (page → inline DB)
│   ├── Spec
│   │   ├── Data model (page → inline DB)
│   │   ├── System model (page → inline DB)
│   │   └── CLI
│   ├── Plans (page → inline DB)
│   └── ADRs (page → inline DB)
└── (sidebar chrome on Home and every managed page)
```

Toggle children must be indented under `<details>` so Notion keeps them inside
the toggle. Use `<page url="…">` blocks (not bare URLs).

Sidebar navigation uses page mentions only — never bare URLs as the primary nav.
Every `pages.*` object must receive the shared sidebar chrome.
