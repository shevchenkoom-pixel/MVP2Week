"use client";

import { NdaFormValues, PartyInfo } from "@/lib/nda-template";

type NdaFormProps = {
  values: NdaFormValues;
  onChange: (next: NdaFormValues) => void;
  onReset: () => void;
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
        {label}
      </span>
      {children}
      {hint ? (
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
      ) : null}
    </label>
  );
}

const inputClass =
  "rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/10 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-200 dark:focus:ring-zinc-200/10";

function PartyBlock({
  title,
  party,
  onChange,
}: {
  title: string;
  party: PartyInfo;
  onChange: (next: PartyInfo) => void;
}) {
  function update<K extends keyof PartyInfo>(key: K, value: PartyInfo[K]) {
    onChange({ ...party, [key]: value });
  }

  return (
    <fieldset className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <legend className="px-2 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {title}
      </legend>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Print Name">
          <input
            className={inputClass}
            type="text"
            value={party.printName}
            onChange={(e) => update("printName", e.target.value)}
            placeholder="Alex Smith"
          />
        </Field>
        <Field label="Title">
          <input
            className={inputClass}
            type="text"
            value={party.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="CEO"
          />
        </Field>
      </div>

      <Field label="Company">
        <input
          className={inputClass}
          type="text"
          value={party.company}
          onChange={(e) => update("company", e.target.value)}
          placeholder="Acme, Inc."
        />
      </Field>

      <Field
        label="Notice Address"
        hint="Use either an email or a postal address."
      >
        <input
          className={inputClass}
          type="text"
          value={party.noticeAddress}
          onChange={(e) => update("noticeAddress", e.target.value)}
          placeholder="alex@acme.com"
        />
      </Field>

      <Field label="Date">
        <input
          className={inputClass}
          type="date"
          value={party.date}
          onChange={(e) => update("date", e.target.value)}
        />
      </Field>
    </fieldset>
  );
}

export default function NdaForm({ values, onChange, onReset }: NdaFormProps) {
  function update<K extends keyof NdaFormValues>(
    key: K,
    value: NdaFormValues[K],
  ) {
    onChange({ ...values, [key]: value });
  }

  function handleReset() {
    onReset();
  }

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={(e) => e.preventDefault()}
    >
      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Agreement basics
        </h2>

        <Field
          label="Purpose"
          hint="How Confidential Information may be used under this MNDA."
        >
          <textarea
            className={`${inputClass} min-h-20`}
            value={values.purpose}
            onChange={(e) => update("purpose", e.target.value)}
            placeholder="Evaluating whether to enter into a business relationship with the other party."
          />
        </Field>

        <Field label="Effective Date">
          <input
            className={inputClass}
            type="date"
            value={values.effectiveDate}
            onChange={(e) => update("effectiveDate", e.target.value)}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Term & confidentiality
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="MNDA Term">
            <select
              className={inputClass}
              value={values.mndaTermMode}
              onChange={(e) =>
                update(
                  "mndaTermMode",
                  e.target.value as NdaFormValues["mndaTermMode"],
                )
              }
            >
              <option value="fixed">Fixed number of years</option>
              <option value="until-terminated">
                Until terminated by either party
              </option>
            </select>
          </Field>

          {values.mndaTermMode === "fixed" ? (
            <Field label="Years" hint="Number of years from the Effective Date.">
              <input
                className={inputClass}
                type="number"
                min={1}
                max={99}
                value={values.mndaTermYears}
                onChange={(e) =>
                  update(
                    "mndaTermYears",
                    Math.max(1, Number(e.target.value) || 1),
                  )
                }
              />
            </Field>
          ) : (
            <div />
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Term of Confidentiality">
            <select
              className={inputClass}
              value={values.confidentialityTermMode}
              onChange={(e) =>
                update(
                  "confidentialityTermMode",
                  e.target.value as NdaFormValues["confidentialityTermMode"],
                )
              }
            >
              <option value="fixed">Fixed number of years</option>
              <option value="perpetuity">In perpetuity</option>
            </select>
          </Field>

          {values.confidentialityTermMode === "fixed" ? (
            <Field
              label="Years"
              hint="After expiration or termination of the MNDA."
            >
              <input
                className={inputClass}
                type="number"
                min={1}
                max={99}
                value={values.confidentialityTermYears}
                onChange={(e) =>
                  update(
                    "confidentialityTermYears",
                    Math.max(1, Number(e.target.value) || 1),
                  )
                }
              />
            </Field>
          ) : (
            <div />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Governing law
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Governing Law (State)">
            <input
              className={inputClass}
              type="text"
              value={values.governingLaw}
              onChange={(e) => update("governingLaw", e.target.value)}
              placeholder="Delaware"
            />
          </Field>

          <Field
            label="Jurisdiction"
            hint="e.g. 'courts located in New Castle, Delaware'."
          >
            <input
              className={inputClass}
              type="text"
              value={values.jurisdiction}
              onChange={(e) => update("jurisdiction", e.target.value)}
              placeholder="courts located in Wilmington, Delaware"
            />
          </Field>
        </div>

        <Field
          label="MNDA Modifications"
          hint="Optional. Listed verbatim on the Cover Page and added to the Standard Terms as a 'Modifications' block."
        >
          <textarea
            className={`${inputClass} min-h-20`}
            value={values.modifications}
            onChange={(e) => update("modifications", e.target.value)}
            placeholder="Leave blank to use the Standard Terms as-is."
          />
        </Field>
      </section>

      <PartyBlock
        title="Party 1"
        party={values.party1}
        onChange={(next) => update("party1", next)}
      />

      <PartyBlock
        title="Party 2"
        party={values.party2}
        onChange={(next) => update("party2", next)}
      />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Reset form
        </button>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Your inputs are saved to this browser only.
        </p>
      </div>
    </form>
  );
}