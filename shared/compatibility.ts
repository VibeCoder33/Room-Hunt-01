import { UserProfile } from "./schema";

export function calculateCompatibilityScore(
  profile1: UserProfile,
  profile2: UserProfile
): number {
  let totalScore = 0;
  let factors = 0;

  // Sleep schedule compatibility (weight: 15%)
  if (profile1.sleepSchedule && profile2.sleepSchedule) {
    if (profile1.sleepSchedule === profile2.sleepSchedule) {
      totalScore += 15;
    } else if (profile1.sleepSchedule === 'flexible' || profile2.sleepSchedule === 'flexible') {
      totalScore += 12;
    } else {
      totalScore += 5; // early_bird vs night_owl
    }
    factors += 15;
  }

  // Work schedule compatibility (weight: 10%)
  if (profile1.workSchedule && profile2.workSchedule) {
    if (profile1.workSchedule === profile2.workSchedule) {
      totalScore += 10;
    } else {
      totalScore += 6;
    }
    factors += 10;
  }

  // Dietary preference compatibility (weight: 15%)
  if (profile1.dietaryPreference && profile2.dietaryPreference) {
    if (profile1.dietaryPreference === profile2.dietaryPreference) {
      totalScore += 15;
    } else if (profile1.dietaryPreference === 'no_preference' || profile2.dietaryPreference === 'no_preference') {
      totalScore += 12;
    } else {
      totalScore += 8;
    }
    factors += 15;
  }

  // Smoking compatibility (weight: 20%)
  if (profile1.smoking && profile2.smoking) {
    if (profile1.smoking === profile2.smoking) {
      totalScore += 20;
    } else if (profile1.smoking === 'non_smoker' && profile2.smoking !== 'non_smoker') {
      totalScore += 4; // Low compatibility
    } else {
      totalScore += 12;
    }
    factors += 20;
  }

  // Drinking compatibility (weight: 15%)
  if (profile1.drinking && profile2.drinking) {
    if (profile1.drinking === profile2.drinking) {
      totalScore += 15;
    } else {
      totalScore += 10;
    }
    factors += 15;
  }

  // Cleanliness compatibility (weight: 15%)
  if (profile1.cleanliness && profile2.cleanliness) {
    if (profile1.cleanliness === profile2.cleanliness) {
      totalScore += 15;
    } else {
      totalScore += 8;
    }
    factors += 15;
  }

  // Guest policy compatibility (weight: 5%)
  if (profile1.guestsPolicy && profile2.guestsPolicy) {
    if (profile1.guestsPolicy === profile2.guestsPolicy) {
      totalScore += 5;
    } else {
      totalScore += 2;
    }
    factors += 5;
  }

  // Pet preference compatibility (weight: 5%)
  if (profile1.petPreference && profile2.petPreference) {
    if (profile1.petPreference === profile2.petPreference) {
      totalScore += 5;
    } else {
      totalScore += 2;
    }
    factors += 5;
  }

  return factors > 0 ? Math.round((totalScore / factors) * 100) : 50;
}
