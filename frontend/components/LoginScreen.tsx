"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch } from "@/lib/store";
import { setCredentials } from "@/lib/store/authSlice";
import { useFakeLoginMutation } from "@/lib/store/api";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [displayName, setDisplayName] = useState("");
  const [fakeLogin, { isLoading, error }] = useFakeLoginMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await fakeLogin(
      displayName.trim().length > 0 ? { display_name: displayName.trim() } : undefined,
    );
    if ("data" in result && result.data) {
      dispatch(setCredentials(result.data));
      document.cookie = `mvp2week_token=${result.data.token}; path=/; max-age=86400; samesite=lax`;
      router.push("/app");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: "#0f172a" }}
        >
          Welcome to MVP2Week
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Compose legal agreements from Common Paper templates. No real
          authentication yet — enter a display name to enter the platform.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              Display name
            </span>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Smith"
              maxLength={80}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 dark:border-zinc-700 dark:bg-zinc-950"
            />
          </label>

          {error ? (
            <p className="text-sm" style={{ color: "#dc2626" }}>
              Could not log in. Is the backend running on port 8000?
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition disabled:opacity-50"
            style={{ backgroundColor: "#0f172a" }}
          >
            {isLoading ? "Entering…" : "Enter Platform"}
          </button>
        </form>
      </div>
    </main>
  );
}