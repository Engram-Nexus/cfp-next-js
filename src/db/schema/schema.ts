import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

export const clientProfile = sqliteTable("client-profiles", {
  Id: text("id", { length: 256 }).primaryKey(),
  dateCreated: integer("dateCreated", { mode: "number" }).notNull(),
  companyName: text("companyName", { length: 256 }).notNull(),
  website: text("website", { length: 256 }).notNull(),
  linkedinUrl: text("linkedinUrl", { length: 256 }).notNull(),
  tagline: text("tagline", { length: 256 }).notNull(),
  description: text("description", { length: 256 }).notNull(),
  logo: text("logo", { length: 256 }),
  logoR2: text("logoR2", { mode: "json" }),
});

export const visitor = sqliteTable("visitors", {
  Id: text("id", { length: 256 }).primaryKey(),
  dateCreated: integer("dateCreated", { mode: "number" }).notNull(),
  email: text("email", { length: 256 }).notNull(),
  messages: text("messages", { mode: "json" }),
  imageUrls: text("imageUrls", { mode: "json" }),
  firstName: text("firstName", { length: 256 }).notNull(),
  clientProfileId: text("clientProfileId", { length: 256 }).notNull(),
  colors: text("colors", { mode: "json" }),
  assistantId: text("assistantId", { length: 256 }).notNull(),
  threadId: text("threadId", { length: 256 }).notNull(),
  welcomeMessage: text("welcomeMessage", { length: 256 }).notNull(),
  profileImage: text("profileImage", { length: 256 }),
});

export const campaigns = sqliteTable("campaigns", {
  Id: text("id", { length: 256 }).primaryKey(),
  dateCreated: integer("dateCreated", { mode: "number" }).notNull(),
  name: text("name", { length: 256 }),
  description: text("description", { length: 256 }),
});

export const leads = sqliteTable("leads", {
  Id: text("id", { length: 256 }).primaryKey(),
  dateCreated: integer("dateCreated", { mode: "number" }).notNull(),
  firstName: text("firstName", { length: 256 }).notNull(),
  lastName: text("lastName", { length: 256 }).notNull(),
  email: text("email", { length: 256 }).notNull(),
  linkedinUrl: text("linkedinUrl", { length: 256 }).notNull(),
  campaignId: text("campaignId", { length: 256 }),
  linkedinrawProfileId: text("linkedinrawProfileId", { length: 256 }),
});

export const clientRelations = relations(clientProfile, ({ many }) => ({
  visitor: many(visitor),
}));

export const visitorRelations = relations(visitor, ({ one }) => ({
  clientProfileId: one(clientProfile, {
    fields: [visitor.clientProfileId],
    references: [clientProfile.Id],
  }),
}));

export const campaignsRelations = relations(campaigns, ({ many }) => ({
  leads: many(leads),
}));
export const leadsRelations = relations(leads, ({ one }) => ({
  campaignId: one(campaigns, {
    fields: [leads.campaignId],
    references: [campaigns.Id],
  }),
}));

export const insertClientProfileSchema = createInsertSchema(clientProfile);
export const insertVisitorSchema = createInsertSchema(visitor);
export const insertLeadsSchema = createInsertSchema(leads);
