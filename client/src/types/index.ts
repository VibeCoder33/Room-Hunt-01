export interface CompatibilityFactors {
  sleepSchedule: number;
  workSchedule: number;
  dietaryPreference: number;
  smoking: number;
  drinking: number;
  cleanliness: number;
  guestsPolicy: number;
  petPreference: number;
}

export interface CompatibilityResult {
  score: number;
  factors: CompatibilityFactors;
  strengths: string[];
  concerns: string[];
}

export interface ChatMessage {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerImage?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface FilterOptions {
  location: string;
  budgetMin: string;
  budgetMax: string;
  lifestyle: string;
  genderPreference: string;
}
