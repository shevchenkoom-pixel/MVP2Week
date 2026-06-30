# Mutual NDA Creator (frontend)

Next.js 16 / React 19 app for Jira task **PL-3** &mdash; a web prototype that
turns a short form into a filled-in [Common Paper Mutual
Non-Disclosure Agreement](https://commonpaper.com/standards/mutual-nda/1.0/).

The app runs entirely in the browser. Form values are persisted to
`localStorage`; the generated document is never sent to a server.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript (strict)
- Tailwind CSS 4 (via PostCSS)
- No backend, no database, no third-party form / Markdown libraries

## Getting started

From the `frontend/` directory:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Other scripts

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## How it works

- `app/page.tsx` &mdash; top-level page. Holds the form values in React state
  and rehydrates from `localStorage` on mount. SSR renders the default state,
  so the first client render matches the server.
- `components/NdaForm.tsx` &mdash; controlled form for every variable in the
  Common Paper Mutual NDA Cover Page: purpose, effective date, term options,
  governing law, jurisdiction, modifications, and both parties.
- `components/NdaDocument.tsx` &mdash; renders the document preview from
  Markdown and provides three actions:
  - **Print / Save as PDF** &mdash; triggers `window.print()`. The
    `@media print` block in `app/globals.css` hides the form and shows only
    the document.
  - **Download .md** &mdash; downloads `mutual-nda.md` from a `Blob`.
  - **Copy Markdown** &mdash; copies the Markdown source to the clipboard.
- `lib/nda-template.ts` &mdash; Common Paper Mutual NDA Standard Terms v1.0
  and Cover Page (CC BY 4.0), with `{{token}}` placeholders.
- `lib/format.ts` &mdash; substitutes form values into the templates and
  returns either the Cover Page, the Standard Terms, or the combined
  document.

## Attribution

The Mutual NDA wording and structure is taken from the Common Paper Mutual
Non-Disclosure Agreement (Version 1.0), used under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Source:
<https://commonpaper.com/standards/mutual-nda/1.0/>.

## Disclaimer

This is a prototype. It is **not legal advice** and the generated document
should be reviewed by a qualified attorney before use.
