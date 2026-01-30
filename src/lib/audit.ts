import prisma from '@/lib/db';
import { headers } from 'next/headers';
import { Prisma } from '@prisma/client';

interface AuditLogParams {
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Prisma.InputJsonValue;
}

export async function auditLog({
  userId,
  action,
  resource,
  resourceId,
  metadata,
}: AuditLogParams): Promise<void> {
  try {
    // Get request headers for IP and user agent
    const headersList = await headers();
    const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0] ||
                      headersList.get('x-real-ip') ||
                      'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        metadata: metadata,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    // Log but don't throw - audit logging should not break the main flow
    console.error('Failed to create audit log:', error);
  }
}

// Predefined audit actions
export const AuditActions = {
  // Data operations
  DATA_CREATED: 'data.created',
  DATA_UPDATED: 'data.updated',
  DATA_DELETED: 'data.deleted',
  DATA_EXPORTED: 'data.exported',

  // Score operations
  SCORES_CALCULATED: 'scores.calculated',
  REPORT_GENERATED: 'report.generated',

  // User operations
  USER_CREATED: 'user.created',
  USER_ONBOARDED: 'user.onboarded',
  SETTINGS_CHANGED: 'settings.changed',
  CONSENT_GIVEN: 'consent.given',

  // Sync operations
  SYNC_STARTED: 'sync.started',
  SYNC_COMPLETED: 'sync.completed',
  SYNC_FAILED: 'sync.failed',
} as const;

export type AuditAction = typeof AuditActions[keyof typeof AuditActions];
