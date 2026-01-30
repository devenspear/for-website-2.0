import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { dailyCheckInSchema, validateRequest } from '@/lib/validation';
import { getCurrentUserId, getOrCreateUser } from '@/lib/user';
import { auditLog, AuditActions } from '@/lib/audit';
import { ApiResponse, DailyCheckIn, CharacterTheme } from '@/types';
import { format } from 'date-fns';

// GET /api/v1/check-ins - Get check-in data
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
      const checkIn = await prisma.dailyCheckIn.findUnique({
        where: { userId_date: { userId, date: dateObj } },
      });

      if (!checkIn) {
        return NextResponse.json<ApiResponse<null>>({
          success: true,
          data: null,
        });
      }

      const result: DailyCheckIn = {
        id: checkIn.id,
        date: format(checkIn.date, 'yyyy-MM-dd'),
        moodScore: checkIn.moodScore,
        primaryTheme: checkIn.primaryTheme as CharacterTheme,
        journalEntry: checkIn.journalEntry ?? undefined,
        source: checkIn.source,
        createdAt: checkIn.createdAt,
      };

      return NextResponse.json<ApiResponse<DailyCheckIn>>({
        success: true,
        data: result,
      });
    }

    // Date range query
    if (startDate && endDate) {
      const checkIns = await prisma.dailyCheckIn.findMany({
        where: {
          userId,
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
        orderBy: { date: 'asc' },
      });

      const results: DailyCheckIn[] = checkIns.map(c => ({
        id: c.id,
        date: format(c.date, 'yyyy-MM-dd'),
        moodScore: c.moodScore,
        primaryTheme: c.primaryTheme as CharacterTheme,
        journalEntry: c.journalEntry ?? undefined,
        source: c.source,
        createdAt: c.createdAt,
      }));

      return NextResponse.json<ApiResponse<DailyCheckIn[]>>({
        success: true,
        data: results,
      });
    }

    // Default: return last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const checkIns = await prisma.dailyCheckIn.findMany({
      where: {
        userId,
        date: { gte: thirtyDaysAgo },
      },
      orderBy: { date: 'desc' },
    });

    const results: DailyCheckIn[] = checkIns.map(c => ({
      id: c.id,
      date: format(c.date, 'yyyy-MM-dd'),
      moodScore: c.moodScore,
      primaryTheme: c.primaryTheme as CharacterTheme,
      journalEntry: c.journalEntry ?? undefined,
      source: c.source,
      createdAt: c.createdAt,
    }));

    return NextResponse.json<ApiResponse<DailyCheckIn[]>>({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('GET /api/v1/check-ins error:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch check-in data' },
    }, { status: 500 });
  }
}

// POST /api/v1/check-ins - Save check-in data
export async function POST(request: NextRequest) {
  try {
    // Ensure user exists in our database
    const user = await getOrCreateUser();
    const userId = user.id;

    const body = await request.json();
    const validation = validateRequest(dailyCheckInSchema, body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: validation.error },
      }, { status: 400 });
    }

    const data = validation.data;
    const dateObj = new Date(data.date);

    // Upsert the check-in record
    const checkIn = await prisma.dailyCheckIn.upsert({
      where: { userId_date: { userId, date: dateObj } },
      update: {
        moodScore: data.moodScore,
        primaryTheme: data.primaryTheme,
        journalEntry: data.journalEntry,
        source: data.source,
      },
      create: {
        userId,
        date: dateObj,
        moodScore: data.moodScore,
        primaryTheme: data.primaryTheme,
        journalEntry: data.journalEntry,
        source: data.source,
      },
    });

    // Audit log
    await auditLog({
      userId,
      action: AuditActions.DATA_CREATED,
      resource: 'daily_check_in',
      resourceId: checkIn.id,
      metadata: { date: data.date, theme: data.primaryTheme },
    });

    const result: DailyCheckIn = {
      id: checkIn.id,
      date: format(checkIn.date, 'yyyy-MM-dd'),
      moodScore: checkIn.moodScore,
      primaryTheme: checkIn.primaryTheme as CharacterTheme,
      journalEntry: checkIn.journalEntry ?? undefined,
      source: checkIn.source,
      createdAt: checkIn.createdAt,
    };

    return NextResponse.json<ApiResponse<DailyCheckIn>>({
      success: true,
      data: result,
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/v1/check-ins error:', error);

    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to save check-in data' },
    }, { status: 500 });
  }
}
