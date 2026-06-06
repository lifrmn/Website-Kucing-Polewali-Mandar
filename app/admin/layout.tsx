'use client';

import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-slate-50">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="flex-1 w-full lg:ml-[260px] transition-all duration-300 overflow-visible">
          {/* Header */}
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page Content */}
          <div className="p-6 max-w-[1400px] overflow-visible">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}

