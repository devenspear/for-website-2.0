import { format, subDays, endOfWeek, eachDayOfInterval } from 'date-fns';
import {
  CharacterTheme,
  ThemeScore,
  WeeklyReport,
  ThemeHighlight,
  GeneratedPrompt,
  DailyUsageEntry,
  DailyCheckIn,
} from '@/types';
import { featureExtractor } from './FeatureExtractor';
import { ALL_SCORERS } from './themes';
import { THEME_DEFINITIONS } from '@/constants/themes';
import { ALGORITHM_VERSION } from '@/constants/scoring';
import prisma from '@/lib/db';

export class ScoringEngine {
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  async calculateDailyScores(date: string): Promise<ThemeScore[]> {
    const dateObj = new Date(date);

    // Fetch usage and check-in from database
    const [usageRecord, checkInRecord] = await Promise.all([
      prisma.dailyUsage.findUnique({
        where: { userId_date: { userId: this.userId, date: dateObj } },
      }),
      prisma.dailyCheckIn.findUnique({
        where: { userId_date: { userId: this.userId, date: dateObj } },
      }),
    ]);

    // Convert Prisma records to our type format
    const usage: DailyUsageEntry | null = usageRecord ? {
      id: usageRecord.id,
      date: format(usageRecord.date, 'yyyy-MM-dd'),
      socialMediaMinutes: usageRecord.socialMediaMinutes,
      shoppingMinutes: usageRecord.shoppingMinutes,
      entertainmentMinutes: usageRecord.entertainmentMinutes,
      datingAppsMinutes: usageRecord.datingAppsMinutes,
      productivityMinutes: usageRecord.productivityMinutes,
      newsMinutes: usageRecord.newsMinutes,
      gamesMinutes: usageRecord.gamesMinutes,
      phonePickups: usageRecord.phonePickups,
      lateNightUsageMinutes: usageRecord.lateNightUsageMinutes,
      steps: usageRecord.steps,
      sleepHours: usageRecord.sleepHours,
      wakeTime: usageRecord.wakeTime,
      source: usageRecord.source,
      createdAt: usageRecord.createdAt,
    } : null;

    const checkIn: DailyCheckIn | null = checkInRecord ? {
      id: checkInRecord.id,
      date: format(checkInRecord.date, 'yyyy-MM-dd'),
      moodScore: checkInRecord.moodScore,
      primaryTheme: checkInRecord.primaryTheme as CharacterTheme,
      journalEntry: checkInRecord.journalEntry ?? undefined,
      source: checkInRecord.source,
      createdAt: checkInRecord.createdAt,
    } : null;

    const features = featureExtractor.extract(usage, checkIn);
    return ALL_SCORERS.map(scorer => scorer.calculate(features));
  }

  async calculateWeeklyReport(weekStartDate: string): Promise<WeeklyReport> {
    const start = new Date(weekStartDate);
    const end = endOfWeek(start, { weekStartsOn: 1 });
    const weekEndDate = format(end, 'yyyy-MM-dd');

    // Get all days in the week
    const days = eachDayOfInterval({ start, end });

    // Calculate daily scores for each day
    const dailyScoresArray: ThemeScore[][] = [];

    for (const day of days) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayScores = await this.calculateDailyScores(dateStr);
      dailyScoresArray.push(dayScores);
    }

    // Aggregate weekly scores (average of daily scores)
    const weeklyScores = this.aggregateWeeklyScores(dailyScoresArray);

    // Calculate trends by comparing to previous week
    const prevWeekStart = format(subDays(start, 7), 'yyyy-MM-dd');
    const weeklyScoresWithTrends = await this.calculateTrends(weeklyScores, prevWeekStart);

    // Generate highlights
    const highlights = this.generateHighlights(weeklyScoresWithTrends);

    // Generate reflective prompts
    const prompts = this.generatePrompts(weeklyScoresWithTrends);

