'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  Scissors, 
  ShoppingBag, 
  Newspaper, 
  BarChart3, 
  Settings, 
  X, 
  Calendar, 
  Hotel,
  PawPrint,
  ChevronLeft,
  FileBarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import AppIcon from './AppIcon';
import IconBadge from './IconBadge';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { icon: Package, label: 'Produk', path: '/admin/products' },
    { icon: Scissors, label: 'Layanan', path: '/admin/services' },
    { icon: ShoppingBag, label: 'Pesanan', path: '/admin/orders' },
    { icon: Hotel, label: 'Penitipan', path: '/admin/penitipan' },
    { icon: Calendar, label: 'Booking', path: '/admin/bookings' },
    { icon: Newspaper, label: 'Blog', path: '/admin/blog' },
    { icon: FileBarChart2, label: 'Laporan', path: '/admin/laporan' },
    { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Overlay untuk mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          'bg-surface border-r border-border min-h-screen fixed left-0 top-0 z-50 transition-all duration-300',
          collapsed ? 'w-20' : 'w-[260px]',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header dengan logo dan collapse button */}
        <div className="h-16 px-4 border-b border-border flex items-center justify-between">
          {!collapsed && (
            <Link 
              href="/admin" 
              className="flex items-center gap-2.5 group" 
              onClick={onClose}
            >
              <IconBadge 
                icon={PawPrint} 
                variant="primary" 
                size="sm"
                className="shadow-sm"
              />
              <div className="leading-none">
                <h2 className="text-sm font-bold text-text leading-tight">Cikal Pet Care</h2>
                <p className="text-xs text-muted mt-0.5">Admin Panel</p>
              </div>
            </Link>
          )}
          
          {collapsed && (
            <Link 
              href="/admin" 
              className="flex items-center justify-center w-full"
              onClick={onClose}
            >
              <IconBadge 
                icon={PawPrint} 
                variant="primary" 
                size="sm"
                className="shadow-sm"
              />
            </Link>
          )}
          
          {/* Collapse button - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <AppIcon icon={ChevronLeft} size="sm" className={cn('transition-transform', collapsed && 'rotate-180')} />
          </button>
          
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-surface2 text-muted hover:text-text transition-colors"
            aria-label="Close sidebar"
          >
            <AppIcon icon={X} size="md" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5 overflow-y-auto" style={{ height: 'calc(100vh - 128px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={cn(
                  'relative flex items-center gap-3 px-3 h-11 rounded-lg transition-all duration-200 group',
                  collapsed ? 'justify-center' : '',
                  active
                    ? 'bg-surface2 text-primary font-medium'
                    : 'text-text hover:bg-surface2/50 hover:text-primary'
                )}
                title={collapsed ? item.label : undefined}
              >
                {active && !collapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r" />
                )}
                <AppIcon icon={Icon} size="md" />
                {!collapsed && <span className="text-sm leading-none">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Action */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <Link
            href="/"
            onClick={onClose}
            className={cn(
              'flex items-center gap-3 px-3 h-11 rounded-lg text-muted hover:bg-surface2 hover:text-text transition-all duration-200',
              collapsed ? 'justify-center' : ''
            )}
            title={collapsed ? 'Ke Website' : undefined}
          >
            <AppIcon icon={Home} size="md" />
            {!collapsed && <span className="text-sm leading-none font-medium">Ke Website</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

