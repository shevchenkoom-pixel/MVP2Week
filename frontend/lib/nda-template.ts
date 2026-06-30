// Mutual NDA template data and form types.
//
// Source: Common Paper Mutual Non-Disclosure Agreement (Version 1.0)
// https://commonpaper.com/standards/mutual-nda/1.0/
// Licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/).
//
// We store the Standard Terms and Cover Page as plain strings with
// `{{token}}` placeholders. The form substitutes values into these tokens at
// render time. The strings intentionally mirror Common Paper's wording so the
// generated document is recognisable as a Common Paper MNDA.

export type PartyInfo = {
  printName: string;
  title: string;
  company: string;
  noticeAddress: string;
  date: string;
};

export type NdaFormValues = {
  purpose: string;
  effectiveDate: string;
  mndaTermMode: "fixed" | "until-terminated";
  mndaTermYears: number;
  confidentialityTermMode: "fixed" | "perpetuity";
  confidentialityTermYears: number;
  governingLaw: string;
  jurisdiction: string;
  modifications: string;
  party1: PartyInfo;
  party2: PartyInfo;
};

// All fields the user can edit. The order matches how the form will be rendered.
export const FORM_FIELDS: Array<keyof NdaFormValues> = [
  "purpose",
  "effectiveDate",
  "mndaTermMode",
  "mndaTermYears",
  "confidentialityTermMode",
  "confidentialityTermYears",
  "governingLaw",
  "jurisdiction",
  "modifications",
  "party1",
  "party2",
];

export const PARTY_FIELDS: Array<keyof PartyInfo> = [
  "printName",
  "title",
  "company",
  "noticeAddress",
  "date",
];

export const EMPTY_PARTY: PartyInfo = {
  printName: "",
  title: "",
  company: "",
  noticeAddress: "",
  date: "",
};

export const DEFAULT_FORM_VALUES: NdaFormValues = {
  purpose:
    "Evaluating whether to enter into a business relationship with the other party.",
  effectiveDate: "",
  mndaTermMode: "fixed",
  mndaTermYears: 1,
  confidentialityTermMode: "fixed",
  confidentialityTermYears: 1,
  governingLaw: "",
  jurisdiction: "",
  modifications: "",
  party1: { ...EMPTY_PARTY },
  party2: { ...EMPTY_PARTY },
};

// ---------------------------------------------------------------------------
// Standard Terms (Common Paper Mutual NDA v1.0).
// `{{token}}` placeholders are filled in by `renderStandardTerms`.
// ---------------------------------------------------------------------------

export const STANDARD_TERMS_TEMPLATE = `1. **Introduction**. This Mutual Non-Disclosure Agreement (which incorporates these Standard Terms and the Cover Page (defined below)) ("**MNDA**") allows each party ("**Disclosing Party**") to disclose or make available information in connection with the {{purpose}} which (1) the Disclosing Party identifies to the receiving party ("**Receiving Party**") as "confidential", "proprietary", or the like or (2) should be reasonably understood as confidential or proprietary due to its nature and the circumstances of its disclosure ("**Confidential Information**"). Each party's Confidential Information also includes the existence and status of the parties' discussions and information on the Cover Page. Confidential Information includes technical or business information, product designs or roadmaps, requirements, pricing, security and compliance documentation, technology, inventions and know-how. To use this MNDA, the parties must complete and sign a cover page incorporating these Standard Terms ("**Cover Page**"). Each party is identified on the Cover Page and capitalized terms have the meanings given herein or on the Cover Page.

2. **Use and Protection of Confidential Information**. The Receiving Party shall: (a) use Confidential Information solely for the {{purpose}}; (b) not disclose Confidential Information to third parties without the Disclosing Party's prior written approval, except that the Receiving Party may disclose Confidential Information to its employees, agents, advisors, contractors and other representatives having a reasonable need to know for the {{purpose}}, provided these representatives are bound by confidentiality obligations no less protective of the Disclosing Party than the applicable terms in this MNDA and the Receiving Party remains responsible for their compliance with this MNDA; and (c) protect Confidential Information using at least the same protections the Receiving Party uses for its own similar information but no less than a reasonable standard of care.

3. **Exceptions**. The Receiving Party's obligations in this MNDA do not apply to information that it can demonstrate: (a) is or becomes publicly available through no fault of the Receiving Party; (b) it rightfully knew or possessed prior to receipt from the Disclosing Party without confidentiality restrictions; (c) it rightfully obtained from a third party without confidentiality restrictions; or (d) it independently developed without using or referencing the Confidential Information.

4. **Disclosures Required by Law**. The Receiving Party may disclose Confidential Information to the extent required by law, regulation or regulatory authority, subpoena or court order, provided (to the extent legally permitted) it provides the Disclosing Party reasonable advance notice of the required disclosure and reasonably cooperates, at the Disclosing Party's expense, with the Disclosing Party's efforts to obtain confidential treatment for the Confidential Information.

5. **Term and Termination**. This MNDA commences on the {{effectiveDate}} and expires at the end of the {{mndaTermSentence}}. Either party may terminate this MNDA for any or no reason upon written notice to the other party. The Receiving Party's obligations relating to Confidential Information will survive for the {{confidentialityTermSentence}}, despite any expiration or termination of this MNDA.

6. **Return or Destruction of Confidential Information**. Upon expiration or termination of this MNDA or upon the Disclosing Party's earlier request, the Receiving Party will: (a) cease using Confidential Information; (b) promptly after the Disclosing Party's written request, destroy all Confidential Information in the Receiving Party's possession or control or return it to the Disclosing Party; and (c) if requested by the Disclosing Party, confirm its compliance with these obligations in writing. As an exception to subsection (b), the Receiving Party may retain Confidential Information in accordance with its standard backup or record retention policies or as required by law, but the terms of this MNDA will continue to apply to the retained Confidential Information.

7. **Proprietary Rights**. The Disclosing Party retains all of its intellectual property and other rights in its Confidential Information and its disclosure to the Receiving Party grants no license under such rights.

8. **Disclaimer**. ALL CONFIDENTIAL INFORMATION IS PROVIDED "AS IS", WITH ALL FAULTS, AND WITHOUT WARRANTIES, INCLUDING THE IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.

9. **Governing Law and Jurisdiction**. This MNDA and all matters relating hereto are governed by, and construed in accordance with, the laws of the State of {{governingLaw}}, without regard to the conflict of laws provisions of such {{governingLaw}}. Any legal suit, action, or proceeding relating to this MNDA must be instituted in the federal or state courts located in {{jurisdiction}}. Each party irrevocably submits to the exclusive jurisdiction of such {{jurisdiction}} in any such suit, action, or proceeding.

10. **Equitable Relief**. A breach of this MNDA may cause irreparable harm for which monetary damages are an insufficient remedy. Upon a breach of this MNDA, the Disclosing Party is entitled to seek appropriate equitable relief, including an injunction, in addition to its other remedies.

11. **General**. Neither party has an obligation under this MNDA to disclose Confidential Information to the other or proceed with any proposed transaction. Neither party may assign this MNDA without the prior written consent of the other party, except that either party may assign this MNDA in connection with a merger, reorganization, acquisition or other transfer of all or substantially all its assets or voting securities. Any assignment in violation of this Section is null and void. This MNDA will bind and inure to the benefit of each party's permitted successors and assigns. Waivers must be signed by the waiving party's authorized representative and cannot be implied from conduct. If any provision of this MNDA is held unenforceable, it will be limited to the minimum extent necessary so the rest of this MNDA remains in effect. This MNDA (including the Cover Page) constitutes the entire agreement of the parties with respect to its subject matter, and supersedes all prior and contemporaneous understandings, agreements, representations, and warranties, whether written or oral, regarding such subject matter. This MNDA may only be amended, modified, waived, or supplemented by an agreement in writing signed by both parties. Notices, requests and approvals under this MNDA must be sent in writing to the email or postal addresses on the Cover Page and are deemed delivered on receipt. This MNDA may be executed in counterparts, including electronic copies, each of which is deemed an original and which together form the same agreement.

{{modificationsBlock}}Common Paper Mutual Non-Disclosure Agreement [Version 1.0](https://commonpaper.com/standards/mutual-nda/1.0/) free to use under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`;

