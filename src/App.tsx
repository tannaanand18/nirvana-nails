// src/App.tsx
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminAppointments from "./pages/AdminAppointments";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { auth } from "./firebase";
import { checkAdmin } from "./utils/checkAdmin";

/** RequireAdmin component */
const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const [status, setStatus] = useState<"loading" | "ok" | "no">("loading");

  useEffect(() => {
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

  if (status === "loading") return <div>Checking access…</div>;
  if (status === "no") return <Navigate to="/" replace />;
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/services" element={<Services />} />
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
