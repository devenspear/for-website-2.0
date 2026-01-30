// Character Insights 2.0 - Type Definitions

export enum CharacterTheme {
  PRIDE = 'pride',
  GREED = 'greed',
  LUST = 'lust',
  ANGER = 'anger',
  GLUTTONY = 'gluttony',
  ENVY = 'envy',
  SLOTH = 'sloth',
  FEAR = 'fear',
  SELF_PITY = 'self_pity',
  GUILT = 'guilt',
  SHAME = 'shame',
  DISHONESTY = 'dishonesty',
}

export interface ThemeDefinition {
  id: CharacterTheme;
  name: string;
  description: string;
  color: string;
  icon: string;
  reflectivePrompts: string[];
}

export const ALL_THEMES = Object.values(CharacterTheme);

// Usage Data Types
export interface DailyUsageEntry {
  id?: string;
  date: string;                              // YYYY-MM-DD

  // Time in minutes per category
  socialMediaMinutes: number;
  shoppingMinutes: number;
  entertainmentMinutes: number;
  datingAppsMinutes: number;
  productivityMinutes: number;
  newsMinutes: number;
  gamesMinutes: number;

  // Behavioral metrics
  phonePickups: number;
  lateNightUsageMinutes: number;             // After 11pm

  // Health metrics
  steps: number;
  sleepHours: number;
  wakeTime: string;                          // HH:mm

  source?: string;
  createdAt?: Date;
}

export interface ExtractedFeatures {
  date: string;

  // Category time (minutes)
  socialMediaMinutes: number;
  shoppingMinutes: number;
  entertainmentMinutes: number;
  datingAppsMinutes: number;
  productivityMinutes: number;
  newsMinutes: number;
  gamesMinutes: number;

  // Derived metrics
  totalScreenTimeMinutes: number;
  passiveConsumptionMinutes: number;         // Entertainment + Social + News
  phonePickups: number;
  lateNightUsageMinutes: number;

  // Health metrics
  steps: number;
  sleepHours: number;
  wakeTimeHour: number;                      // 0-23

  // Self-report (from check-in if available)
  selfReportedTheme?: string;
  moodScore?: number;

  // Derived patterns
  isLowActivity: boolean;                    // Steps < 3000
  isHighScreenTime: boolean;                 // > 4 hours
  isLateWake: boolean;                       // After 9am
  isHighLateNight: boolean;                  // > 60 min late night usage
}

export const DEFAULT_USAGE_ENTRY: Omit<DailyUsageEntry, 'id' | 'date' | 'createdAt'> = {
  socialMediaMinutes: 60,
  shoppingMinutes: 15,
  entertainmentMinutes: 90,
  datingAppsMinutes: 0,
  productivityMinutes: 120,
  newsMinutes: 30,
  gamesMinutes: 30,
  phonePickups: 50,
  lateNightUsageMinutes: 30,
  steps: 5000,
  sleepHours: 7,
  wakeTime: '07:30',
};

// Check-in Types
export interface DailyCheckIn {
  id?: string;
  date: string;                              // YYYY-MM-DD
  moodScore: number;                         // 1-10
  primaryTheme: CharacterTheme;
  journalEntry?: string;
  source?: string;
  createdAt?: Date;
}

export interface CheckInStreak {
  currentStreak: number;
  longestStreak: number;
  lastCheckInDate: string | null;
}

// Score Types
export interface SignalContribution {
  source: string;
  label: string;
  weight: number;
  rawValue: number;
  normalizedValue: number;
}

export interface ThemeScore {
  theme: CharacterTheme;
  score: number;                    // 0-10
  confidence: number;               // 0-1 (how much data contributed)
  trend: 'up' | 'down' | 'stable';
  topContributors: string[];
  signalBreakdown: SignalContribution[];
}

export interface ThemeHighlight {
  theme: CharacterTheme;
  type: 'highest' | 'lowest' | 'most_improved' | 'needs_attention';
  message: string;
}

export interface GeneratedPrompt {
  theme: CharacterTheme;
  prompt: string;
}

export interface WeeklyReport {
  weekStartDate: string;
  weekEndDate: string;
  scores: ThemeScore[];
  highlights: ThemeHighlight[];
  reflectivePrompts: GeneratedPrompt[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
