import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MainLayout } from "@/layouts/MainLayout";
import { UserLayout } from "@/layouts/UserLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { StaffLayout } from "@/layouts/StaffLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import HomePage from "@/features/home/HomePage";
import AboutPage from "@/features/about/AboutPage";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import OnboardingPage from "@/features/onboarding/OnboardingPage";
import AdoptionPage from "@/features/adoption/AdoptionPage";
import LikesPage from "@/features/likes/LikesPage";
import ReportPage from "@/features/report/ReportPage";
import ClinicsPage from "@/features/clinics/ClinicsPage";
import ProfilePage from "@/features/profile/ProfilePage";

import AdminDashboard from "@/features/admin/AdminDashboard";
import AdminPets from "@/features/admin/AdminPets";
import AdminReports from "@/features/admin/AdminReports";
import AdminClinics from "@/features/admin/AdminClinics";
import AdminUsers from "@/features/admin/AdminUsers";
import AdminStaff from "@/features/admin/AdminStaff";
import AdminAdoptions from "@/features/admin/AdminAdoptions";

import StaffPets from "@/features/staff/StaffPets";
import StaffReports from "@/features/staff/StaffReports";
import StaffAdoptions from "@/features/staff/StaffAdoptions";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with main layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={
              <ProtectedRoute allowedRoles={["user"]}><OnboardingPage /></ProtectedRoute>
            } />
          </Route>

          {/* User routes with sidebar layout */}
          <Route element={<ProtectedRoute allowedRoles={["user"]}><UserLayout /></ProtectedRoute>}>
            <Route path="/app/pets" element={<AdoptionPage />} />
            <Route path="/app/likes" element={<LikesPage />} />
            <Route path="/app/report" element={<ReportPage />} />
            <Route path="/app/clinics" element={<ClinicsPage />} />
            <Route path="/app/profile" element={<ProfilePage />} />
          </Route>

          {/* Legacy redirect */}
          <Route path="/adopt" element={<Navigate to="/app/pets" replace />} />
          <Route path="/clinics" element={<Navigate to="/app/clinics" replace />} />

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/pets" element={<AdminPets />} />
            <Route path="/admin/adoptions" element={<AdminAdoptions />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/clinics" element={<AdminClinics />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/staff" element={<AdminStaff />} />
          </Route>

          {/* Staff routes */}
          <Route element={<ProtectedRoute allowedRoles={["staff", "admin"]}><StaffLayout /></ProtectedRoute>}>
            <Route path="/staff/pets" element={<StaffPets />} />
            <Route path="/staff/reports" element={<StaffReports />} />
            <Route path="/staff/adoptions" element={<StaffAdoptions />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
