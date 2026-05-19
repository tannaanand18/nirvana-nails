import { Navigate, Route, Routes, BrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import Dashboard from "./pages/Dashboard";
import { FirebaseDisabledBanner } from "./components/FirebaseDisabledBanner";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { isFirebaseConfigured } from "./firebase";

function RequireAdmin({ children }: { children: JSX.Element }) {
  const { user, loading, isAdmin } = useAuth();

  if (!isFirebaseConfigured) return <Navigate to="/" replace />;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user || !isAdmin) return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  return children;
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

const AppRoutes = () => (
  <BrowserRouter>
    <FirebaseDisabledBanner />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/appointment" element={<Appointment />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />

      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />
      <Route path="/admin/appointments" element={<Navigate to="/admin" replace />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
