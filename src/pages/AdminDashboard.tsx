import { useEffect, useState } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { Seo } from "@/components/Seo";
import { SALON_NAME } from "@/constants/salon";
import { db } from "@/firebase";
import { COLLECTIONS, resetAndSeedDatabase } from "@/lib/dbSeed";
import type { Appointment, Offer, Treatment } from "@/types/models";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  addDoc,
  orderBy,
  query,
} from "firebase/firestore";
import { Calendar, Sparkles, Tag, Database, Plus, Trash2, Check, X } from "lucide-react";

type Tab = "appointments" | "treatments" | "offers" | "database";

const AdminDashboard = () => {
  const [tab, setTab] = useState<Tab>("appointments");

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Seo title={`Admin – ${SALON_NAME}`} description="Manage salon" path="/admin" noIndex />
      <Navbar />

      <section className="pt-28 sm:pt-32 pb-8 container mx-auto px-4">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-1">Admin dashboard</h1>
        <p className="text-muted-foreground text-sm mb-6">
          Appointments, treatments, offers & database tools
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <TabBtn active={tab === "appointments"} onClick={() => setTab("appointments")} icon={<Calendar className="w-4 h-4" />}>
            Appointments
          </TabBtn>
          <TabBtn active={tab === "treatments"} onClick={() => setTab("treatments")} icon={<Sparkles className="w-4 h-4" />}>
            Treatments
          </TabBtn>
          <TabBtn active={tab === "offers"} onClick={() => setTab("offers")} icon={<Tag className="w-4 h-4" />}>
            Offers
          </TabBtn>
          <TabBtn active={tab === "database"} onClick={() => setTab("database")} icon={<Database className="w-4 h-4" />}>
            Database
          </TabBtn>
        </div>

        {tab === "appointments" && <AppointmentsTab />}
        {tab === "treatments" && <TreatmentsTab />}
        {tab === "offers" && <OffersTab />}
        {tab === "database" && <DatabaseTab />}
      </section>

      <Footer />
    </main>
  );
};

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
        active ? "bg-gold text-background" : "bg-card/60 border border-border/50 hover:border-gold/40"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function AppointmentsTab() {
  const [items, setItems] = useState<Appointment[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, COLLECTIONS.appointments), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) =>
      setItems(
        snap.docs.map((d) => {
          const data = d.data();
          return { id: d.id, ...data } as Appointment;
        })
      )
    );
  }, []);

  const setStatus = async (id: string, status: Appointment["status"]) => {
    if (!db) return;
    await updateDoc(doc(db, COLLECTIONS.appointments, id), { status });
    // If appointment approved, attempt to send a confirmation email to the user
    if (status === "Approved") {
      try {
        const snap = await (await import("firebase/firestore")).getDoc(doc(db, COLLECTIONS.appointments, id));
        if (snap.exists()) {
          const data = snap.data() as Appointment;
          await sendApprovalEmail(data.userName, data.userEmail, data.treatmentName, data.date, data.time);
        }
      } catch (e) {
        // non-fatal: email failure should not block UI
        console.error("Failed to send approval email", e);
      }
    }
  };

  async function sendApprovalEmail(name: string, email: string, service = "", date = "", time = "") {
    const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined) ?? "";
    const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined) ?? "";
    const userId = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined) ?? "";
    if (!serviceId || !templateId || !userId) {
      console.warn("EmailJS not configured; skipping approval email.");
      return;
    }

    const location = "Dwarkadhish Heights, D-101, Rajkot";
    const phone = "9512267420";
    const message = `Hi ${name},\n\nYour appointment for ${service || "your service"} on ${date} at ${time} has been approved.\n\nLocation: ${location}\nPhone: ${phone}\n\nSee you soon!`;

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: userId,
        template_params: {
          to_name: name,
          to_email: email,
          message,
          location,
          phone,
        },
      }),
    });
  }

  const remove = async (id: string) => {
    if (!db || !confirm("Delete this appointment?")) return;
    await deleteDoc(doc(db, COLLECTIONS.appointments, id));
  };

  if (!items.length) return <p className="text-muted-foreground">No appointments yet.</p>;

  return (
    <div className="space-y-4">
      {items.map((a) => (
        <div key={a.id} className="rounded-xl border border-border/50 bg-card/40 p-5">
          <div className="flex flex-wrap justify-between gap-2 mb-2">
            <p className="font-semibold text-lg">{a.treatmentName}</p>
            <StatusBadge status={a.status} />
          </div>
          <p className="text-sm text-muted-foreground">
            {a.date} at {a.time}
          </p>
          <p className="text-sm mt-2">
            {a.userName} · {a.userEmail}
          </p>
          {a.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {a.notes}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            {a.status !== "Approved" && (
              <Button size="sm" variant="gold" onClick={() => setStatus(a.id, "Approved")}>
                <Check className="w-4 h-4" /> Approve
              </Button>
            )}
            {a.status !== "Cancelled" && (
              <Button size="sm" variant="glass" onClick={() => setStatus(a.id, "Cancelled")}>
                <X className="w-4 h-4" /> Cancel
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-red-500/50 text-red-400"
              onClick={() => remove(a.id)}
            >
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "Approved"
      ? "text-green-400 bg-green-500/10"
      : status === "Cancelled"
        ? "text-red-400 bg-red-500/10"
        : "text-yellow-400 bg-yellow-500/10";
  return <span className={`text-xs font-medium px-2 py-1 rounded-full ${cls}`}>{status}</span>;
}

function TreatmentsTab() {
  const [items, setItems] = useState<Treatment[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "" });

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, COLLECTIONS.treatments), orderBy("sortOrder", "asc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Treatment)))
    );
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !form.name.trim()) return;
    await addDoc(collection(db, COLLECTIONS.treatments), {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price.trim() || "Contact for pricing",
      duration: form.duration.trim() || undefined,
      active: true,
      sortOrder: items.length + 1,
    });
    setForm({ name: "", description: "", price: "", duration: "" });
  };

  const toggleActive = async (t: Treatment) => {
    if (!db) return;
    await updateDoc(doc(db, COLLECTIONS.treatments, t.id), { active: !t.active });
  };

  const remove = async (id: string) => {
    if (!db || !confirm("Delete this treatment?")) return;
    await deleteDoc(doc(db, COLLECTIONS.treatments, id));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={add} className="rounded-xl border border-border/50 bg-card/40 p-5 space-y-3 h-fit">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4 text-gold" /> Add treatment
        </h2>
        <AdminInput label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
        <AdminInput label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <AdminInput label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="From ₹499" />
        <AdminInput label="Duration" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="60 min" />
        <Button type="submit" variant="gold" className="w-full">
          Save treatment
        </Button>
      </form>

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="rounded-xl border border-border/50 bg-card/30 p-4 flex justify-between gap-3">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-gold">{t.price}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Button size="sm" variant="glass" onClick={() => toggleActive(t)}>
                {t.active ? "Hide" : "Show"}
              </Button>
              <Button size="sm" variant="outline" className="border-red-500/40" onClick={() => remove(t.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OffersTab() {
  const [items, setItems] = useState<Offer[]>([]);
  const [form, setForm] = useState({ title: "", description: "", discountLabel: "" });

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, COLLECTIONS.offers), orderBy("sortOrder", "asc"));
    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Offer)))
    );
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !form.title.trim()) return;
    await addDoc(collection(db, COLLECTIONS.offers), {
      title: form.title.trim(),
      description: form.description.trim(),
      discountLabel: form.discountLabel.trim() || "Offer",
      active: true,
      sortOrder: items.length + 1,
    });
    setForm({ title: "", description: "", discountLabel: "" });
  };

  const toggleActive = async (o: Offer) => {
    if (!db) return;
    await updateDoc(doc(db, COLLECTIONS.offers, o.id), { active: !o.active });
  };

  const remove = async (id: string) => {
    if (!db || !confirm("Delete this offer?")) return;
    await deleteDoc(doc(db, COLLECTIONS.offers, id));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={add} className="rounded-xl border border-border/50 bg-card/40 p-5 space-y-3 h-fit">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus className="w-4 h-4 text-gold" /> Add offer
        </h2>
        <AdminInput label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
        <AdminInput label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
        <AdminInput label="Badge text" value={form.discountLabel} onChange={(v) => setForm({ ...form, discountLabel: v })} placeholder="10% OFF" />
        <Button type="submit" variant="gold" className="w-full">
          Save offer
        </Button>
      </form>

      <div className="space-y-3">
        {items.map((o) => (
          <div key={o.id} className="rounded-xl border border-gold/20 bg-card/30 p-4 flex justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">{o.discountLabel}</span>
              <p className="font-medium mt-2">{o.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{o.description}</p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <Button size="sm" variant="glass" onClick={() => toggleActive(o)}>
                {o.active ? "Hide" : "Show"}
              </Button>
              <Button size="sm" variant="outline" className="border-red-500/40" onClick={() => remove(o.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseTab() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const runReset = async () => {
    if (!db) return;
    const ok = confirm(
      "This will DELETE all users, appointments, treatments, offers, gallery & reviews, then add fresh default treatments and offers.\n\nContinue?"
    );
    if (!ok) return;
    setBusy(true);
    setMsg("");
    try {
      await resetAndSeedDatabase(db);
      setMsg("Database reset complete. Default treatments & offers loaded. Sign in again with your admin email.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Reset failed");
    }
    setBusy(false);
  };

  return (
    <div className="max-w-lg rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
      <h2 className="font-semibold text-amber-200 mb-2">Reset database</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Start fresh: clears salon data and seeds 6 treatments + 3 offers. Add your email to{" "}
        <code className="text-gold">VITE_ADMIN_EMAILS</code> in Vercel for admin access.
      </p>
      <Button variant="gold" onClick={runReset} disabled={busy}>
        {busy ? "Resetting…" : "Reset & seed database"}
      </Button>
      {msg && <p className="text-sm mt-4 text-foreground/90">{msg}</p>}
    </div>
  );
}

function AdminInput({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <input
        className="w-full mt-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  );
}

export default AdminDashboard;
