import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import OnboardingWizard from "./features/onboarding/OnboardingWizard";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import BudgetManagementPage from "./pages/BudgetManagementPage";
import ReservationsPage from "./pages/ReservationsPage";
import { ProtectedRoute } from "./features/auth/AuthContext";
import AppLayout from "./components/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout>
                <DashboardPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/budgets"
          element={
            <ProtectedRoute>
              <AppLayout>
                <BudgetManagementPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/reservations"
          element={
            <ProtectedRoute>
              <AppLayout>
                <ReservationsPage />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
