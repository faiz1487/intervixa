import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import ATSResumeBuilder from "./pages/ATSResumeBuilder";
import NotFound from "./pages/NotFound";
import AuthGuard from "./components/AuthGuard";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminJobs from "./pages/admin/AdminJobs";
import AdminQuestions from "./pages/admin/AdminQuestions";
import AdminHRContacts from "./pages/admin/AdminHRContacts";
import AdminTemplates from "./pages/admin/AdminTemplates";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<AuthGuard><Chat /></AuthGuard>} />
          <Route path="/ats-resume-builder" element={<AuthGuard><ATSResumeBuilder /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
