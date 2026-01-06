import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, Pencil, X, Check } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserProfile } from '@/store/authSlice';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Validation schema
const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, loading } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  // Reset form when user changes or editing is cancelled
  useEffect(() => {
    reset({ name: user?.name || '' });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await dispatch(updateUserProfile({ name: data.name })).unwrap();
      toast({
        title: 'Profile updated successfully!',
        description: 'Your changes have been saved.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        description:
          error instanceof Error ? error.message : 'Please try again.',
        variant: 'destructive',
      });
      // Revert to original value
      reset({ name: user?.name || '' });
    }
  };

  const handleCancel = () => {
    reset({ name: user?.name || '' });
    setIsEditing(false);
  };

  // Get user initials for avatar fallback
  const getInitials = (): string => {
    if (user?.name) {
      return user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-celadon-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lime-cream-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white shadow-lg rounded-2xl p-8">
          {/* Profile Header - Non-editable */}
          <div className="text-center space-y-4 mb-8">
            <Avatar className="w-24 h-24 mx-auto border-4 border-celadon-200">
              {user.profilePicture && (
                <AvatarImage
                  src={user.profilePicture}
                  alt={user.name || user.email}
                />
              )}
              <AvatarFallback className="bg-celadon-100 text-celadon-700 font-semibold text-2xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <p className="text-muted-teal-600">{user.email}</p>

            <span
              className={cn(
                'inline-block px-3 py-1 rounded-full text-sm font-medium',
                user.authProvider === 'google'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-celadon-100 text-celadon-700'
              )}
            >
              {user.authProvider === 'google'
                ? 'Google Account'
                : 'Email Account'}
            </span>
          </div>

          {/* Editable Name Section */}
          <div className="space-y-6">
            <div className="border-t border-lime-cream-200 pt-6">
              <h2 className="text-xl font-semibold text-muted-teal-900 mb-4">
                Display Name
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <Label htmlFor="name" className="sr-only">
                      Display Name
                    </Label>
                    <Input
                      id="name"
                      {...register('name')}
                      placeholder="Set your name"
                      disabled={!isEditing}
                      className={cn(
                        'h-12 text-base',
                        !isEditing &&
                          'bg-lime-cream-50 border-lime-cream-200 cursor-default',
                        errors.name && 'border-red-500 focus:ring-red-500'
                      )}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-2 text-sm text-red-600"
                        role="alert"
                      >
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {!isEditing ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className={cn(
                        'h-12 px-4',
                        'border-celadon-300 text-celadon-700',
                        'hover:bg-celadon-50 hover:border-celadon-400'
                      )}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        disabled={loading || !isDirty}
                        className={cn(
                          'h-12 px-4',
                          'bg-celadon-600 hover:bg-celadon-700 text-white'
                        )}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="h-12 px-4"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Account Information - Read Only */}
            <div className="border-t border-lime-cream-200 pt-6">
              <h2 className="text-xl font-semibold text-muted-teal-900 mb-4">
                Account Information
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-lime-cream-100">
                  <span className="text-muted-teal-600">Account Type</span>
                  <span className="font-medium text-muted-teal-900">
                    {user.authProvider === 'google' ? 'Google' : 'Local'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-lime-cream-100">
                  <span className="text-muted-teal-600">Email</span>
                  <span className="font-medium text-muted-teal-900">
                    {user.email}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3">
                  <span className="text-muted-teal-600">Member Since</span>
                  <span className="font-medium text-muted-teal-900">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