// ---------------------------------------------------------------------------
// Cover Page (Common Paper Mutual NDA v1.0 Cover Page).
// ---------------------------------------------------------------------------

export const COVER_PAGE_TEMPLATE = `# Mutual Non-Disclosure Agreement

## USING THIS MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "**MNDA**") consists of: (1) this Cover Page ("**Cover Page**") and (2) the Common Paper Mutual NDA Standard Terms Version 1.0 ("**Standard Terms**") identical to those posted at [commonpaper.com/standards/mutual-nda/1.0](https://commonpaper.com/standards/mutual-nda/1.0). Any modifications of the Standard Terms should be made on the Cover Page, which will control over conflicts with the Standard Terms.

### Purpose
*How Confidential Information may be used*

> {{purpose}}

### Effective Date
{{effectiveDate}}

### MNDA Term
*The length of this MNDA*

- {{mndaTermCheckboxFixed}}     Expires {{mndaTermYears}} year(s) from Effective Date.
- {{mndaTermCheckboxUntil}}     Continues until terminated in accordance with the terms of the MNDA.

### Term of Confidentiality
*How long Confidential Information is protected*

- {{confidentialityCheckboxFixed}}     {{confidentialityTermYears}} year(s) from Effective Date, but in the case of trade secrets until Confidential Information is no longer considered a trade secret under applicable laws.
- {{confidentialityCheckboxPerpetual}}     In perpetuity.

### Governing Law & Jurisdiction

**Governing Law:** {{governingLaw}}

**Jurisdiction:** {{jurisdiction}}

### MNDA Modifications
*List any modifications to the MNDA*

{{modifications}}

By signing this Cover Page, each party agrees to enter into this MNDA as of the Effective Date.

| | Party 1 | Party 2 |
|:--- | :--- | :--- |
| Signature | _________________________ | _________________________ |
| Print Name | {{party1.printName}} | {{party2.printName}} |
| Title | {{party1.title}} | {{party2.title}} |
| Company | {{party1.company}} | {{party2.company}} |
| Notice Address *(email or postal address)* | {{party1.noticeAddress}} | {{party2.noticeAddress}} |
| Date | {{party1.date}} | {{party2.date}} |

Common Paper Mutual Non-Disclosure Agreement (Version 1.0) free to use under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).`;

// Human-readable attribution shown in the UI footer.
export const TEMPLATE_ATTRIBUTION = {
  sourceName: "Common Paper Mutual Non-Disclosure Agreement",
  version: "1.0",
  sourceUrl: "https://commonpaper.com/standards/mutual-nda/1.0/",
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
};