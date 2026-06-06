import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppFloat from './WhatsAppFloat';
import Cart from './Cart';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <Cart />
    </div>
  );
}
