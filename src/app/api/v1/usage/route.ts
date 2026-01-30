import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { dailyUsageSchema, validateRequest } from '@/lib/validation';
import { getCurrentUserId, getOrCreateUser } from '@/lib/user';
import { auditLog, AuditActions } from '@/lib/audit';
import { ApiResponse, DailyUsageEntry } from '@/types';
import { format } from 'date-fns';

// GET /api/v1/usage - Get usage data
export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Single date query
    if (date) {
      const dateObj = new Date(date);
      const usage = await prisma.dailyUsage.findUnique({
        where: { userId_date: { userId, date: dateObj } },
      });

      if (!usage) {
        return NextResponse.json<ApiResponse<null>>({
          success: true,
          data: null,
        });
      }

      const result: DailyUsageEntry = {
        id: usage.id,
        date: format(usage.date, 'yyyy-MM-dd'),
        socialMediaMinutes: usage.socialMediaMinutes,
        shoppingMinutes: usage.shoppingMinutes,
        entertainmentMinutes: usage.entertainmentMinutes,
        datingAppsMinutes: usage.datingAppsMinutes,
        productivityMinutes: usage.productivityMinutes,
        newsMinutes: usage.newsMinutes,
        gamesMinutes: usage.gamesMinutes,
        phonePickups: usage.phonePickups,
        lateNightUsageMinutes: usage.lateNightUsageMinutes,
        steps: usage.steps,
        sleepHours: usage.sleepHours,
        wakeTime: usage.wakeTime,
        source: usage.source,
        createdAt: usage.createdAt,
      };

      return NextResponse.json<ApiResponse<DailyUsageEntry>>({
        success: true,
        data: result,
      });
    }

    // Date range query
    if (startDate && endDate) {
      const usageRecords = await prisma.dailyUsage.findMany({
        where: {
          userId,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: { date: 'asc' },
      });

      const results: DailyUsageEntry[] = usageRecords.map(u => ({
        id: u.id,
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
        createdAt: u.createdAt,
      }));

      return NextResponse.json<ApiResponse<DailyUsageEntry[]>>({
        success: true,
        data: results,
      });
    }

    // Default: return last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usageRecords = await prisma.dailyUsage.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'desc' },
    });

    const results: DailyUsageEntry[] = usageRecords.map(u => ({
      id: u.id,
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
      createdAt: u.createdAt,
    }));

    return NextResponse.json<ApiResponse<DailyUsageEntry[]>>({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('GET /api/v1/usage error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch usage data' },
    }, { status: 500 });
  }
}

// POST /api/v1/usage - Save usage data
export async function POST(request: NextRequest) {
  try {
    // Ensure user exists in our database
    const user = await getOrCreateUser();
    const userId = user.id;

    const body = await request.json();
    const validation = validateRequest(dailyUsageSchema, body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: validation.error },
      }, { status: 400 });
    }

    const data = validation.data;
    const dateObj = new Date(data.date);

    // Upsert the usage record
    const usage = await prisma.dailyUsage.upsert({
      where: { userId_date: { userId, date: dateObj } },
      update: {
        socialMediaMinutes: data.socialMediaMinutes,
        shoppingMinutes: data.shoppingMinutes,
        entertainmentMinutes: data.entertainmentMinutes,
        datingAppsMinutes: data.datingAppsMinutes,
        productivityMinutes: data.productivityMinutes,
        newsMinutes: data.newsMinutes,
        gamesMinutes: data.gamesMinutes,
        phonePickups: data.phonePickups,
        lateNightUsageMinutes: data.lateNightUsageMinutes,
        steps: data.steps,
        sleepHours: data.sleepHours,
        wakeTime: data.wakeTime,
        source: data.source,
      },
      create: {
        userId,
        date: dateObj,
        socialMediaMinutes: data.socialMediaMinutes,
        shoppingMinutes: data.shoppingMinutes,
        entertainmentMinutes: data.entertainmentMinutes,
        datingAppsMinutes: data.datingAppsMinutes,
        productivityMinutes: data.productivityMinutes,
        newsMinutes: data.newsMinutes,
        gamesMinutes: data.gamesMinutes,
        phonePickups: data.phonePickups,
        lateNightUsageMinutes: data.lateNightUsageMinutes,
        steps: data.steps,
        sleepHours: data.sleepHours,
        wakeTime: data.wakeTime,
        source: data.source,
      },
    });

    // Audit log
    await auditLog({
      userId,
      action: AuditActions.DATA_CREATED,
      resource: 'daily_usage',
      resourceId: usage.id,
      metadata: { date: data.date },
    });

    const result: DailyUsageEntry = {
      id: usage.id,
      date: format(usage.date, 'yyyy-MM-dd'),
      socialMediaMinutes: usage.socialMediaMinutes,
      shoppingMinutes: usage.shoppingMinutes,
      entertainmentMinutes: usage.entertainmentMinutes,
      datingAppsMinutes: usage.datingAppsMinutes,
      productivityMinutes: usage.productivityMinutes,
      newsMinutes: usage.newsMinutes,
      gamesMinutes: usage.gamesMinutes,
      phonePickups: usage.phonePickups,
      lateNightUsageMinutes: usage.lateNightUsageMinutes,
      steps: usage.steps,
      sleepHours: usage.sleepHours,
      wakeTime: usage.wakeTime,
      source: usage.source,
      createdAt: usage.createdAt,
    };

    return NextResponse.json<ApiResponse<DailyUsageEntry>>({
      success: true,
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/usage error:', error);

    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to save usage data' },
    }, { status: 500 });
  }
}
