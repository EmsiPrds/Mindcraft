/**
 * XP and Level Calculation Utilities
 * 
 * Level progression formula: XP required = baseXP * (level ^ exponent)
 * This creates exponential growth where higher levels require more XP
 */

const BASE_XP = 100; // Base XP required for level 2
const EXPONENT = 1.5; // Controls the curve steepness

/**
 * Calculate total XP required to reach a specific level
 */
export const getXPForLevel = (level: number): number => {
  if (level <= 1) return 0;
  return Math.floor(BASE_XP * Math.pow(level - 1, EXPONENT));
};

/**
 * Calculate the level based on total XP
 */
export const getLevelFromXP = (totalXP: number): number => {
  if (totalXP < BASE_XP) return 1;
  
  let level = 1;
  let xpNeeded = 0;
  
  while (xpNeeded <= totalXP) {
    level++;
    xpNeeded = getXPForLevel(level);
  }
  
  return level - 1;
};

/**
 * Calculate XP needed for next level
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const currentLevelXP = getXPForLevel(currentLevel);
  return nextLevelXP - currentLevelXP;
};

/**
 * Calculate progress percentage to next level
 */
export const getProgressToNextLevel = (currentXP: number, currentLevel: number): number => {
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;
  
  if (xpNeededForNext === 0) return 100;
  return Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNext) * 100));
};

/**
 * Calculate XP remaining to next level
 */
export const getXPRemainingToNextLevel = (currentXP: number, currentLevel: number): number => {
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  return Math.max(0, nextLevelXP - currentXP);
};

