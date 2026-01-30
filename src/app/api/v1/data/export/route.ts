import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateUser } from '@/lib/user';
import { auditLog, AuditActions } from '@/lib/audit';
import { ApiResponse } from '@/types';
import { format } from 'date-fns';

interface ExportData {
  exportedAt: string;
  user: {
    id: string;
    displayName: string | null;
    timezone: string;
    isOnboarded: boolean;
    settings: unknown;
  };
  dailyUsage: Array<{
    date: string;
    socialMediaMinutes: number;
    shoppingMinutes: number;
    entertainmentMinutes: number;
    datingAppsMinutes: number;
    productivityMinutes: number;
    newsMinutes: number;
    gamesMinutes: number;
    phonePickups: number;
    lateNightUsageMinutes: number;
    steps: number;
    sleepHours: number;
    wakeTime: string;
    source: string;
    createdAt: string;
  }>;
  dailyCheckIns: Array<{
    date: string;
    moodScore: number;
    primaryTheme: string;
    journalEntry: string | null;
    source: string;
    createdAt: string;
  }>;
  weeklyReports: Array<{
    weekStartDate: string;
    weekEndDate: string;
    scores: unknown;
    highlights: unknown;
    reflectivePrompts: unknown;
    algorithmVersion: string;
    createdAt: string;
  }>;
}

// GET /api/v1/data/export - Export all user data
export async function GET() {
  try {
    // Ensure user exists in our database
    const currentUser = await getOrCreateUser();
    const userId = currentUser.id;

    // Fetch all user data
    const [user, usage, checkIns, reports] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.dailyUsage.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      }),
      prisma.dailyCheckIn.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
      }),
      prisma.weeklyReport.findMany({
        where: { userId },
        orderBy: { weekStartDate: 'desc' },
      }),
    ]);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      }, { status: 404 });
    }

    const exportData: ExportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: user.id,
        displayName: user.displayName,
        timezone: user.timezone,
        isOnboarded: user.isOnboarded,
        settings: user.settings,
      },
      dailyUsage: usage.map(u => ({
        date: format(u.date, 'yyyy-MM-dd'),
        socialMediaMinutes: u.socialMediaMinutes,
        shoppingMinutes: u.shoppingMinutes,
        entertainmentMinutes: u.entertainmentMinutes,
        datingAppsMinutes: u.datingAppsMinutes,
        productivityMinutes: u.productivityMinutes,
        newsMinutes: u.newsMinutes,
        gamesMinutes: u.gamesMinutes,
        phonePickups: u.phonePickups,
        lateNightUsageMinutes: u.lateNightUsageMinutes,
        steps: u.steps,
        sleepHours: u.sleepHours,
        wakeTime: u.wakeTime,
        source: u.source,
        createdAt: u.createdAt.toISOString(),
      })),
      dailyCheckIns: checkIns.map(c => ({
        date: format(c.date, 'yyyy-MM-dd'),
        moodScore: c.moodScore,
        primaryTheme: c.primaryTheme,
        journalEntry: c.journalEntry,
        source: c.source,
        createdAt: c.createdAt.toISOString(),
      })),
      weeklyReports: reports.map(r => ({
        weekStartDate: format(r.weekStartDate, 'yyyy-MM-dd'),
        weekEndDate: format(r.weekEndDate, 'yyyy-MM-dd'),
        scores: r.scores,
        highlights: r.highlights,
        reflectivePrompts: r.reflectivePrompts,
        algorithmVersion: r.algorithmVersion,
        createdAt: r.createdAt.toISOString(),
      })),
    };

    // Audit log
    await auditLog({
      userId,
      action: AuditActions.DATA_EXPORTED,
      resource: 'all_data',
      metadata: {
        usageCount: usage.length,
        checkInCount: checkIns.length,
        reportCount: reports.length,
      },
    });

    return NextResponse.json<ApiResponse<ExportData>>({
      success: true,
      data: exportData,
    });
  } catch (error) {
    console.error('GET /api/v1/data/export error:', error);

    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to export data' },
    }, { status: 500 });
  }
}
