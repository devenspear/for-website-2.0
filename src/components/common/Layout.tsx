'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenSquare,
  FileInput,
  Settings,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/check-in', icon: PenSquare, label: 'Check-In' },
  { path: '/data-entry', icon: FileInput, label: 'Data' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #fafafa, #f4f4f5)' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e4e4e7',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.jpeg"
                alt="Friends of Recovery"
                width={160}
                height={40}
                className="h-9 w-auto"
                priority
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-4 py-6 pb-28">{children}</main>

      {/* Bottom navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid #e4e4e7',
        }}
      >
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex justify-around py-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  className="flex flex-col items-center py-2 px-4 rounded-xl transition-all duration-200 min-w-[64px]"
                  style={{
                    backgroundColor: isActive ? '#eef2ff' : 'transparent',
                  }}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 2}
                    color={isActive ? '#4f46e5' : '#71717a'}
                  />
                  <span
                    className="text-xs mt-1 font-medium"
                    style={{ color: isActive ? '#4f46e5' : '#52525b' }}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
        {/* Safe area for mobile */}
        <div
          className="h-safe-area-inset-bottom"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        />
      </nav>
    </div>
  );
};
