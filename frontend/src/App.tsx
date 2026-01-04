import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useAppSelector } from '@/store/hooks';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import TrackPage from '@/pages/TrackPage';
import StatsPage from '@/pages/StatsPage';
import InfoPage from '@/pages/InfoPage';
import DashboardLayout from '@/layouts/DashboardLayout';

function App() {
  const stateToken = useAppSelector((state) => state.auth.token);
  const token = stateToken ?? localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        {/* Login and Register routes - no DashboardLayout */}
        <Route
          path="/login"
          element={
            token ? <Navigate to="/dashboard/track" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            token ? (
              <Navigate to="/dashboard/track" replace />
            ) : (
              <RegisterPage />
            )
          }
        />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* All other routes with DashboardLayout */}
        <Route path="/" element={<DashboardLayout />}>
          {/* Public routes */}
          <Route index element={<LandingPage />} />
          <Route path="dashboard/info" element={<InfoPage />} />

          {/* Protected routes */}
          <Route
            path="dashboard/track"
            element={
              <ProtectedRoute>
                <TrackPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard/stats"
            element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
