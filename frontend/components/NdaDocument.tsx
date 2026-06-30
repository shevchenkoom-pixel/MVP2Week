"use client";

import { useState } from "react";
import { NdaFormValues, TEMPLATE_ATTRIBUTION } from "@/lib/nda-template";
import { renderFullDocument } from "@/lib/format";

type CopyState = "idle" | "copied" | "error";

type NdaDocumentProps = {
  values: NdaFormValues;
};

export default function NdaDocument({ values }: NdaDocumentProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const documentMarkdown = renderFullDocument(values);
  const documentHtml = markdownToHtml(documentMarkdown);

  function handlePrint() {
    if (typeof window !== "undefined") {
      window.print();
    }
  }

  async function handleCopy() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(documentMarkdown);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }

  function handleDownload() {
    if (typeof window === "undefined") return;
    const blob = new Blob([documentMarkdown], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = "mutual-nda.md";
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="no-print flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handlePrint}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Print / Save as PDF
        </button>
        <button
          type="button"
          onClick={handleDownload}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Download .md
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {copyState === "copied"
            ? "Copied!"
            : copyState === "error"
              ? "Copy failed"
              : "Copy Markdown"}
        </button>
        <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
          Use your browser&apos;s &ldquo;Save as PDF&rdquo; in the print dialog.
        </span>
      </div>

      <article
        className="print-area prose prose-zinc max-w-none flex-1 overflow-auto rounded-lg border border-zinc-200 bg-white p-8 text-sm leading-7 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: documentHtml }}
      />

      <p className="no-print text-xs text-zinc-500 dark:text-zinc-400">
        Template:{" "}
        <a
          href={TEMPLATE_ATTRIBUTION.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {TEMPLATE_ATTRIBUTION.sourceName} v{TEMPLATE_ATTRIBUTION.version}
        </a>{" "}
        (used under{" "}
        <a
          href={TEMPLATE_ATTRIBUTION.licenseUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          {TEMPLATE_ATTRIBUTION.license}
        </a>
        ).
      </p>
    </div>
  );
}

// Lightweight Markdown -> HTML converter for the small subset used by the
// NDA template: headings, blockquotes, ordered/unordered lists, tables, bold
// (**), italic (*), inline code (`), and links. We do this in-component to
// avoid pulling a Markdown parser into the bundle for a fixed template.
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function applyInline(line: string): string {
  let out = escapeHtml(line);
  // Inline code first so its content is not re-processed.
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Bold then italic.
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  // Links: [text](url)
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );
  return out;
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const html: string[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Skip blank lines between blocks.
    if (line.trim() === "") {
      i += 1;
      continue;
    }

    // Headings
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${applyInline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    // Horizontal rule
    if (/^---+\s*$/.test(line)) {
      html.push("<hr />");
      i += 1;
      continue;
    }

    // Table: header line followed by separator line
    if (
      /^\|.*\|\s*$/.test(line) &&
      i + 1 < lines.length &&
      /^\|[\s:-|]+\|\s*$/.test(lines[i + 1])
    ) {
      const headerCells = splitTableRow(line);
      i += 2; // skip separator
      const bodyRows: string[][] = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        bodyRows.push(splitTableRow(lines[i]));
        i += 1;
      }
      const thead = `<thead><tr>${headerCells
        .map((c) => `<th>${applyInline(c)}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map(
          (row) =>
            `<tr>${row.map((c) => `<td>${applyInline(c)}</td>`).join("")}</tr>`,
        )
        .join("")}</tbody>`;
      html.push(`<table>${thead}${tbody}</table>`);
      continue;
    }

    // Blockquote (one or more consecutive lines starting with ">")
    if (line.startsWith(">")) {
      const buffer: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        buffer.push(lines[i].replace(/^>\s?/, ""));
        i += 1;
      }
      html.push(`<blockquote><p>${applyInline(buffer.join(" "))}</p></blockquote>`);
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i += 1;
      }
      html.push(
        `<ul>${items.map((it) => `<li>${applyInline(it)}</li>`).join("")}</ul>`,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      html.push(
        `<ol>${items.map((it) => `<li>${applyInline(it)}</li>`).join("")}</ol>`,
      );
      continue;
    }

    // Paragraph: consume contiguous non-empty, non-special lines.
    const buffer: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !lines[i].startsWith(">") &&
      !/^\|.*\|\s*$/.test(lines[i])
    ) {
      buffer.push(lines[i]);
      i += 1;
    }
    html.push(`<p>${applyInline(buffer.join(" "))}</p>`);
  }

  return html.join("\n");
}

function splitTableRow(row: string): string[] {
  return row
    .replace(/^\|/, "")
    .replace(/\|\s*$/, "")
    .split("|")
    .map((cell) => cell.trim());
}