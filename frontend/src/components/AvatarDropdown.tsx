import { useNavigate } from 'react-router-dom';
import { User, MessageSquare, LogOut, LogIn } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AvatarDropdownProps {
  onFeedbackClick?: () => void;
  className?: string;
}

export function AvatarDropdown({
  onFeedbackClick,
  className,
}: AvatarDropdownProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token, user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/dashboard/profile');
  };

  const handleLoginClick = () => {
    navigate('/login');
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

  // Authenticated user dropdown
  if (token) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'w-10 h-10 rounded-full cursor-pointer',
              'border-2 border-celadon-500',
              'hover:ring-2 hover:ring-celadon-400 hover:ring-offset-2',
              'focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:ring-offset-2',
              'transition-all duration-200',
              'data-[state=open]:ring-2 data-[state=open]:ring-celadon-600',
              className
            )}
            aria-label="User menu"
            aria-haspopup="true"
          >
            <Avatar className="w-full h-full">
              {user?.profilePicture && (
                <AvatarImage
                  src={user.profilePicture}
                  alt={user.name || user.email}
                />
              )}
              <AvatarFallback className="bg-celadon-100 text-celadon-700 font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className={cn(
            'w-64 p-2 rounded-xl shadow-xl',
            'bg-white/95 backdrop-blur-sm',
            'border border-celadon-100'
          )}
          role="menu"
        >
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-2 mb-1">
            <Avatar className="w-12 h-12 border-2 border-celadon-200">
              {user?.profilePicture && (
                <AvatarImage
                  src={user.profilePicture}
                  alt={user.name || user.email}
                />
              )}
              <AvatarFallback className="bg-celadon-100 text-celadon-700 font-semibold text-lg">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 items-center mt-4 min-w-0">
              <p className="font-semibold text-muted-teal-900 truncate">
                {user?.name || 'Set your name'}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator className="bg-celadon-100" />

          {/* Menu Items */}
          <DropdownMenuItem
            onClick={handleProfileClick}
            className={cn(
              'flex items-center gap-3 min-h-[40px] cursor-pointer',
              'hover:bg-celadon-50 focus:bg-celadon-50',
              'focus:ring-2 focus:ring-celadon-500 focus:ring-inset',
              'rounded-lg px-2'
            )}
            role="menuitem"
          >
            <User className="h-4 w-4 text-muted-teal-600" />
            <span className="text-muted-teal-800">Profile</span>
          </DropdownMenuItem>

          {onFeedbackClick && (
            <DropdownMenuItem
              onClick={onFeedbackClick}
              className={cn(
                'flex items-center gap-3 min-h-[40px] cursor-pointer',
                'hover:bg-celadon-50 focus:bg-celadon-50',
                'focus:ring-2 focus:ring-celadon-500 focus:ring-inset',
                'rounded-lg px-2'
              )}
              role="menuitem"
            >
              <MessageSquare className="h-4 w-4 text-muted-teal-600" />
              <span className="text-muted-teal-800">Feedback</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator className="bg-celadon-100" />

          <DropdownMenuItem
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 min-h-[40px] cursor-pointer',
              'hover:bg-celadon-50 focus:bg-celadon-50',
              'focus:ring-2 focus:ring-celadon-500 focus:ring-inset',
              'rounded-lg px-2'
            )}
            role="menuitem"
          >
            <LogOut className="h-4 w-4 text-muted-teal-600" />
            <span className="text-muted-teal-800">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Unauthenticated user dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'w-10 h-10 rounded-full cursor-pointer',
            'bg-lime-cream-100 border-2 border-muted-teal-200',
            'hover:ring-2 hover:ring-celadon-400 hover:ring-offset-2',
            'focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:ring-offset-2',
            'transition-all duration-200 flex items-center justify-center',
            'data-[state=open]:ring-2 data-[state=open]:ring-celadon-600',
            className
          )}
          aria-label="User menu"
          aria-haspopup="true"
        >
          <User className="h-5 w-5 text-muted-teal-600" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn(
          'w-64 p-2 rounded-xl shadow-xl',
          'bg-white/95 backdrop-blur-sm',
          'border border-celadon-100'
        )}
        role="menu"
      >
        <DropdownMenuItem
          onClick={handleLoginClick}
          className={cn(
            'flex items-center gap-3 min-h-[40px] cursor-pointer',
            'hover:bg-celadon-50 focus:bg-celadon-50',
            'focus:ring-2 focus:ring-celadon-500 focus:ring-inset',
            'rounded-lg px-2'
          )}
          role="menuitem"
        >
          <LogIn className="h-4 w-4 text-muted-teal-600" />
          <span className="text-muted-teal-800">Login</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
