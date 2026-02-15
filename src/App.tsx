import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import NLIQPage from "@/pages/NLIQPage";
import RelationshipPage from "@/pages/RelationshipPage";
import TimelinePage from "@/pages/TimelinePage";
import AnomaliesPage from "@/pages/AnomaliesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><NLIQPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/relationships" element={<ProtectedRoute><DashboardLayout><RelationshipPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/timeline" element={<ProtectedRoute><DashboardLayout><TimelinePage /></DashboardLayout></ProtectedRoute>} />
      <Route path="/dashboard/anomalies" element={<ProtectedRoute><DashboardLayout><AnomaliesPage /></DashboardLayout></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
