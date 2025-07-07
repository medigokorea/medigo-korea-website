import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuotationRequestSchema, insertContactRequestSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

// Admin password from environment variable
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Validate admin password is set
if (!ADMIN_PASSWORD) {
  console.error("ADMIN_PASSWORD environment variable is not set. Admin login will be disabled.");
  process.exit(1);
}

// Session configuration
const PgSession = connectPgSimple(session);

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (req.session && req.session.isAdmin) {
    return next();
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || "medigo-admin-secret-2025",
    resave: false,
    saveUninitialized: true, // Changed to true for testing
    cookie: {
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Admin login endpoint
  app.post("/api/admin/login", async (req: any, res) => {
    try {
      const { password } = req.body;
      
      if (!password) {
        return res.status(400).json({ message: "Password is required" });
      }
      
      if (password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        return res.json({ message: "Login successful" });
      } else {
        return res.status(401).json({ message: "Invalid password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Admin logout endpoint
  app.post("/api/admin/logout", async (req: any, res) => {
    try {
      if (req.session) {
        req.session.destroy((err: any) => {
          if (err) {
            return res.status(500).json({ message: "Could not log out" });
          }
          res.clearCookie('connect.sid');
          return res.json({ message: "Logout successful" });
        });
      } else {
        return res.json({ message: "No session found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Check admin authentication status
  app.get("/api/admin/status", async (req: any, res) => {
    try {
      if (req.session && req.session.isAdmin) {
        return res.json({ isAuthenticated: true });
      } else {
        return res.json({ isAuthenticated: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Quotation request endpoint
  app.post("/api/quotation-requests", async (req, res) => {
    try {
      const requestData = insertQuotationRequestSchema.parse(req.body);
      const quotationRequest = await storage.createQuotationRequest(requestData);
      res.json(quotationRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Contact request endpoint
  app.post("/api/contact-requests", async (req, res) => {
    try {
      const requestData = insertContactRequestSchema.parse(req.body);
      const contactRequest = await storage.createContactRequest(requestData);
      res.json(contactRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get quotation requests (for admin purposes) - protected
  app.get("/api/quotation-requests", requireAuth, async (req, res) => {
    try {
      const requests = await storage.getQuotationRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get contact requests (for admin purposes) - protected
  app.get("/api/contact-requests", requireAuth, async (req, res) => {
    try {
      const requests = await storage.getContactRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update contact request status - protected
  app.patch("/api/contact-requests/:id/status", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!id || !status) {
        res.status(400).json({ message: "ID and status are required" });
        return;
      }
      
      const updatedRequest = await storage.updateContactRequestStatus(id, status);
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
