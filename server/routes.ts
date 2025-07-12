import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import {
  insertUserProfileSchema,
  insertRoomListingSchema,
  insertMessageSchema,
  insertMatchSchema,
  insertFavoriteSchema,
} from "@shared/schema";
import { calculateCompatibilityScore } from "../shared/compatibility";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  // if (process.env.REPL_ID) {
  //   await setupAuth(app);
  // }

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const profile = await storage.getUserProfile(userId);
      res.json({ ...user, profile });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.get("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  app.post("/api/profile", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertUserProfileSchema.parse({
        ...req.body,
        userId,
      });

      const existingProfile = await storage.getUserProfile(userId);
      let profile;

      if (existingProfile) {
        profile = await storage.updateUserProfile(userId, profileData);
      } else {
        profile = await storage.createUserProfile(profileData);
      }

      res.json(profile);
    } catch (error) {
      console.error("Error creating/updating profile:", error);
      res.status(400).json({ message: "Failed to save profile" });
    }
  });

  // Room listing routes
  app.get("/api/listings", async (req, res) => {
    try {
      const { location, budgetMin, budgetMax, userType } = req.query;
      const filters = {
        location: location as string,
        budgetMin: budgetMin ? parseInt(budgetMin as string) : undefined,
        budgetMax: budgetMax ? parseInt(budgetMax as string) : undefined,
        userType: userType as string,
      };

      const listings = await storage.getRoomListings(filters);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const listing = await storage.getRoomListing(id);

      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }

      res.json(listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  app.post("/api/listings", isAuthenticated, async (req: any, res) => {
    try {
      const ownerId = req.user.claims.sub;
      const listingData = insertRoomListingSchema.parse({
        ...req.body,
        ownerId,
      });

      const listing = await storage.createRoomListing(listingData);
      res.json(listing);
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(400).json({ message: "Failed to create listing" });
    }
  });

  app.put("/api/listings/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Verify ownership
      const listing = await storage.getRoomListing(id);
      if (!listing || listing.ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updatedListing = await storage.updateRoomListing(id, req.body);
      res.json(updatedListing);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(400).json({ message: "Failed to update listing" });
    }
  });

  app.delete("/api/listings/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Verify ownership
      const listing = await storage.getRoomListing(id);
      if (!listing || listing.ownerId !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      await storage.deleteRoomListing(id);
      res.json({ message: "Listing deleted successfully" });
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });

  // Message routes
  app.get("/api/conversations", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get(
    "/api/messages/:partnerId",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const partnerId = req.params.partnerId;
        const messages = await storage.getMessages(userId, partnerId);
        res.json(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages" });
      }
    }
  );

  app.post("/api/messages", isAuthenticated, async (req: any, res) => {
    try {
      const senderId = req.user.claims.sub;
      const messageData = insertMessageSchema.parse({
        ...req.body,
        senderId,
      });

      const message = await storage.createMessage(messageData);
      res.json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Failed to send message" });
    }
  });

  app.put(
    "/api/messages/read/:partnerId",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const partnerId = req.params.partnerId;
        await storage.markMessagesAsRead(partnerId, userId);
        res.json({ message: "Messages marked as read" });
      } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ message: "Failed to mark messages as read" });
      }
    }
  );

  // Match routes
  app.get("/api/matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const matches = await storage.getMatches(userId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching matches:", error);
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.post("/api/matches", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { targetUserId, listingId } = req.body;

      // Calculate compatibility score
      const userProfile = await storage.getUserProfile(userId);
      const targetProfile = await storage.getUserProfile(targetUserId);

      if (!userProfile || !targetProfile) {
        return res.status(400).json({ message: "Profiles not found" });
      }

      const compatibilityScore = calculateCompatibilityScore(
        userProfile,
        targetProfile
      );

      const matchData = insertMatchSchema.parse({
        seekerId:
          userProfile.userType === "room_seeker" ? userId : targetUserId,
        ownerId: userProfile.userType === "room_owner" ? userId : targetUserId,
        listingId,
        compatibilityScore: compatibilityScore.toString(),
      });

      const match = await storage.createMatch(matchData);
      res.json(match);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(400).json({ message: "Failed to create match" });
    }
  });

  app.put("/api/matches/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const match = await storage.updateMatch(id, status);
      res.json(match);
    } catch (error) {
      console.error("Error updating match:", error);
      res.status(400).json({ message: "Failed to update match" });
    }
  });

  // Favorite routes
  app.get("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favoriteData = insertFavoriteSchema.parse({
        ...req.body,
        userId,
      });

      const favorite = await storage.addFavorite(favoriteData);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(400).json({ message: "Failed to add favorite" });
    }
  });

  app.delete(
    "/api/favorites/:listingId",
    isAuthenticated,
    async (req: any, res) => {
      try {
        const userId = req.user.claims.sub;
        const listingId = parseInt(req.params.listingId);
        await storage.removeFavorite(userId, listingId);
        res.json({ message: "Favorite removed successfully" });
      } catch (error) {
        console.error("Error removing favorite:", error);
        res.status(500).json({ message: "Failed to remove favorite" });
      }
    }
  );

  // Admin routes
  app.get("/api/admin/users", isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/analytics", isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get("/api/admin/export", isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const { type } = req.query;
      let data;

      switch (type) {
        case "users":
          data = await storage.getAllUsers();
          break;
        case "profiles":
          data = await storage.getAllProfiles();
          break;
        case "listings":
          data = await storage.getAllListings();
          break;
        case "messages":
          data = await storage.getAllMessages();
          break;
        default:
          return res.status(400).json({ message: "Invalid export type" });
      }

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename=${type}.json`);
      res.json(data);
    } catch (error) {
      console.error("Error exporting data:", error);
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  wss.on("connection", (ws: WebSocket, req) => {
    console.log("WebSocket connection established");

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === "new_message") {
          // Broadcast message to receiver
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "message_received",
                  data: message.data,
                })
              );
            }
          });
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });

  return httpServer;
}
