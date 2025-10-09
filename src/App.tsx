import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/contexts/AuthContext";

// Lazy load pages for better performance
const Splash = lazy(() => import("./pages/Splash"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UsersList = lazy(() => import("./pages/UsersList"));
const AddUser = lazy(() => import("./pages/AddUser"));
const ViewUser = lazy(() => import("./pages/ViewUser"));
const EditUser = lazy(() => import("./pages/EditUser"));
const ReportsList = lazy(() => import("./pages/ReportsList"));
const ReportDetail = lazy(() => import("./pages/ReportDetail"));
const EmailTemplates = lazy(() => import("./pages/EmailTemplates"));
const AddTemplate = lazy(() => import("./pages/AddTemplate"));
const EditTemplate = lazy(() => import("./pages/EditTemplate"));
const Profile = lazy(() => import("./pages/Profile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetLinkSent = lazy(() => import("./pages/ResetLinkSent"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <span className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></span>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-link-sent" element={<ResetLinkSent />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/users/:type" element={<ProtectedRoute><UsersList /></ProtectedRoute>} />
            <Route path="/users/:type/add" element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
            <Route path="/users/:type/:id/view" element={<ProtectedRoute><ViewUser /></ProtectedRoute>} />
            <Route path="/users/:type/:id/edit" element={<ProtectedRoute><EditUser /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><ReportsList /></ProtectedRoute>} />
            <Route path="/reports/:id" element={<ProtectedRoute><ReportDetail /></ProtectedRoute>} />
            <Route path="/templates" element={<ProtectedRoute><EmailTemplates /></ProtectedRoute>} />
            <Route path="/templates/add" element={<ProtectedRoute><AddTemplate /></ProtectedRoute>} />
            <Route path="/templates/:id/edit" element={<ProtectedRoute><EditTemplate /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
