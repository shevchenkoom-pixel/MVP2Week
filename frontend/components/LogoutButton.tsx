"use client";

import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/store";
import { clearCredentials } from "@/lib/store/authSlice";

export default function LogoutButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  function handleLogout() {
    dispatch(clearCredentials());
    document.cookie = "mvp2week_token=; path=/; max-age=0; samesite=lax";
    router.push("/login");
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      Log out
    </button>
  );
}