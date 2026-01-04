import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/authSlice';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      // Redirect to login with error message
      navigate(`/login?error=${encodeURIComponent(error)}`, { replace: true });
      return;
    }

    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);

      // Dispatch setCredentials action to Redux
      dispatch(setCredentials({ token }));

      // Navigate to dashboard
      navigate('/dashboard/track', { replace: true });
    } else {
      // No token received
      navigate('/login?error=No token received', { replace: true });
    }
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-lime-cream-50">
      <div className="text-center space-y-4">
        <div className="h-12 w-12 border-4 border-celadon-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-lg text-muted-teal-700">Completing sign in...</p>
      </div>
    </div>
  );
}

