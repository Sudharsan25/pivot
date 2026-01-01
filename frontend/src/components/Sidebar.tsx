/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Target,
  BarChart3,
  LogOut,
  Menu,
  LogIn,
  Lock,
  Info,
  MessageSquare,
} from 'lucide-react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { FeedbackForm } from '@/components/FeedbackForm';

import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { useToast } from '@/hooks/use-toast';

interface NavItem {
  label: string;
  icon: any;
  path: string;
  requiresAuth: boolean;
}

interface BottomItem {
  label: string;
  icon: any;
  path?: string;
  action?: () => void;
  requiresAuth: boolean;
}

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const token = useAppSelector((state) => state.auth.token);
  const [feedbackOpen, setFeedbackOpen] = React.useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const handleNavigation = (
    path: string,
    requiresAuth: boolean,
    label: string
  ) => {
    if (requiresAuth && !token) {
      const messages: Record<string, string> = {
        Track: 'Please log in to start tracking your urges',
        Dashboard: 'Please log in to view your dashboard',
      };

      toast({
        title: 'Login Required',
        description: messages[label] || 'Please log in to access this feature',
      });
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  const navItems: NavItem[] = [
    {
      label: 'Home',
      icon: Home,
      path: '/',
      requiresAuth: false,
    },
    {
      label: 'Track',
      icon: Target,
      path: '/dashboard/track',
      requiresAuth: true,
    },
    {
      label: 'Dashboard',
      icon: BarChart3,
      path: '/dashboard/stats',
      requiresAuth: true,
    },
    {
      label: 'About',
      icon: Info,
      path: '/dashboard/info',
      requiresAuth: false,
    },
  ];

  const feedbackItem: BottomItem | null = token
    ? {
        label: 'Feedback',
        icon: MessageSquare,
        action: () => setFeedbackOpen(true),
        requiresAuth: true,
      }
    : null;

  const bottomItem: BottomItem = token
    ? {
        label: 'Logout',
        icon: LogOut,
        action: handleLogout,
        requiresAuth: false,
      }
    : { label: 'Login', icon: LogIn, path: '/login', requiresAuth: false };

  // Determine active state based on pathname
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const NavButton = ({
    item,
    isActive: active,
  }: {
    item: NavItem;
    isActive: boolean;
  }) => {
    const isDisabled = item.requiresAuth && !token;

    return (
      <button
        onClick={() =>
          handleNavigation(item.path, item.requiresAuth, item.label)
        }
        disabled={isDisabled}
        className={cn(
          'flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out',
          'rounded-lg text-left',
          active
            ? 'bg-celadon-100 text-celadon-700 border-l-[3px] border-celadon-700'
            : isDisabled
              ? 'text-muted-teal-700 opacity-75 cursor-not-allowed'
              : 'text-muted-teal-700 hover:bg-lime-cream-100',
          'relative group'
        )}
        title={isDisabled ? 'Login required' : undefined}
      >
        <item.icon className="h-5 w-5" />
        <span className="text-sm font-medium">{item.label}</span>
        {isDisabled && <Lock className="h-4 w-4 ml-auto opacity-60" />}
      </button>
    );
  };

  const SidebarContent = (
    <div className="flex h-full flex-col p-4">
      <div className="mb-6 px-2">
        <h1 className="text-xl font-extrabold tracking-wide text-celadon-600">
          PIVOT
        </h1>
      </div>

      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <NavButton
            key={item.path}
            item={item}
            isActive={isActive(item.path)}
          />
        ))}
      </nav>

      <div className="mt-auto space-y-1">
        {feedbackItem && (
          <button
            onClick={feedbackItem.action}
            className={cn(
              'flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out',
              'rounded-lg text-muted-teal-700 hover:bg-lime-cream-100'
            )}
          >
            <feedbackItem.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{feedbackItem.label}</span>
          </button>
        )}
        {bottomItem.action ? (
          <button
            onClick={bottomItem.action}
            className={cn(
              'flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out',
              'rounded-lg text-muted-teal-700 hover:bg-lime-cream-100'
            )}
          >
            <bottomItem.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{bottomItem.label}</span>
          </button>
        ) : (
          <button
            onClick={() =>
              handleNavigation(
                bottomItem.path!,
                bottomItem.requiresAuth,
                bottomItem.label
              )
            }
            className={cn(
              'flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out',
              'rounded-lg text-muted-teal-700 hover:bg-lime-cream-100'
            )}
          >
            <bottomItem.icon className="h-5 w-5" />
            <span className="text-sm font-medium">{bottomItem.label}</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: hamburger + sheet/drawer */}
      <div className="md:hidden">
        <Dialog>
          <DialogTrigger asChild>
            <button className="m-3 inline-flex items-center justify-center rounded-md p-2 text-muted-teal-700 hover:bg-lime-cream-100">
              <Menu className="h-6 w-6" />
            </button>
          </DialogTrigger>
          <DialogContent className="fixed left-0 top-0 z-50 h-full w-[280px] max-w-full translate-x-0 translate-y-0 bg-white shadow-md p-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left-0 data-[state=closed]:slide-out-to-left-full [&>button]:hidden">
            {SidebarContent}
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-[280px] md:flex-col md:shadow-md md:bg-white">
        <div className="h-full overflow-y-auto">{SidebarContent}</div>
      </aside>

      <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
