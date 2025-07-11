import { UserProfile } from "@shared/schema";
import { CompatibilityFactors, CompatibilityResult } from "@/types";

export function calculateCompatibilityScore(
  profile1: UserProfile,
  profile2: UserProfile
): CompatibilityResult {
  const factors: CompatibilityFactors = {
    sleepSchedule: calculateSleepScheduleCompatibility(profile1.sleepSchedule, profile2.sleepSchedule),
    workSchedule: calculateWorkScheduleCompatibility(profile1.workSchedule, profile2.workSchedule),
    dietaryPreference: calculateDietaryCompatibility(profile1.dietaryPreference, profile2.dietaryPreference),
    smoking: calculateSmokingCompatibility(profile1.smoking, profile2.smoking),
    drinking: calculateDrinkingCompatibility(profile1.drinking, profile2.drinking),
    cleanliness: calculateCleanlinessCompatibility(profile1.cleanliness, profile2.cleanliness),
    guestsPolicy: calculateGuestsCompatibility(profile1.guestsPolicy, profile2.guestsPolicy),
    petPreference: calculatePetCompatibility(profile1.petPreference, profile2.petPreference),
  };

  const score = Math.round(
    (factors.sleepSchedule * 0.15 +
     factors.workSchedule * 0.10 +
     factors.dietaryPreference * 0.15 +
     factors.smoking * 0.20 +
     factors.drinking * 0.15 +
     factors.cleanliness * 0.15 +
     factors.guestsPolicy * 0.05 +
     factors.petPreference * 0.05) * 100
  );

  const strengths: string[] = [];
  const concerns: string[] = [];

  // Identify strengths and concerns
  Object.entries(factors).forEach(([key, value]) => {
    if (value >= 0.8) {
      strengths.push(formatFactorName(key));
    } else if (value <= 0.4) {
      concerns.push(formatFactorName(key));
    }
  });

  return { score, factors, strengths, concerns };
}

function calculateSleepScheduleCompatibility(schedule1?: string, schedule2?: string): number {
  if (!schedule1 || !schedule2) return 0.5;
  if (schedule1 === schedule2) return 1.0;
  if (schedule1 === 'flexible' || schedule2 === 'flexible') return 0.8;
  return 0.3; // early_bird vs night_owl
}

function calculateWorkScheduleCompatibility(work1?: string, work2?: string): number {
  if (!work1 || !work2) return 0.5;
  if (work1 === work2) return 1.0;
  
  const compatiblePairs = [
    ['remote_work', 'student'],
    ['regular_office', 'student'],
  ];
  
  const pair = [work1, work2].sort();
  if (compatiblePairs.some(cp => cp[0] === pair[0] && cp[1] === pair[1])) {
    return 0.7;
  }
  
  return 0.4;
}

function calculateDietaryCompatibility(diet1?: string, diet2?: string): number {
  if (!diet1 || !diet2) return 0.5;
  if (diet1 === diet2) return 1.0;
  if (diet1 === 'no_preference' || diet2 === 'no_preference') return 0.8;
  
  const vegetarianTypes = ['vegetarian', 'vegan'];
  if (vegetarianTypes.includes(diet1!) && vegetarianTypes.includes(diet2!)) {
    return 0.9;
  }
  
  return 0.6;
}

function calculateSmokingCompatibility(smoking1?: string, smoking2?: string): number {
  if (!smoking1 || !smoking2) return 0.5;
  if (smoking1 === smoking2) return 1.0;
  
  if (smoking1 === 'non_smoker' && smoking2 !== 'non_smoker') return 0.2;
  if (smoking2 === 'non_smoker' && smoking1 !== 'non_smoker') return 0.2;
  
  return 0.6; // occasional vs regular
}

function calculateDrinkingCompatibility(drinking1?: string, drinking2?: string): number {
  if (!drinking1 || !drinking2) return 0.5;
  if (drinking1 === drinking2) return 1.0;
  
  if (drinking1 === 'non_drinker' && drinking2 === 'regular_drinker') return 0.3;
  if (drinking2 === 'non_drinker' && drinking1 === 'regular_drinker') return 0.3;
  
  return 0.7;
}

function calculateCleanlinessCompatibility(clean1?: string, clean2?: string): number {
  if (!clean1 || !clean2) return 0.5;
  if (clean1 === clean2) return 1.0;
  
  const cleanlinessOrder = ['relaxed', 'moderately_clean', 'clean_flexible', 'very_clean'];
  const index1 = cleanlinessOrder.indexOf(clean1);
  const index2 = cleanlinessOrder.indexOf(clean2);
  
  const diff = Math.abs(index1 - index2);
  return Math.max(0.3, 1 - (diff * 0.25));
}

function calculateGuestsCompatibility(guests1?: string, guests2?: string): number {
  if (!guests1 || !guests2) return 0.5;
  if (guests1 === guests2) return 1.0;
  
  if (guests1 === 'no_guests' && guests2 === 'guests_welcome') return 0.2;
  if (guests2 === 'no_guests' && guests1 === 'guests_welcome') return 0.2;
  
  return 0.7;
}

function calculatePetCompatibility(pet1?: string, pet2?: string): number {
  if (!pet1 || !pet2) return 0.5;
  if (pet1 === pet2) return 1.0;
  
  if (pet1 === 'no_pets' && pet2 === 'love_pets') return 0.2;
  if (pet2 === 'no_pets' && pet1 === 'love_pets') return 0.2;
  
  return 0.7;
}

function formatFactorName(factor: string): string {
  const formatMap: Record<string, string> = {
    sleepSchedule: 'Sleep Schedule',
    workSchedule: 'Work Schedule',
    dietaryPreference: 'Dietary Preferences',
    smoking: 'Smoking Habits',
    drinking: 'Drinking Habits',
    cleanliness: 'Cleanliness Standards',
    guestsPolicy: 'Guest Policy',
    petPreference: 'Pet Preferences',
  };
  
  return formatMap[factor] || factor;
}
