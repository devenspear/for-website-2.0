'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { path: '/community-organizations', label: 'Community' },
  { path: '/employers', label: 'Employers' },
  { path: '/housing-providers', label: 'Housing' },
  { path: '/treatment-centers', label: 'Treatment' },
  { path: '/sponsorship', label: 'Sponsorship' },
  { path: '/donate', label: 'Donate' },
];

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom, #fafafa, #f4f4f5)' }}
    >
      {/* Header with navigation */}
      <header
        className="sticky top-0 z-20"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e4e4e7',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with hover animation */}
            <Link
              href="/"
              className="flex items-center transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/logo.jpeg"
                alt="Friends of Recovery"
                width={180}
                height={45}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation with animated underline */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label }) => (
                <Link
                  key={path}
                  href={path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 group ${
                    pathname === path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-neutral-600 hover:text-indigo-600'
                  }`}
                >
                  {label}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-indigo-500 transition-all duration-300 ${
                      pathname === path ? 'w-1/2' : 'w-0 group-hover:w-1/2'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Mobile menu button with rotation animation */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className={`transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`}>
                {mobileMenuOpen ? (
                  <X size={24} color="#18181b" />
                ) : (
                  <Menu size={24} color="#18181b" />
                )}
              </div>
            </button>
          </div>

          {/* Mobile Navigation with slide animation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <nav className="pt-4 pb-2 space-y-1">
              {navLinks.map(({ path, label }, index) => (
                <Link
                  key={path}
                  href={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    pathname === path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-neutral-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                  style={{
                    transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms',
                    transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  }}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              href="/"
              className="transition-all duration-300 hover:scale-105 hover:opacity-80"
            >
              <Image
                src="/logo.jpeg"
                alt="Friends of Recovery"
                width={140}
                height={35}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-xs text-neutral-500">
              Community &bull; Support &bull; Hope
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
