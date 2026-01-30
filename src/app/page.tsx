'use client';

import React from 'react';
import { PublicHomePage } from '@/components/home/PublicHomePage';

export default function HomePage() {
  // Always show the public landing page at the root
  // Authenticated users can access the dashboard via /dashboard or sign-in redirect
  return <PublicHomePage />;
}