    return {
      weekStartDate,
      weekEndDate,
      scores: weeklyScoresWithTrends,
      highlights,
      reflectivePrompts: prompts,
    };
  }

  private aggregateWeeklyScores(dailyScores: ThemeScore[][]): ThemeScore[] {
    if (dailyScores.length === 0) {
      return ALL_SCORERS.map(scorer => ({
        theme: scorer.theme,
        score: 0,
        confidence: 0,
        trend: 'stable' as const,
        topContributors: [],
        signalBreakdown: [],
      }));
    }

    const themeScores: Record<CharacterTheme, { sum: number; count: number; contributors: string[] }> = {} as Record<CharacterTheme, { sum: number; count: number; contributors: string[] }>;

    // Initialize
    for (const theme of Object.values(CharacterTheme)) {
      themeScores[theme] = { sum: 0, count: 0, contributors: [] };
    }

    // Sum up scores
    for (const day of dailyScores) {
      for (const score of day) {
        if (score.confidence > 0) {
          themeScores[score.theme].sum += score.score;
          themeScores[score.theme].count++;
          themeScores[score.theme].contributors.push(...score.topContributors);
        }
      }
    }

    // Calculate averages
    return Object.values(CharacterTheme).map(theme => {
      const data = themeScores[theme];
      const avgScore = data.count > 0 ? data.sum / data.count : 0;

      // Get most common contributors
      const contributorCounts = data.contributors.reduce((acc, c) => {
        acc[c] = (acc[c] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topContributors = Object.entries(contributorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([c]) => c);

      return {
        theme,
        score: Math.round(avgScore * 10) / 10,
        confidence: data.count / dailyScores.length,
        trend: 'stable' as const,
        topContributors,
        signalBreakdown: [],
      };
    });
  }

  private async calculateTrends(
    currentScores: ThemeScore[],
    prevWeekStart: string
  ): Promise<ThemeScore[]> {
    // Get previous week's report
    const prevStart = new Date(prevWeekStart);
    const prevEnd = endOfWeek(prevStart, { weekStartsOn: 1 });
    const prevDays = eachDayOfInterval({ start: prevStart, end: prevEnd });

    const prevDailyScores: ThemeScore[][] = [];
    for (const day of prevDays) {
      const dateStr = format(day, 'yyyy-MM-dd');
      const dayScores = await this.calculateDailyScores(dateStr);
      prevDailyScores.push(dayScores);
    }

    const prevWeeklyScores = this.aggregateWeeklyScores(prevDailyScores);

    // Compare and set trends
    return currentScores.map(current => {
      const prev = prevWeeklyScores.find(p => p.theme === current.theme);
      let trend: 'up' | 'down' | 'stable' = 'stable';

      if (prev && prev.confidence > 0.3) {
        const diff = current.score - prev.score;
        if (diff >= 1) trend = 'up';
        else if (diff <= -1) trend = 'down';
      }

      return { ...current, trend };
    });
  }

  private generateHighlights(scores: ThemeScore[]): ThemeHighlight[] {
    const highlights: ThemeHighlight[] = [];
    const sortedByScore = [...scores].sort((a, b) => b.score - a.score);

    // Highest score
    if (sortedByScore[0].score > 3) {
      highlights.push({
        theme: sortedByScore[0].theme,
        type: 'highest',
        message: `${THEME_DEFINITIONS[sortedByScore[0].theme].name} was your most prominent theme this week (${sortedByScore[0].score}/10)`,
      });
    }

    // Most improved (biggest decrease)
    const improved = scores.filter(s => s.trend === 'down').sort((a, b) => a.score - b.score);
    if (improved.length > 0) {
      highlights.push({
        theme: improved[0].theme,
        type: 'most_improved',
        message: `${THEME_DEFINITIONS[improved[0].theme].name} showed improvement this week`,
      });
    }

    // Needs attention (increasing trend with high score)
    const needsAttention = scores
      .filter(s => s.trend === 'up' && s.score > 5)
      .sort((a, b) => b.score - a.score);

    if (needsAttention.length > 0) {
      highlights.push({
        theme: needsAttention[0].theme,
        type: 'needs_attention',
        message: `${THEME_DEFINITIONS[needsAttention[0].theme].name} is trending upward - consider reflection`,
      });
    }

    return highlights.slice(0, 3);
  }

  private generatePrompts(scores: ThemeScore[]): GeneratedPrompt[] {
    const prompts: GeneratedPrompt[] = [];

    // Get top 3 themes by score
    const topThemes = [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .filter(s => s.score > 2);

    for (const score of topThemes) {
      const themePrompts = THEME_DEFINITIONS[score.theme].reflectivePrompts;
      const randomPrompt = themePrompts[Math.floor(Math.random() * themePrompts.length)];

      prompts.push({
        theme: score.theme,
        prompt: randomPrompt,
      });
    }

    return prompts;
  }

  // Get algorithm version
  getAlgorithmVersion(): string {
    return ALGORITHM_VERSION;
  }
}

// Factory function to create scoring engine for a user
export function createScoringEngine(userId: string): ScoringEngine {
  return new ScoringEngine(userId);
}
