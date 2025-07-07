import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotationRequests = pgTable("quotation_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  age: text("age"),
  nationality: text("nationality"),
  mainConcern: text("main_concern").array().notNull(),
  desiredResults: text("desired_results").array().notNull(),
  skinType: text("skin_type"),
  skinSensitivity: text("skin_sensitivity").array(),
  previousTreatments: text("previous_treatments"),
  treatmentDetails: text("treatment_details"),
  sideEffects: text("side_effects"),
  sideEffectDetails: text("side_effect_details"),
  medicalHistory: text("medical_history").array(),
  medicationsList: text("medications_list"),
  coldSores: text("cold_sores"),
  retinoids: text("retinoids"),
  retinoidsDate: text("retinoids_date"),
  allergies: text("allergies"),
  allergyDetails: text("allergy_details"),
  sunscreenUse: text("sunscreen_use"),
  smoking: text("smoking"),
  alcohol: text("alcohol"),
  waterIntake: text("water_intake"),
  exercise: text("exercise"),
  preferredDowntime: text("preferred_downtime"),
  effectDuration: text("effect_duration"),
  budgetRange: text("budget_range").notNull(),
  treatmentIntensity: text("treatment_intensity"),
  preferredDuration: text("preferred_duration").notNull(),
  additionalDetails: text("additional_details"),
  language: text("language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  serviceInterest: text("service_interest").notNull(),
  message: text("message").notNull(),
  language: text("language").notNull().default("en"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertQuotationRequestSchema = createInsertSchema(quotationRequests).omit({
  id: true,
  createdAt: true,
});

export const insertContactRequestSchema = createInsertSchema(contactRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertQuotationRequest = z.infer<typeof insertQuotationRequestSchema>;
export type QuotationRequest = typeof quotationRequests.$inferSelect;
export type InsertContactRequest = z.infer<typeof insertContactRequestSchema>;
export type ContactRequest = typeof contactRequests.$inferSelect;
