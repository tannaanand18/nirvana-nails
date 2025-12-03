import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Login from "./pages/Login";        
import Register from "./pages/Register";  
import Appointment from "./pages/Appointment";
import Dashboard from "./pages/Dashboard";
import AdminAppointments from "./pages/AdminAppointments";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />

      <BrowserRouter>
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Index />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/services" element={<Services />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />        
          <Route path="/register" element={<Register />} />   

          {/* Admin Panel */}
          <Route path="/admin" element={<Admin />} />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/appointments" element={<AdminAppointments />} />

        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
