'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import Cart from './Cart';

export default function PublicLayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Don't show public layout components for admin routes
  const isAdminRoute = pathname?.startsWith('/admin');
  
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <Cart />
    </div>
  );
}
