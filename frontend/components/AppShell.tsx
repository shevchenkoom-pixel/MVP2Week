"use client";

import Link from "next/link";

import LogoutButton from "@/components/LogoutButton";
import { useAppSelector } from "@/lib/store";

export default function AppShell() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-2">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "#0f172a" }}
        >
          Welcome, {user?.display_name ?? "there"}.
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          MVP coming soon. Document creation, history, and AI-guided dialogues
          will land in PL-4 and PL-7.
        </p>
      </header>

      <section
        className="rounded-lg border border-dashed p-6"
        style={{ borderColor: "#e4e4e7" }}
      >
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          What you can do right now
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
          <li>
            <Link
              href="/prototype/nda"
              className="font-medium underline-offset-4 hover:underline"
              style={{ color: "#4f46e5" }}
            >
              Open the Mutual NDA prototype
            </Link>{" "}
            (from PL-3).
          </li>
          <li>Log out and back in to verify the round-trip.</li>
        </ul>
      </section>

      <footer className="mt-auto">
        <LogoutButton />
      </footer>
    </main>
  );
}