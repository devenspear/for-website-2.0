'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/common/Card';
import {
  ChevronRight,
  Building2,
  Heart,
  Briefcase,
  Home,
  Handshake,
  Stethoscope,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface PreviewCard {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

const previewCards: PreviewCard[] = [
  {
    title: 'Community Organizations',
    description:
      'Learn how community partners participate in the Recovery Support Ecosystem with structured, non-clinical environments.',
    href: '/community-organizations',
    icon: Building2,
    color: '#4f46e5',
    bgColor: '#eef2ff',
  },
  {
    title: 'Donate',
    description:
      'Support recovery through responsible, non-clinical technology that promotes self-awareness and accountability.',
    href: '/donate',
    icon: Heart,
    color: '#db2777',
    bgColor: '#fce7f3',
  },
  {
    title: 'Employers',
    description:
      'A structured, defensible approach to workforce participation for individuals in recovery.',
    href: '/employers',
    icon: Briefcase,
    color: '#d97706',
    bgColor: '#fef3c7',
  },
  {
    title: 'Housing Providers',
    description:
      'A structured, non-discriminatory support framework aligned with fair housing standards.',
    href: '/housing-providers',
    icon: Home,
    color: '#059669',
    bgColor: '#d1fae5',
  },
  {
    title: 'Sponsorship',
    description:
      'Partner with us through clinically grounded transparency and objective accountability initiatives.',
    href: '/sponsorship',
    icon: Handshake,
    color: '#7c3aed',
    bgColor: '#ede9fe',
  },
  {
    title: 'Treatment Centers',
    description:
      'A recovery support ecosystem aligned with clinical care for post-aftercare continuity.',
    href: '/treatment-centers',
    icon: Stethoscope,
    color: '#0891b2',
    bgColor: '#cffafe',
  },
];

export const PreviewCards: React.FC = () => {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">How We Support Recovery</h2>
          <p className="text-neutral-600">Explore our partnerships and initiatives</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewCards.map((card) => (
            <Link key={card.href} href={card.href} className="block group">
              <Card hoverable className="h-full overflow-hidden">
                <CardContent className="p-6 relative">
                  {/* Animated background gradient on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, ${card.bgColor}40, transparent)`,
                    }}
                  />

                  <div className="flex items-start gap-4 relative z-10">
                    {/* Icon with bounce and glow animation */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                      style={{
                        backgroundColor: card.bgColor,
                        boxShadow: `0 0 0 0 ${card.color}40`,
                      }}
                    >
                      <card.icon
                        size={24}
                        style={{ color: card.color }}
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Title with color transition */}
                      <h3 className="font-semibold text-neutral-900 transition-colors duration-300 group-hover:text-indigo-600 flex items-center gap-1">
                        {card.title}
                        {/* Arrow with slide animation */}
                        <ChevronRight
                          size={16}
                          className="text-neutral-400 transition-all duration-300 group-hover:text-indigo-500 group-hover:translate-x-1"
                        />
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1 line-clamp-3 transition-colors duration-300 group-hover:text-neutral-700">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom border animation */}
                  <div
                    className="absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out"
                    style={{ backgroundColor: card.color }}
                  />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
