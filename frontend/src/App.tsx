import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchCurrentUser } from '@/store/authSlice';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AuthCallbackPage from '@/pages/AuthCallbackPage';
import TrackPage from '@/pages/TrackPage';
import StatsPage from '@/pages/StatsPage';
import InfoPage from '@/pages/InfoPage';
import ProfilePage from '@/pages/ProfilePage';
import DashboardLayout from '@/layouts/DashboardLayout';

function App() {
  const dispatch = useAppDispatch();
  const stateToken = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const token = stateToken ?? localStorage.getItem('token');

  // Fetch user data on app load if token exists but user is not loaded
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchCurrentUser());
    }
  }, [token, user, dispatch]);

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
          <Route
            path="dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
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
