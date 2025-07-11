import {
  users,
  userProfiles,
  roomListings,
  messages,
  matches,
  favorites,
  type User,
  type UpsertUser,
  type UserProfile,
  type InsertUserProfile,
  type RoomListing,
  type InsertRoomListing,
  type Message,
  type InsertMessage,
  type Match,
  type InsertMatch,
  type Favorite,
  type InsertFavorite,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Profile operations
  getUserProfile(userId: string): Promise<UserProfile | undefined>;
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile>;
  
  // Room listing operations
  getRoomListings(filters?: {
    location?: string;
    budgetMin?: number;
    budgetMax?: number;
    userType?: string;
  }): Promise<RoomListing[]>;
  getRoomListing(id: number): Promise<RoomListing | undefined>;
  createRoomListing(listing: InsertRoomListing): Promise<RoomListing>;
  updateRoomListing(id: number, listing: Partial<InsertRoomListing>): Promise<RoomListing>;
  deleteRoomListing(id: number): Promise<void>;
  
  // Message operations
  getMessages(userId1: string, userId2: string): Promise<Message[]>;
  getConversations(userId: string): Promise<any[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
  
  // Match operations
  getMatches(userId: string): Promise<Match[]>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, status: string): Promise<Match>;
  
  // Favorite operations
  getFavorites(userId: string): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: string, listingId: number): Promise<void>;
  
  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllProfiles(): Promise<UserProfile[]>;
  getAllListings(): Promise<RoomListing[]>;
  getAllMessages(): Promise<Message[]>;
  getAnalytics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Profile operations
  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId));
    return profile;
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const [newProfile] = await db
      .insert(userProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateUserProfile(userId: string, profile: Partial<InsertUserProfile>): Promise<UserProfile> {
    const [updatedProfile] = await db
      .update(userProfiles)
      .set({ ...profile, updatedAt: new Date() })
      .where(eq(userProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }

  // Room listing operations
  async getRoomListings(filters?: {
    location?: string;
    budgetMin?: number;
    budgetMax?: number;
    userType?: string;
  }): Promise<RoomListing[]> {
    let query = db.select().from(roomListings).where(eq(roomListings.isActive, true));
    
    if (filters) {
      const conditions = [];
      if (filters.location) {
        conditions.push(ilike(roomListings.location, `%${filters.location}%`));
      }
      if (filters.budgetMin) {
        conditions.push(sql`${roomListings.rent} >= ${filters.budgetMin}`);
      }
      if (filters.budgetMax) {
        conditions.push(sql`${roomListings.rent} <= ${filters.budgetMax}`);
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }
    
    return query.orderBy(desc(roomListings.createdAt));
  }

  async getRoomListing(id: number): Promise<RoomListing | undefined> {
    const [listing] = await db
      .select()
      .from(roomListings)
      .where(eq(roomListings.id, id));
    return listing;
  }

  async createRoomListing(listing: InsertRoomListing): Promise<RoomListing> {
    const [newListing] = await db
      .insert(roomListings)
      .values(listing)
      .returning();
    return newListing;
  }

  async updateRoomListing(id: number, listing: Partial<InsertRoomListing>): Promise<RoomListing> {
    const [updatedListing] = await db
      .update(roomListings)
      .set({ ...listing, updatedAt: new Date() })
      .where(eq(roomListings.id, id))
      .returning();
    return updatedListing;
  }

  async deleteRoomListing(id: number): Promise<void> {
    await db
      .update(roomListings)
      .set({ isActive: false })
      .where(eq(roomListings.id, id));
  }

  // Message operations
  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
          and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
        )
      )
      .orderBy(messages.createdAt);
  }

  async getConversations(userId: string): Promise<any[]> {
    const conversations = await db
      .select({
        id: messages.id,
        senderId: messages.senderId,
        receiverId: messages.receiverId,
        content: messages.content,
        isRead: messages.isRead,
        createdAt: messages.createdAt,
        senderName: sql`COALESCE(${users.firstName} || ' ' || ${users.lastName}, ${users.email})`,
        senderImage: users.profileImageUrl,
      })
      .from(messages)
      .leftJoin(users, eq(messages.senderId, users.id))
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    // Group by conversation partner
    const conversationMap = new Map();
    conversations.forEach((msg) => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partnerId,
          partnerName: msg.senderName,
          partnerImage: msg.senderImage,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
        });
      }
      
      if (msg.receiverId === userId && !msg.isRead) {
        conversationMap.get(partnerId).unreadCount++;
      }
    });

    return Array.from(conversationMap.values());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await db
      .update(messages)
      .set({ isRead: true })
      .where(
        and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId))
      );
  }

  // Match operations
  async getMatches(userId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(or(eq(matches.seekerId, userId), eq(matches.ownerId, userId)))
      .orderBy(desc(matches.createdAt));
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db
      .insert(matches)
      .values(match)
      .returning();
    return newMatch;
  }

  async updateMatch(id: number, status: string): Promise<Match> {
    const [updatedMatch] = await db
      .update(matches)
      .set({ status, updatedAt: new Date() })
      .where(eq(matches.id, id))
      .returning();
    return updatedMatch;
  }

  // Favorite operations
  async getFavorites(userId: string): Promise<Favorite[]> {
    return await db
      .select()
      .from(favorites)
      .where(eq(favorites.userId, userId))
      .orderBy(desc(favorites.createdAt));
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }

  async removeFavorite(userId: string, listingId: number): Promise<void> {
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.listingId, listingId))
      );
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    return await db.select().from(userProfiles).orderBy(desc(userProfiles.createdAt));
  }

  async getAllListings(): Promise<RoomListing[]> {
    return await db.select().from(roomListings).orderBy(desc(roomListings.createdAt));
  }

  async getAllMessages(): Promise<Message[]> {
    return await db.select().from(messages).orderBy(desc(messages.createdAt));
  }

  async getAnalytics(): Promise<any> {
    const [userCount] = await db.select({ count: sql`count(*)` }).from(users);
    const [activeListingCount] = await db
      .select({ count: sql`count(*)` })
      .from(roomListings)
      .where(eq(roomListings.isActive, true));
    const [matchCount] = await db
      .select({ count: sql`count(*)` })
      .from(matches)
      .where(eq(matches.status, "matched"));

    return {
      totalUsers: userCount.count,
      activeListings: activeListingCount.count,
      successfulMatches: matchCount.count,
    };
  }
}

export const storage = new DatabaseStorage();
