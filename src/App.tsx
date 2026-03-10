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
import HRContactsPage from "./pages/modules/HRContactsPage";
import JobLinksPage from "./pages/modules/JobLinksPage";
import InterviewQuestionsPage from "./pages/modules/InterviewQuestionsPage";
import ScenarioQuestionsPage from "./pages/modules/ScenarioQuestionsPage";
import PrepRoadmapPage from "./pages/modules/PrepRoadmapPage";
import MockInterviewPage from "./pages/modules/MockInterviewPage";
import ColdEmailPage from "./pages/modules/ColdEmailPage";
import LinkedInOptimizerPage from "./pages/modules/LinkedInOptimizerPage";
import NaukriOptimizerPage from "./pages/modules/NaukriOptimizerPage";
import ATSResumeScorePage from "./pages/modules/ATSResumeScorePage";

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
          <Route path="/modules/ats-resume-score" element={<AuthGuard><ATSResumeScorePage /></AuthGuard>} />
          <Route path="/modules/hr-contacts" element={<AuthGuard><HRContactsPage /></AuthGuard>} />
          <Route path="/modules/job-links" element={<AuthGuard><JobLinksPage /></AuthGuard>} />
          <Route path="/modules/interview-questions" element={<AuthGuard><InterviewQuestionsPage /></AuthGuard>} />
          <Route path="/modules/scenario-questions" element={<AuthGuard><ScenarioQuestionsPage /></AuthGuard>} />
          <Route path="/modules/prep-roadmap" element={<AuthGuard><PrepRoadmapPage /></AuthGuard>} />
          <Route path="/modules/mock-interview" element={<AuthGuard><MockInterviewPage /></AuthGuard>} />
          <Route path="/modules/cold-email" element={<AuthGuard><ColdEmailPage /></AuthGuard>} />
          <Route path="/modules/linkedin-optimizer" element={<AuthGuard><LinkedInOptimizerPage /></AuthGuard>} />
          <Route path="/modules/naukri-optimizer" element={<AuthGuard><NaukriOptimizerPage /></AuthGuard>} />
          <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
            <Route index element={<AdminDashboard />} />
            <Route path="jobs" element={<AdminJobs />} />
            <Route path="questions" element={<AdminQuestions />} />
            <Route path="hr-contacts" element={<AdminHRContacts />} />
            <Route path="templates" element={<AdminTemplates />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
