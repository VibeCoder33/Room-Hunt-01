import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  numeric,
  uuid
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User profiles with lifestyle preferences
export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  userType: varchar("user_type", { enum: ["room_seeker", "room_owner"] }).notNull(),
  fullName: varchar("full_name").notNull(),
  age: varchar("age").notNull(),
  gender: varchar("gender").notNull(),
  profession: varchar("profession").notNull(),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  preferredLocations: text("preferred_locations").array(),
  sleepSchedule: varchar("sleep_schedule", { enum: ["early_bird", "night_owl", "flexible"] }),
  workSchedule: varchar("work_schedule", { enum: ["regular_office", "remote_work", "night_shift", "student"] }),
  dietaryPreference: varchar("dietary_preference", { enum: ["vegetarian", "non_vegetarian", "vegan", "no_preference"] }),
  smoking: varchar("smoking", { enum: ["non_smoker", "occasional_smoker", "regular_smoker"] }),
  drinking: varchar("drinking", { enum: ["non_drinker", "social_drinker", "regular_drinker"] }),
  cleanliness: varchar("cleanliness", { enum: ["very_clean", "clean_flexible", "moderately_clean", "relaxed"] }),
  guestsPolicy: varchar("guests_policy", { enum: ["guests_welcome", "guests_with_notice", "occasional_guests", "no_guests"] }),
  petPreference: varchar("pet_preference", { enum: ["love_pets", "okay_with_pets", "no_pets"] }),
  stayDuration: varchar("stay_duration", { enum: ["3_6_months", "6_12_months", "1_2_years", "long_term"] }),
  bio: text("bio"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Room listings
export const roomListings = pgTable("room_listings", {
  id: serial("id").primaryKey(),
  ownerId: varchar("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title").notNull(),
  description: text("description"),
  location: varchar("location").notNull(),
  rent: integer("rent").notNull(),
  deposit: integer("deposit"),
  availableFrom: timestamp("available_from"),
  images: text("images").array(),
  amenities: text("amenities").array(),
  houseRules: text("house_rules").array(),
  roomType: varchar("room_type", { enum: ["private", "shared", "studio"] }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Messages between users
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  senderId: varchar("sender_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  receiverId: varchar("receiver_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Compatibility matches
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  seekerId: varchar("seeker_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  ownerId: varchar("owner_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId: integer("listing_id").references(() => roomListings.id, { onDelete: "cascade" }),
  compatibilityScore: numeric("compatibility_score", { precision: 5, scale: 2 }),
  status: varchar("status", { enum: ["pending", "accepted", "rejected", "matched"] }).default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Favorites/saved listings
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  listingId: integer("listing_id").notNull().references(() => roomListings.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  listings: many(roomListings),
  sentMessages: many(messages, { relationName: "sender" }),
  receivedMessages: many(messages, { relationName: "receiver" }),
  seekerMatches: many(matches, { relationName: "seeker" }),
  ownerMatches: many(matches, { relationName: "owner" }),
  favorites: many(favorites),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, {
    fields: [userProfiles.userId],
    references: [users.id],
  }),
}));

export const roomListingsRelations = relations(roomListings, ({ one, many }) => ({
  owner: one(users, {
    fields: [roomListings.ownerId],
    references: [users.id],
  }),
  matches: many(matches),
  favorites: many(favorites),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sender",
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "receiver",
  }),
}));

export const matchesRelations = relations(matches, ({ one }) => ({
  seeker: one(users, {
    fields: [matches.seekerId],
    references: [users.id],
    relationName: "seeker",
  }),
  owner: one(users, {
    fields: [matches.ownerId],
    references: [users.id],
    relationName: "owner",
  }),
  listing: one(roomListings, {
    fields: [matches.listingId],
    references: [roomListings.id],
  }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, {
    fields: [favorites.userId],
    references: [users.id],
  }),
  listing: one(roomListings, {
    fields: [favorites.listingId],
    references: [roomListings.id],
  }),
}));

// Zod schemas
export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRoomListingSchema = createInsertSchema(roomListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type RoomListing = typeof roomListings.$inferSelect;
export type InsertRoomListing = z.infer<typeof insertRoomListingSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
