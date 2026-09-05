'use client';

import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <SessionProvider>{children}</SessionProvider>;
  }

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-bg">
        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        {/* Main Content */}
        <main className="min-w-0 flex-1 lg:ml-[260px] transition-all duration-300 overflow-visible">
          {/* Header */}
          <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
          
          {/* Page Content */}
          <div className="mx-auto max-w-[1400px] overflow-visible p-4 sm:p-6">
            {children}
          </div>
        </main>
      </div>
    </SessionProvider>
  );
}

