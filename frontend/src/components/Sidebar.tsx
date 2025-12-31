/* eslint-disable @typescript-eslint/no-explicit-any */

import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BarChart3, Info, LogOut, Menu } from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';

import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';

const navItems = [
  { name: 'Home', to: '/dashboard', Icon: Home },
  { name: 'Dashboard', to: '/dashboard/stats', Icon: BarChart3 },
  { name: 'About', to: '/dashboard/info', Icon: Info },
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const NavButton = ({
    to,
    name,
    Icon,
  }: {
    to: string;
    name: string;
    Icon: any;
  }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          'flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out',
          'rounded-lg hover:no-underline',
          isActive
            ? 'bg-celadon-100 text-celadon-700 border-l-4 border-celadon-600'
            : 'text-muted-teal-700 hover:bg-lime-cream-100'
        )
      }
    >
      <Icon className="h-5 w-5" />
      <span className="text-sm font-medium">{name}</span>
    </NavLink>
  );

  const SidebarContent = (
    <div className="flex h-full flex-col p-4">
      <div className="mb-6 px-2">
        <h1 className="text-xl font-semibold text-celadon-600">Urge Tracker</h1>
      </div>

      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <NavButton
            key={item.to}
            to={item.to}
            name={item.name}
            Icon={item.Icon}
          />
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center min-h-[48px] w-full py-3 px-4 gap-3 transition-all duration-150 ease-in-out',
            'rounded-lg text-muted-teal-700 hover:bg-lime-cream-100'
          )}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
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
          <DialogOverlay />
          <DialogContent className="fixed left-0 top-0 z-50 h-full w-[280px] max-w-full bg-white shadow-md p-0 data-[state=open]:animate-in data-[state=closed]:animate-out">
            {SidebarContent}
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-[280px] md:flex-col md:shadow-md md:bg-white">
        <div className="h-full overflow-y-auto">{SidebarContent}</div>
      </aside>
    </>
  );
}
