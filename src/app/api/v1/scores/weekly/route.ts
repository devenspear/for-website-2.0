import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user';
import { createScoringEngine } from '@/lib/scoring/ScoringEngine';
import { auditLog, AuditActions } from '@/lib/audit';
import { ApiResponse, WeeklyReport } from '@/types';
import { format, startOfWeek } from 'date-fns';

// GET /api/v1/scores/weekly - Get weekly report
export async function GET(request: NextRequest) {
  try {
    // Ensure user exists in our database
    const user = await getOrCreateUser();
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    let weekStart = searchParams.get('weekStart');

    // Default to current week if not specified
    if (!weekStart) {
      weekStart = format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Week start must be YYYY-MM-DD format' },
      }, { status: 400 });
    }

    const scoringEngine = createScoringEngine(userId);
    const report = await scoringEngine.calculateWeeklyReport(weekStart);

    // Audit log
    await auditLog({
      userId,
      action: AuditActions.REPORT_GENERATED,
      resource: 'weekly_report',
      metadata: { weekStart, algorithmVersion: scoringEngine.getAlgorithmVersion() },
    });

    return NextResponse.json<ApiResponse<WeeklyReport>>({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error('GET /api/v1/scores/weekly error:', error);

    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to generate weekly report' },
    }, { status: 500 });
  }
}
