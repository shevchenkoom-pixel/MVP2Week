import {
  COVER_PAGE_TEMPLATE,
  NdaFormValues,
  STANDARD_TERMS_TEMPLATE,
  TEMPLATE_ATTRIBUTION,
} from "./nda-template";

// Replace every `{{token}}` in `template` with the corresponding string value.
// Tokens that look like `obj.field` are looked up against the values object.
// Unknown tokens are replaced with an italic `[missing: token]` marker so the
// generated document never contains a literal `{{...}}`.
function substitute(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (match, key: string) => {
    const value = values[key];
    if (value === undefined) return `*[missing: ${key}]*`;
    return value;
  });
}

function pluralizeYears(years: number): string {
  return `${years} year${years === 1 ? "" : "s"}`;
}

function checkbox(selected: boolean): string {
  return selected ? "[x]" : "[ ]";
}

// Build the secondary phrases that appear inside the Standard Terms, where
// Common Paper refers back to cover-page values without a checkbox marker.
function buildSecondaryValues(values: NdaFormValues): Record<string, string> {
  const mndaTermSentence =
    values.mndaTermMode === "fixed"
      ? `${pluralizeYears(values.mndaTermYears)} from the Effective Date`
      : "time it is terminated in accordance with the terms of the MNDA";

  const confidentialityTermSentence =
    values.confidentialityTermMode === "fixed"
      ? `${pluralizeYears(values.confidentialityTermYears)} after expiration or termination of this MNDA`
      : "duration of the parties' discussions";

  const modificationsBlock =
    values.modifications.trim().length > 0
      ? `**Modifications.** ${values.modifications.trim()}\n\n`
      : "";

  return {
    mndaTermSentence,
    confidentialityTermSentence,
    modificationsBlock,
  };
}

function partyValues(
  prefix: "party1" | "party2",
  party: NdaFormValues["party1"],
): Record<string, string> {
  return {
    [`${prefix}.printName`]: party.printName || `*[${prefix === "party1" ? "Party 1" : "Party 2"} print name]*`,
    [`${prefix}.title`]: party.title || "*[Title]*",
    [`${prefix}.company`]: party.company || "*[Company]*",
    [`${prefix}.noticeAddress`]: party.noticeAddress || "*[Email or postal address]*",
    [`${prefix}.date`]: party.date || "*[Date]*",
  };
}

// Cover-page tokens must always produce a value (a checkbox marker, a fallback
// string in italics, or the user's input). The same placeholder strategy is
// used for both rendering and for the "Copy as Markdown" output.
function buildCoverPageValues(values: NdaFormValues): Record<string, string> {
  return {
    purpose: values.purpose || "*[Purpose]*",
    effectiveDate: values.effectiveDate || "*[Effective Date]*",
    mndaTermCheckboxFixed: checkbox(values.mndaTermMode === "fixed"),
    mndaTermCheckboxUntil: checkbox(values.mndaTermMode === "until-terminated"),
    mndaTermYears: String(values.mndaTermYears),
    confidentialityCheckboxFixed: checkbox(
      values.confidentialityTermMode === "fixed",
    ),
    confidentialityCheckboxPerpetual: checkbox(
      values.confidentialityTermMode === "perpetuity",
    ),
    confidentialityTermYears: String(values.confidentialityTermYears),
    governingLaw: values.governingLaw || "*[State]*",
    jurisdiction: values.jurisdiction || "*[City or county and state]*",
    modifications:
      values.modifications.trim().length > 0
        ? values.modifications
        : "_None._",
    ...partyValues("party1", values.party1),
    ...partyValues("party2", values.party2),
  };
}

export function renderStandardTerms(values: NdaFormValues): string {
  const topLevel: Record<string, string> = {
    purpose: values.purpose || "[Purpose]",
    effectiveDate: values.effectiveDate || "[Effective Date]",
    governingLaw: values.governingLaw || "[State]",
    jurisdiction: values.jurisdiction || "[City or county and state]",
    ...buildSecondaryValues(values),
  };
  return substitute(STANDARD_TERMS_TEMPLATE, topLevel);
}

export function renderCoverPage(values: NdaFormValues): string {
  return substitute(COVER_PAGE_TEMPLATE, buildCoverPageValues(values));
}

// The full document: cover page, then standard terms.
export function renderFullDocument(values: NdaFormValues): string {
  return `${renderCoverPage(values)}\n\n---\n\n${renderStandardTerms(values)}`;
}

export function getAttribution() {
  return TEMPLATE_ATTRIBUTION;
}