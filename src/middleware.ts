import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return key && (key.startsWith('pk_live_') || key.startsWith('pk_test_')) && key.length > 20;
};

// Routes that require authentication (when Clerk is enabled)
const isProtectedRoute = createRouteMatcher([
  '/dashboard',
  '/check-in',
  '/data-entry',
  '/settings',
  '/onboarding',
]);

// Routes that should be accessible without auth (public)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/health',
  '/community-organizations',
  '/donate',
  '/employers',
  '/housing-providers',
  '/sponsorship',
  '/treatment-centers',
]);

// Fallback middleware for when Clerk is not configured (single-user mode)
function singleUserMiddleware(request: NextRequest) {
  const isOnboarded = request.cookies.get('character-insights-onboarded');
  const isOnboardingPage = request.nextUrl.pathname === '/onboarding';
  const isApiRoute = request.nextUrl.pathname.startsWith('/api');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/sign-');

  // Skip middleware for API routes, auth routes, and public content routes
  if (isApiRoute || isAuthRoute || isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Redirect to onboarding if not onboarded
  if (!isOnboarded && !isOnboardingPage) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }

  // Redirect away from onboarding if already onboarded
  if (isOnboarded && isOnboardingPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Clerk-enabled middleware
const clerkEnabledMiddleware = clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Allow public routes
  if (isPublicRoute(request)) {
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (isProtectedRoute(request) && !userId) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect_url', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Check onboarding status for authenticated users
  if (userId) {
    const isOnboarded = request.cookies.get('character-insights-onboarded');
    const isOnboardingPage = request.nextUrl.pathname === '/onboarding';
    const isApiRoute = request.nextUrl.pathname.startsWith('/api');

    // Skip onboarding check for API routes
    if (isApiRoute) {
      return NextResponse.next();
    }

    // Redirect to onboarding if not onboarded
    if (!isOnboarded && !isOnboardingPage) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }

    // Redirect away from onboarding if already onboarded
    if (isOnboarded && isOnboardingPage) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
});

// Export the appropriate middleware based on Clerk configuration
export default function middleware(request: NextRequest, event: NextFetchEvent) {
  if (isClerkConfigured()) {
    return clerkEnabledMiddleware(request, event);
  }
  return singleUserMiddleware(request);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
