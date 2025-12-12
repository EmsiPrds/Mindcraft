/**
 * Streak Management Utilities
 * Handles daily streak calculation and validation
 */

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Check if two dates are consecutive days
 */
export const isConsecutiveDay = (date1: Date, date2: Date): boolean => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

/**
 * Calculate new streak based on last challenge date
 * Returns the updated streak count
 */
export const calculateStreak = (
  lastChallengeDate: Date | null | undefined,
  currentStreak: number
): number => {
  if (!lastChallengeDate) {
    // First challenge ever
    return 1;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastDate = new Date(lastChallengeDate);
  lastDate.setHours(0, 0, 0, 0);

  if (isToday(lastDate)) {
    // Already completed today, streak unchanged
    return currentStreak;
  }

  if (isYesterday(lastDate)) {
    // Completed yesterday, continue streak
    return currentStreak + 1;
  }

  // Gap in streak, reset to 1
  return 1;
};

/**
 * Check if user should get streak bonus
 */
export const getStreakBonus = (streak: number): { xpBonus: number; coinBonus: number } => {
  // Bonus increases with streak milestones
  if (streak >= 30) {
    return { xpBonus: 50, coinBonus: 20 }; // 30+ day bonus
  } else if (streak >= 14) {
    return { xpBonus: 30, coinBonus: 15 }; // 2 week bonus
  } else if (streak >= 7) {
    return { xpBonus: 20, coinBonus: 10 }; // 1 week bonus
  } else if (streak >= 3) {
    return { xpBonus: 10, coinBonus: 5 }; // 3 day bonus
  }
  return { xpBonus: 0, coinBonus: 0 };
};

