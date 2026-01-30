'use client';

import { create } from 'zustand';
import { format, startOfWeek } from 'date-fns';
import {
  DailyUsageEntry,
  DailyCheckIn,
  WeeklyReport,
  CheckInStreak,
  ApiResponse,
} from '@/types';

interface DataState {
  // Current data
  currentWeekReport: WeeklyReport | null;
  selectedWeekStart: string;
  todaysUsage: DailyUsageEntry | null;
  todaysCheckIn: DailyCheckIn | null;
  checkInStreak: CheckInStreak;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedWeek: (weekStart: string) => void;
  loadWeeklyReport: (weekStart?: string) => Promise<void>;
  loadTodaysData: () => Promise<void>;
  saveUsageEntry: (entry: DailyUsageEntry) => Promise<void>;
  saveCheckIn: (checkIn: DailyCheckIn) => Promise<void>;
  calculateStreak: () => Promise<void>;
  clearAllData: () => Promise<void>;
  exportData: () => Promise<string>;
}

export const useDataStore = create<DataState>((set, get) => ({
  currentWeekReport: null,
  selectedWeekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  todaysUsage: null,
  todaysCheckIn: null,
  checkInStreak: { currentStreak: 0, longestStreak: 0, lastCheckInDate: null },
  isLoading: false,
  error: null,

  setSelectedWeek: (weekStart) => {
    set({ selectedWeekStart: weekStart });
    get().loadWeeklyReport(weekStart);
  },

  loadWeeklyReport: async (weekStart) => {
    const targetWeek = weekStart || get().selectedWeekStart;
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/v1/scores/weekly?weekStart=${targetWeek}`);
      const result: ApiResponse<WeeklyReport> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to load report');
      }

      set({ currentWeekReport: result.data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadTodaysData: async () => {
    const today = format(new Date(), 'yyyy-MM-dd');

    try {
      const [usageRes, checkInRes] = await Promise.all([
        fetch(`/api/v1/usage?date=${today}`),
        fetch(`/api/v1/check-ins?date=${today}`),
      ]);

      const [usageResult, checkInResult] = await Promise.all([
        usageRes.json() as Promise<ApiResponse<DailyUsageEntry | null>>,
        checkInRes.json() as Promise<ApiResponse<DailyCheckIn | null>>,
      ]);

      set({
        todaysUsage: usageResult.data || null,
        todaysCheckIn: checkInResult.data || null,
      });
    } catch (error) {
      console.error('Failed to load today\'s data:', error);
    }
  },

  saveUsageEntry: async (entry) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/v1/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });

      const result: ApiResponse<DailyUsageEntry> = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to save usage');
      }

      await get().loadTodaysData();
      await get().loadWeeklyReport();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  saveCheckIn: async (checkIn) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/v1/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkIn),
      });

      const result: ApiResponse<DailyCheckIn> = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to save check-in');
      }

      await get().loadTodaysData();
      await get().loadWeeklyReport();
      await get().calculateStreak();
      set({ isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  calculateStreak: async () => {
    try {
      // Get last 90 days of check-ins
      const endDate = format(new Date(), 'yyyy-MM-dd');
      const startDate = format(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');

      const response = await fetch(`/api/v1/check-ins?startDate=${startDate}&endDate=${endDate}`);
      const result: ApiResponse<DailyCheckIn[]> = await response.json();

      if (!result.success || !result.data) {
        set({ checkInStreak: { currentStreak: 0, longestStreak: 0, lastCheckInDate: null } });
        return;
      }

      const checkIns = result.data;
      if (checkIns.length === 0) {
        set({ checkInStreak: { currentStreak: 0, longestStreak: 0, lastCheckInDate: null } });
        return;
      }

      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      let lastDate: string | null = null;

      // Sort by date descending
      const sortedCheckIns = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));

      for (let i = 0; i < sortedCheckIns.length; i++) {
        const checkIn = sortedCheckIns[i];

        if (i === 0) {
          // First check-in
          if (checkIn.date === today || checkIn.date === yesterday) {
            currentStreak = 1;
            tempStreak = 1;
          }
          lastDate = checkIn.date;
        } else {
          // Check if consecutive
          const prevDate = new Date(lastDate!);
          prevDate.setDate(prevDate.getDate() - 1);
          const expectedDate = format(prevDate, 'yyyy-MM-dd');

          if (checkIn.date === expectedDate) {
            tempStreak++;
            if (currentStreak > 0) {
              currentStreak = tempStreak;
            }
          } else {
            tempStreak = 1;
          }
          lastDate = checkIn.date;
        }

        longestStreak = Math.max(longestStreak, tempStreak);
      }

      set({
        checkInStreak: {
          currentStreak,
          longestStreak,
          lastCheckInDate: sortedCheckIns[0]?.date || null,
        },
      });
    } catch (error) {
      console.error('Failed to calculate streak:', error);
    }
  },

  clearAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/v1/data/delete', {
        method: 'DELETE',
        headers: {
          'X-Confirm-Delete': 'true',
        },
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to delete data');
      }

      set({
        currentWeekReport: null,
        todaysUsage: null,
        todaysCheckIn: null,
        checkInStreak: { currentStreak: 0, longestStreak: 0, lastCheckInDate: null },
        isLoading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  exportData: async () => {
    try {
      const response = await fetch('/api/v1/data/export');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to export data');
      }

      return JSON.stringify(result.data, null, 2);
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  },
}));
