/** Stable Firestore document id from email (no Firebase Auth required). */
export function emailToUserId(email: string): string {
  return email.trim().toLowerCase().replace(/[^a-z0-9]/g, "_");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAdminEmail(email: string): boolean {
  const list = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) ?? "";
  const admins = list
    .split(",")
    .map((e) => normalizeEmail(e))
    .filter(Boolean);
  return admins.includes(normalizeEmail(email));
}
