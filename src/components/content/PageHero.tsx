import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
}

export const PageHero: React.FC<PageHeroProps> = ({ title, subtitle, icon: Icon }) => (
  <div className="text-center py-12 md:py-16">
    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
      style={{
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        boxShadow: '0 4px 16px rgba(79, 70, 229, 0.3)',
      }}
    >
      <Icon size={32} color="#ffffff" />
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">{title}</h1>
    {subtitle && (
      <p className="text-lg text-neutral-600 max-w-2xl mx-auto px-4">{subtitle}</p>
    )}
  </div>
);
