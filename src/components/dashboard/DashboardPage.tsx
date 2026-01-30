'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, BarChart3 } from 'lucide-react';
import { useDataStore } from '@/store/useDataStore';
import { useAppStore } from '@/store/useAppStore';
import { ThemeScore, CharacterTheme } from '@/types';
import { Layout } from '@/components/common/Layout';
import { WeeklyBarChart } from '@/components/charts/WeeklyBarChart';
import { ThemeCard } from '@/components/dashboard/ThemeCard';
import { InsightsSummary } from '@/components/dashboard/InsightsSummary';

export const DashboardPage: React.FC = () => {
  const {
    currentWeekReport,
    selectedWeekStart,
    isLoading,
    error,
    setSelectedWeek,
    loadWeeklyReport,
  } = useDataStore();

  const { hiddenThemes } = useAppStore();

  const [, setSelectedTheme] = useState<ThemeScore | null>(null);

  useEffect(() => {
    loadWeeklyReport();
  }, [loadWeeklyReport]);

  const handleBarClick = (theme: CharacterTheme) => {
    const score = currentWeekReport?.scores.find((s) => s.theme === theme);
    if (score) {
      setSelectedTheme(score);
    }
  };

  const handleCardClick = (score: ThemeScore) => {
    setSelectedTheme(score);
  };

  // Sort scores by value descending, filter hidden themes
  const sortedScores =
    currentWeekReport?.scores
      .filter((s) => !hiddenThemes.includes(s.theme))
      .sort((a, b) => b.score - a.score) || [];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Week Selector */}
        <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-neutral-100 shadow-sm">
          <div>
            <h2 className="font-semibold text-neutral-900">Week of</h2>
            <p className="text-sm text-neutral-500">{selectedWeekStart}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const date = new Date(selectedWeekStart);
                date.setDate(date.getDate() - 7);
                setSelectedWeek(date.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200"
            >
              Previous
            </button>
            <button
              onClick={() => {
                const date = new Date(selectedWeekStart);
                date.setDate(date.getDate() + 7);
                if (date <= new Date()) {
                  setSelectedWeek(date.toISOString().split('T')[0]);
                }
              }}
              className="px-3 py-1.5 text-sm font-medium text-neutral-600 bg-neutral-100 rounded-lg hover:bg-neutral-200"
            >
              Next
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-neutral-500 mt-3 text-sm">Loading your insights...</p>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && currentWeekReport && (
          <>
            {/* Bar Chart */}
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                    <BarChart3 size={18} className="text-indigo-500" />
                    Weekly Overview
                  </h2>
                  <p className="text-sm text-neutral-500 mt-0.5">Tap any bar to see details</p>
                </div>
              </div>
              <div className="p-5">
                <WeeklyBarChart
                  scores={currentWeekReport.scores}
                  onBarClick={handleBarClick}
                  hiddenThemes={hiddenThemes}
                />
              </div>
            </div>

            {/* Insights Summary */}
            <InsightsSummary
              highlights={currentWeekReport.highlights}
              prompts={currentWeekReport.reflectivePrompts}
            />

            {/* Theme Cards */}
            <div>
              <h2 className="font-semibold text-neutral-900 mb-3 px-1">All Themes</h2>
              <div className="space-y-3">
                {sortedScores.map((score) => (
                  <ThemeCard
                    key={score.theme}
                    score={score}
                    onClick={() => handleCardClick(score)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!isLoading && !error && (!currentWeekReport || sortedScores.length === 0) && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <BarChart3 size={28} className="text-neutral-400" />
            </div>
            <h3 className="font-semibold text-neutral-900">No data for this week</h3>
            <p className="text-sm text-neutral-500 mt-2 max-w-sm mx-auto">
              Enter your daily data or complete a check-in to see your weekly insights and scores.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};
