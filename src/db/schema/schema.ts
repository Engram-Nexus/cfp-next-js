import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema,createSelectSchema } from "drizzle-zod"

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
})

export const clientRelations = relations(clientProfile,
  ({many})=>({
    visitor:many(visitor)
  })
)

export const visitorRelations = relations(visitor,
  ({one})=>({
    clientProfileId: one(clientProfile, { fields: [visitor.clientProfileId], references: [clientProfile.Id] }),
  })
)

export const insertClientProfileSchema = createInsertSchema(clientProfile);
export const insertVisitorSchema = createInsertSchema(visitor);