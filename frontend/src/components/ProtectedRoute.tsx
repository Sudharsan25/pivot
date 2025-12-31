import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const stateToken = useAppSelector((state) => state.auth.token);
  const token = stateToken ?? localStorage.getItem('token');

  // Debug: log token source
  // eslint-disable-next-line no-console
  console.log(
    '[ProtectedRoute] stateToken:',
    stateToken,
    'localStorage token:',
    localStorage.getItem('token')
  );

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
