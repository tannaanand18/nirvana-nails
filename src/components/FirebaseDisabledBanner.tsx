import { isFirebaseConfigured } from "@/firebase";

/** Shown at top of every page when Firebase env is missing (common after first Vercel deploy). */
export function FirebaseDisabledBanner() {
  if (isFirebaseConfigured) return null;

  return (
    <div
      role="alert"
      className="fixed top-0 left-0 right-0 z-[100] min-h-12 sm:min-h-14 flex items-center justify-center border-b border-amber-500/40 bg-amber-950/95 text-amber-100 px-3 py-2 text-center text-[11px] sm:text-xs leading-snug"
    >
      <strong className="font-semibold">Firebase is not configured on this deployment.</strong>{" "}
      Add all <code className="rounded bg-black/30 px-1">VITE_FIREBASE_*</code> variables in Vercel
      → Settings → Environment Variables (use the same values as your local{" "}
      <code className="rounded bg-black/30 px-1">.env</code>), then redeploy.
    </div>
  );
}
