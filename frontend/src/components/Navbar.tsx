/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Target,
  BarChart3,
  LogOut,
  Menu,
  Info,
  MessageSquare,
  LogIn,
  Lock,
} from 'lucide-react';
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

export default function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const token = useAppSelector((state) => state.auth.token);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // Scroll detection with debouncing
  useEffect(() => {
    let ticking = false;
    let rafId: number | null = null;

    const handleScroll = () => {
      if (!ticking) {
        rafId = window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setScrolled(scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check initial scroll position
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
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
    setMobileMenuOpen(false);
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

  // Determine active state based on pathname
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const NavLink = ({
    item,
    isMobile = false,
  }: {
    item: NavItem;
    isMobile?: boolean;
  }) => {
    const isDisabled = item.requiresAuth && !token;
    const active = isActive(item.path);

    return (
      <button
        onClick={() =>
          handleNavigation(item.path, item.requiresAuth, item.label)
        }
        disabled={isDisabled}
        className={cn(
          'flex items-center gap-2 transition-all duration-300 ease-in-out',
          'relative group',
          isMobile
            ? 'min-h-[48px] w-full py-3 px-4 rounded-lg text-left'
            : 'px-3 py-2 rounded-lg',
          active
            ? 'text-celadon-700 font-semibold bg-celadon-100/90 shadow-[0_2px_8px_rgba(96,145,59,0.15)]'
            : isDisabled
              ? 'text-muted-teal-700 opacity-75 cursor-not-allowed'
              : 'text-muted-teal-700 hover:text-celadon-500',
          !isMobile && !active && 'hover:bg-lime-cream-100/50'
        )}
        title={isDisabled ? 'Login required' : undefined}
      >
        <item.icon className={cn(isMobile ? 'h-5 w-5' : 'h-5 w-5')} />
        {isMobile && <span className="text-sm font-medium">{item.label}</span>}
        {!isMobile && <span className="text-sm font-medium">{item.label}</span>}
        {isDisabled && !isMobile && (
          <Lock className="h-4 w-4 ml-1 opacity-60" />
        )}
        {isDisabled && isMobile && (
          <Lock className="h-4 w-4 ml-auto opacity-60" />
        )}
      </button>
    );
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out',
          scrolled
            ? 'w-[95%] mx-auto mt-4 rounded-full px-6 py-3'
            : 'w-full px-8 py-4',
          scrolled
            ? 'bg-white/70 border border-white/18 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]'
            : 'bg-transparent'
        )}
        style={
          scrolled
            ? {
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }
            : undefined
        }
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Left: Mobile Hamburger Menu + Desktop Logo */}
          <div className="flex items-center">
            {/* Mobile: Hamburger Menu */}
            {!mobileMenuOpen && (
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden flex items-center justify-center w-11 h-11 rounded-lg text-muted-teal-700 hover:bg-lime-cream-100/50 transition-colors focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:ring-offset-2"
                aria-label="Open menu"
                aria-expanded={false}
              >
                <Menu className="h-6 w-6" />
              </button>
            )}

            {/* Desktop: Logo */}
            <motion.div
              className="hidden md:flex items-center"
              animate={{
                scale: scrolled ? 0.95 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="text-xl font-extrabold tracking-wide text-celadon-600 hover:text-celadon-700 transition-colors focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:ring-offset-2 rounded-lg px-2 py-1"
              >
                PIVOT
              </button>
            </motion.div>
          </div>

          {/* Center/Right: Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-2 md:gap-3 lg:gap-4">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </div>

          {/* Right: Actions - Desktop */}
          <div className="hidden md:flex items-center gap-2 md:gap-2 lg:gap-3">
            {token && (
              <button
                onClick={() => setFeedbackOpen(true)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                  'text-muted-teal-700 hover:text-celadon-500 hover:bg-lime-cream-100/50',
                  'focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:ring-offset-2',
                  'min-h-[44px]'
                )}
                aria-label="Feedback"
              >
                {scrolled ? (
                  <MessageSquare className="h-6 w-6" />
                ) : (
                  <>
                    <MessageSquare className="h-5 w-5" />
                    <span className="text-sm font-medium">Feedback</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={
                token
                  ? handleLogout
                  : () => handleNavigation('/login', false, 'Login')
              }
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                'text-muted-teal-700 hover:text-celadon-500 hover:bg-lime-cream-100/50',
                'focus:outline-none focus:ring-2 focus:ring-celadon-500 focus:ring-offset-2',
                'min-h-[44px]'
              )}
              aria-label={token ? 'Logout' : 'Login'}
            >
              {scrolled ? (
                token ? (
                  <LogOut className="h-6 w-6" />
                ) : (
                  <LogIn className="h-6 w-6" />
                )
              ) : (
                <>
                  {token ? (
                    <>
                      <LogOut className="h-5 w-5" />
                      <span className="text-sm font-medium">Logout</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="h-5 w-5" />
                      <span className="text-sm font-medium">Login</span>
                    </>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] max-w-[85vw] bg-white shadow-xl z-40 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-lime-cream-200">
                  <h1 className="text-xl font-extrabold tracking-wide text-celadon-600">
                    PIVOT
                  </h1>
                </div>

                {/* Navigation Items */}
                <nav className="flex flex-col space-y-1 flex-1">
                  {navItems.map((item) => (
                    <NavLink key={item.path} item={item} isMobile />
                  ))}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-auto space-y-1 pt-4 border-t border-lime-cream-200">
                  {token && (
                    <button
                      onClick={() => {
                        setFeedbackOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out rounded-lg text-muted-teal-700 hover:bg-lime-cream-100"
                    >
                      <MessageSquare className="h-5 w-5" />
                      <span className="text-sm font-medium">Feedback</span>
                    </button>
                  )}
                  <button
                    onClick={
                      token
                        ? handleLogout
                        : () => handleNavigation('/login', false, 'Login')
                    }
                    className="flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out rounded-lg text-muted-teal-700 hover:bg-lime-cream-100"
                  >
                    {token ? (
                      <>
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm font-medium">Logout</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="h-5 w-5" />
                        <span className="text-sm font-medium">Login</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Feedback Form */}
      <FeedbackForm open={feedbackOpen} onOpenChange={setFeedbackOpen} />
    </>
  );
}
