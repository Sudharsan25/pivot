import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, clearError } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      await dispatch(
        login({ email: data.email, password: data.password })
      ).unwrap();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error is handled by Redux state
    }
  };

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
          <div className="absolute top-4 left-8 right-8 p-4 rounded-2xl text-celadon-600">
            <div className="mb-4"></div>
            <p className="text-2xl font-bold tracking-tight text-center text-celadon-600">
              PIVOT
            </p>
            <p className="text-lg font-semibold text-muted text-center">
              Progress that doesn't break
            </p>
            <p className="text-slate-900 leading-relaxed">
              It’s not about how many days you go without failing. It’s about
              how many wins you collect despite failures. Progress isn’t
              continuous — it’s <strong>cumulative.</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-muted-teal-50">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-celadon-600">
              Welcome back!
            </h1>
            <p className="text-slate-900">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-12"
                  {...register('email')}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12"
                  {...register('password')}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-celadon-600 hover:bg-slate-800 text-white font-semibold text-base rounded-lg"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="h-12 w-full justify-center gap-2 font-medium"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="h-12 w-full justify-center gap-2 font-medium"
            >
              <Twitter className="w-5 h-5" />
              Continue with Twitter
            </Button>
          </div> */}

          <p className="text-center text-sm text-slate-900">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-celadon-600 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
