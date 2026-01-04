import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register, clearError } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { getApiUrl } from '@/lib/api';

// Google Logo SVG Component
const GoogleIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

// Zod validation schema with password confirmation
const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    loading,
    error: reduxError,
    token,
  } = useAppSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const urlError = searchParams.get('error');

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (token) {
      navigate('/dashboard/track', { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await dispatch(
        register({ email: data.email, password: data.password })
      ).unwrap();
      navigate('/', { replace: true });
    } catch (err) {
      // Error is handled by Redux state
    }
  };

  const handleGoogleSignIn = () => {
    const apiUrl = getApiUrl();
    window.location.href = `${apiUrl}/auth/google`;
  };

  // Determine error message (URL error takes precedence)
  const errorMessage =
    urlError === 'google_auth_failed'
      ? 'Authentication failed. Please try again.'
      : reduxError;

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left Column - Image & Quote (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-muted-teal-50 p-4">
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          {/* Background Image */}
          <img
            src="/background-3.jpg"
            alt="Focus and Clarity"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay Gradient for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Glassmorphism Quote Card */}
          <div className="absolute top-4 left-8 right-8 p-4 rounded-2xl ">
            <div className="mb-4"></div>

            <p className="text-slate-700 leading-relaxed">
              It’s not about how many days you go without failing. It’s about
              how many wins you collect despite failures. Progress isn’t
              continuous — it’s <strong>cumulative.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted-teal-50">
        <div className="w-full max-w-[420px] space-y-8">
          <p className="text-center text-lg font-medium tracking-tight text-gray-600">
            <strong className="text-2xl font-extrabold tracking-wide text-center text-celadon-600">
              PIVOT
            </strong>{' '}
            <br />
            Progress that doesn't break
          </p>
          <p className="text-lg font-semibold text-center text-celadon-600">
            {' '}
            Create an account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="h-12"
                {...registerField('email')}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  className="h-12 pr-10"
                  {...registerField('password')}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className="h-12 pr-10"
                  {...registerField('confirmPassword')}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-4 -translate-y-1/2 text-slate-500 hover:text-slate-700 focus:outline-none"
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-celadon-600 hover:bg-slate-800 text-white font-semibold text-base rounded-lg mt-2"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-teal-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-muted-teal-600">
                or
              </span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full min-h-12 flex items-center justify-center gap-3 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </Button>

          <p className="text-center text-sm text-slate-900">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-celadon-600 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
