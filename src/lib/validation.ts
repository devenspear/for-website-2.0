import { z } from 'zod';
import { CharacterTheme, ALL_THEMES } from '@/types';

// Daily Usage validation schema
export const dailyUsageSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  socialMediaMinutes: z.number().int().min(0).max(1440),
  shoppingMinutes: z.number().int().min(0).max(1440),
  entertainmentMinutes: z.number().int().min(0).max(1440),
  datingAppsMinutes: z.number().int().min(0).max(1440),
  productivityMinutes: z.number().int().min(0).max(1440),
  newsMinutes: z.number().int().min(0).max(1440),
  gamesMinutes: z.number().int().min(0).max(1440),
  phonePickups: z.number().int().min(0).max(500),
  lateNightUsageMinutes: z.number().int().min(0).max(480),
  steps: z.number().int().min(0).max(100000),
  sleepHours: z.number().min(0).max(24),
  wakeTime: z.string().regex(/^\d{2}:\d{2}$/, 'Wake time must be HH:mm format'),
  source: z.string().optional().default('manual'),
});

export type DailyUsageInput = z.infer<typeof dailyUsageSchema>;

// Daily Check-in validation schema
export const dailyCheckInSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  moodScore: z.number().int().min(1).max(10),
  primaryTheme: z.enum(ALL_THEMES as [CharacterTheme, ...CharacterTheme[]]),
  journalEntry: z.string().max(5000).optional(),
  source: z.string().optional().default('web'),
});

export type DailyCheckInInput = z.infer<typeof dailyCheckInSchema>;

// Date query parameter validation
export const dateQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// Weekly report query validation
export const weeklyReportQuerySchema = z.object({
  weekStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Week start must be YYYY-MM-DD format'),
});

// Bulk sync validation (for mobile)
export const bulkSyncSchema = z.object({
  usage: z.array(dailyUsageSchema).optional(),
  checkIns: z.array(dailyCheckInSchema).optional(),
  lastSyncTimestamp: z.string().datetime().optional(),
});

export type BulkSyncInput = z.infer<typeof bulkSyncSchema>;

// Validation helper function
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, error: errors };
  }
  return { success: true, data: result.data };
}
