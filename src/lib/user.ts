import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

// Check if Clerk is properly configured
const isClerkConfigured = () => {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return key && (key.startsWith('pk_live_') || key.startsWith('pk_test_')) && key.length > 20;
};

// Default user ID for single-user mode
const DEFAULT_USER_ID = 'single-user-default';

/**
 * Get the current authenticated user's ID
 * Returns Clerk userId if configured, otherwise returns default single-user ID
 */
export async function getCurrentUserId(): Promise<string | null> {
  if (isClerkConfigured()) {
    const { auth } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    return userId;
  }
  // Single-user mode
  return DEFAULT_USER_ID;
}

/**
 * Get or create a user record in the database
 * Uses Clerk user data if configured, otherwise creates a default single user
 */
export async function getOrCreateUser() {
  if (isClerkConfigured()) {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    const { userId } = await auth();

    if (!userId) {
      throw new Error('Not authenticated');
    }

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // If not, create from Clerk data
    if (!user) {
      const clerkUser = await currentUser();

      user = await prisma.user.create({
        data: {
          id: userId,
          email: clerkUser?.primaryEmailAddress?.emailAddress || null,
          displayName: clerkUser?.firstName
            ? `${clerkUser.firstName}${clerkUser.lastName ? ` ${clerkUser.lastName}` : ''}`
            : null,
          isOnboarded: false,
          settings: {},
        },
      });
    }

    return user;
  }

  // Single-user mode
  let user = await prisma.user.findUnique({
    where: { id: DEFAULT_USER_ID },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: DEFAULT_USER_ID,
        displayName: 'Default User',
        isOnboarded: false,
        settings: {},
      },
    });
  }

  return user;
}

/**
 * Get user by ID (for API routes where we already have the userId)
 */
export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

/**
 * Mark user as onboarded
 */
export async function markUserOnboarded(userId: string, consentVersion: string = '1.0') {
  return prisma.user.update({
    where: { id: userId },
    data: {
      isOnboarded: true,
      onboardedAt: new Date(),
      consentedAt: new Date(),
      consentVersion,
    },
  });
}

/**
 * Update user settings
 */
export async function updateUserSettings(userId: string, settings: Record<string, unknown>) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { settings: true },
  });

  const currentSettings = (user?.settings as Record<string, unknown>) || {};
  const mergedSettings = { ...currentSettings, ...settings };

  return prisma.user.update({
    where: { id: userId },
    data: {
      settings: mergedSettings as Prisma.InputJsonValue,
    },
  });
}
