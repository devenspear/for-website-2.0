import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateUser } from '@/lib/user';
import { auditLog, AuditActions } from '@/lib/audit';
import { ApiResponse } from '@/types';

interface DeleteResult {
  deletedUsage: number;
  deletedCheckIns: number;
  deletedScores: number;
  deletedReports: number;
}

// DELETE /api/v1/data/delete - Clear all user data
export async function DELETE(request: NextRequest) {
  try {
    // Ensure user exists in our database
    const user = await getOrCreateUser();
    const userId = user.id;

    // Check for confirmation header (safety measure)
    const confirmHeader = request.headers.get('x-confirm-delete');
    if (confirmHeader !== 'true') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'CONFIRMATION_REQUIRED',
          message: 'Add header X-Confirm-Delete: true to confirm data deletion',
        },
      }, { status: 400 });
    }

    // Delete all user data in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Delete in order to respect foreign key constraints
      const deletedReports = await tx.weeklyReport.deleteMany({ where: { userId } });
      const deletedScores = await tx.dailyScore.deleteMany({ where: { userId } });
      const deletedCheckIns = await tx.dailyCheckIn.deleteMany({ where: { userId } });
      const deletedUsage = await tx.dailyUsage.deleteMany({ where: { userId } });

      // Reset user onboarding status (optional - remove if you want to keep user settings)
      await tx.user.update({
        where: { id: userId },
        data: {
          isOnboarded: false,
          onboardedAt: null,
        },
      });

      return {
        deletedUsage: deletedUsage.count,
        deletedCheckIns: deletedCheckIns.count,
        deletedScores: deletedScores.count,
        deletedReports: deletedReports.count,
      };
    });

    // Audit log (important to log this!)
    await auditLog({
      userId,
      action: AuditActions.DATA_DELETED,
      resource: 'all_data',
      metadata: result,
    });

    return NextResponse.json<ApiResponse<DeleteResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('DELETE /api/v1/data/delete error:', error);

    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to delete data' },
    }, { status: 500 });
  }
}
