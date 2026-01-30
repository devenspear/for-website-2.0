'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PublicLayout } from '@/components/common/PublicLayout';
import { StatisticalData } from '@/components/home/StatisticalData';
import { PreviewCards } from '@/components/home/PreviewCards';
import { ArrowRight, Heart } from 'lucide-react';

export const PublicHomePage: React.FC = () => {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 px-4">
        <div className="mb-6 group">
          <Image
            src="/logo.jpeg"
            alt="Friends of Recovery"
            width={400}
            height={100}
            className="h-24 md:h-32 w-auto mx-auto transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Supporting Long-Term Recovery
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Through Community
          </span>
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto mb-8">
          Structure, accountability, and lasting support for individuals rebuilding their lives
          after treatment.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary button with shine animation */}
          <Link
            href="/community-organizations"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Learn More
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </Link>

          {/* Secondary button with border animation */}
          <Link
            href="/donate"
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-neutral-700 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ border: '2px solid #e5e7eb' }}
          >
            <Heart
              size={18}
              className="text-pink-500 transition-all duration-300 group-hover:scale-110 group-hover:text-pink-600"
            />
            <span>Support Our Mission</span>
            {/* Border color transition overlay */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 0 2px #db2777' }}
            />
          </Link>
        </div>
      </section>

      {/* Statistical Data Section */}
      <StatisticalData />

      {/* Preview Cards */}
      <PreviewCards />

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div
            className="rounded-2xl p-8 md:p-12 relative overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)] bg-[length:20px_20px] transition-transform duration-1000 group-hover:scale-110" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Make a Difference?
              </h2>
              <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
                Join our community of partners, employers, and organizations supporting long-term
                recovery through accountability and transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* White button with lift animation */}
                <Link
                  href="/sponsorship"
                  className="group/btn inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-1"
                >
                  Become a Partner
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </Link>

                {/* Transparent button with fill animation */}
                <Link
                  href="/donate"
                  className="group/btn relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.3)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    <Heart size={18} className="transition-transform duration-300 group-hover/btn:scale-110" />
                    Donate Now
                  </span>
                  {/* Fill animation on hover */}
                  <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
};
