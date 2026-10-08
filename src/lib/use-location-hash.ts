import { useSyncExternalStore } from "react";

const subscribe = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};

const getSnapshot = () => window.location.hash;

// Static export prerenders without a URL, so the server snapshot is empty;
// the real fragment is picked up right after hydration, without a mismatch.
const getServerSnapshot = () => "";

/** The current URL fragment ("#…" or ""), updated on hashchange. Client components only. */
export const useLocationHash = (): string =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
