'use client';

import { signOut, useSession } from 'next-auth/react';
import { Menu, LogOut, Settings } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import AppIcon from './AppIcon';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-border">
      <div className="h-16 px-6 flex items-center justify-between gap-4 overflow-visible">
        <div className="flex flex-1 items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-muted hover:text-text hover:bg-surface2 transition-colors"
            aria-label="Open menu"
          >
            <AppIcon icon={Menu} size="md" />
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-visible">
          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2.5 h-9 pl-2 pr-3 rounded-lg hover:bg-surface2 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary text-[#2A2A1A] flex items-center justify-center text-sm font-semibold">
                {session?.user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-text">
                {session?.user?.name || 'Admin'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-surface rounded-lg border border-border shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-3 border-b border-border bg-bg">
                  <p className="text-sm font-semibold text-text">
                    {session?.user?.name || 'Admin'}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {session?.user?.email || 'Email tidak tersedia'}
                  </p>
                </div>
                
                <div className="py-1">
                  <Link
                    href="/admin/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-text hover:bg-surface2 transition-colors"
                  >
                    <AppIcon icon={Settings} size="sm" className="text-muted" />
                    <span className="leading-none">Pengaturan</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-danger hover:bg-red-50 transition-colors"
                  >
                    <AppIcon icon={LogOut} size="sm" />
                    <span className="leading-none">Keluar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
