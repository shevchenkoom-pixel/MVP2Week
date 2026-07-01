"use client";

import { useSyncExternalStore } from "react";
import NdaForm from "@/components/NdaForm";
import NdaDocument from "@/components/NdaDocument";
import { NdaFormValues } from "@/lib/nda-template";
import {
  clearValues,
  getClientSnapshot,
  getServerSnapshot,
  subscribe,
  updateValues,
} from "@/lib/form-store";

export default function Home() {
  // `useSyncExternalStore` is the React-recommended way to read from an
  // external store such as localStorage during SSR + hydration. The server
  // snapshot matches the first client render (both return `DEFAULT_FORM_VALUES`
  // via `getServerSnapshot`/`getClientSnapshot`'s `typeof window` guard), so
  // hydration is consistent; subsequent client renders return the user's
  // stored values.
  const values = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  function handleChange(next: NdaFormValues) {
    updateValues(next);
  }

  function handleReset() {
    clearValues();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Mutual NDA Creator
        </h1>
        <p className="max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Fill out the form on the left to generate a Common Paper Mutual
          Non-Disclosure Agreement on the right. Everything runs in your
          browser &mdash; nothing is uploaded.{" "}
          <a
            href="/app"
            className="font-medium underline-offset-4 hover:underline"
            style={{ color: "#4f46e5" }}
          >
            Back to the platform
          </a>
          .
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="no-print">
          <NdaForm values={values} onChange={handleChange} onReset={handleReset} />
        </div>
        <div className="lg:sticky lg:top-6 lg:self-start">
          <NdaDocument values={values} />
        </div>
      </div>
    </div>
  );
}