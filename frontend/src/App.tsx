import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import HomePage from '@/pages/HomePage';
import StatsPage from '@/pages/StatsPage';
import InfoPage from '@/pages/InfoPage';
import DashboardLayout from '@/layouts/DashboardLayout';

function App() {
  const stateToken = useAppSelector((state) => state.auth.token);
  const token = stateToken ?? localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={
            token ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          }
        />

        {/* Protected dashboard layout with nested routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomePage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="info" element={<InfoPage />} />
        </Route>

        {/* Default redirect */}
        <Route
          path="/"
          element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
        />

        {/* Catch all - redirect to dashboard or login */}
        <Route
          path="*"
          element={<Navigate to={token ? '/dashboard' : '/login'} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
