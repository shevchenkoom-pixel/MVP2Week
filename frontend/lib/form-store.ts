// A tiny external store for the NDA form values. This is used together with
// `useSyncExternalStore` so the page can read the current value during SSR
// (server snapshot = defaults) and on the client (client snapshot = localStorage),
// without violating the `react-hooks/set-state-in-effect` rule.
//
// `useSyncExternalStore` requires `getClientSnapshot` to return a stable
// reference between calls when the store has not changed. We therefore cache
// the parsed snapshot and invalidate the cache when the store is updated or
// cleared (and also when a `storage` event fires from another tab).

import { DEFAULT_FORM_VALUES, NdaFormValues } from "@/lib/nda-template";

export const STORAGE_KEY = "mvp2week.mnda.formValues.v1";

type Listener = () => void;

const listeners = new Set<Listener>();

let cachedSnapshot: NdaFormValues | null = null;

function readFromStorage(): NdaFormValues {
  if (cachedSnapshot !== null) return cachedSnapshot;
  if (typeof window === "undefined") {
    cachedSnapshot = DEFAULT_FORM_VALUES;
    return cachedSnapshot;
  }
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    cachedSnapshot = DEFAULT_FORM_VALUES;
    return cachedSnapshot;
  }
  if (raw === null) {
    cachedSnapshot = DEFAULT_FORM_VALUES;
    return cachedSnapshot;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<NdaFormValues>;
    cachedSnapshot = {
      ...DEFAULT_FORM_VALUES,
      ...parsed,
      party1: { ...DEFAULT_FORM_VALUES.party1, ...(parsed.party1 ?? {}) },
      party2: { ...DEFAULT_FORM_VALUES.party2, ...(parsed.party2 ?? {}) },
    };
    return cachedSnapshot;
  } catch {
    cachedSnapshot = DEFAULT_FORM_VALUES;
    return cachedSnapshot;
  }
}

function invalidate() {
  cachedSnapshot = null;
}

function notify() {
  invalidate();
  for (const listener of listeners) listener();
}

export function getServerSnapshot(): NdaFormValues {
  return DEFAULT_FORM_VALUES;
}

export function getClientSnapshot(): NdaFormValues {
  return readFromStorage();
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  // Cross-tab updates invalidate the cached snapshot.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      invalidate();
      listener();
    }
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

export function updateValues(next: NdaFormValues): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage unavailable; ignore.
  }
  notify();
}

export function clearValues(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore.
  }
  notify();
}