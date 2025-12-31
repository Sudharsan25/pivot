import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';

interface Props {
  children?: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-lime-cream-50">
      <Sidebar />

      <main className="min-h-screen md:ml-[280px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Render either passed children or nested routes via Outlet */}
          {children ?? <Outlet />}
        </div>
      </main>
    </div>
  );
}
