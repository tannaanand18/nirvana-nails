import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { db, isFirebaseConfigured } from "./firebase";
import { seedIfEmpty } from "./lib/dbSeed";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element #root not found");

createRoot(rootEl).render(<App />);

if (isFirebaseConfigured && db) {
  void seedIfEmpty(db).catch((e) => console.warn("Auto-seed skipped:", e));
}
