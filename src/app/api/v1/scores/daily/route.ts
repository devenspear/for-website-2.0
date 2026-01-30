import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/user';
import { createScoringEngine } from '@/lib/scoring/ScoringEngine';
import { auditLog, AuditActions } from '@/lib/audit';
import { ApiResponse, ThemeScore } from '@/types';
import { format } from 'date-fns';

// GET /api/v1/scores/daily - Get daily scores
export async function GET(request: NextRequest) {
  try {
    // Ensure user exists in our database
    const user = await getOrCreateUser();
    const userId = user.id;

    const { searchParams } = new URL(request.url);
    let date = searchParams.get('date');

    // Default to today if not specified
    if (!date) {
      date = format(new Date(), 'yyyy-MM-dd');
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Date must be YYYY-MM-DD format' },
      }, { status: 400 });
    }

    const scoringEngine = createScoringEngine(userId);
    const scores = await scoringEngine.calculateDailyScores(date);

    // Audit log
    await auditLog({
      userId,
      action: AuditActions.SCORES_CALCULATED,
      resource: 'daily_scores',
      metadata: { date, algorithmVersion: scoringEngine.getAlgorithmVersion() },
    });

    return NextResponse.json<ApiResponse<ThemeScore[]>>({
      success: true,
      data: scores,
    });
  } catch (error) {
    console.error('GET /api/v1/scores/daily error:', error);

    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to calculate daily scores' },
    }, { status: 500 });
  }
}
