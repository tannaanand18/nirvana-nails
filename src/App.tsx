// src/App.tsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminAppointments from "./pages/AdminAppointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Appointment from "./pages/Appointment";
import Dashboard from "./pages/Dashboard";
import { auth, isFirebaseConfigured } from "./firebase";
import { checkAdmin } from "./utils/checkAdmin";
import { FirebaseDisabledBanner } from "./components/FirebaseDisabledBanner";

/** RequireAdmin component */
const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const [status, setStatus] = useState<"loading" | "ok" | "no">("loading");

  useEffect(() => {
    if (!auth) {
      setStatus("no");
      return;
    }
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setStatus("no");
        return;
      }
      const isAdmin = await checkAdmin(user.uid);
      setStatus(isAdmin ? "ok" : "no");
    });
    return () => unsub();
  }, []);

  if (!isFirebaseConfigured) {
    return <Navigate to="/" replace />;
  }

  if (status === "loading") return <div>Checking access…</div>;
  if (status === "no") return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <FirebaseDisabledBanner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <RequireAdmin>
              <AdminAppointments />
            </RequireAdmin>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
