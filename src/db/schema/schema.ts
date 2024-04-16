import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const customers = sqliteTable("Customers", {
  // id is set on insert, incrementing
  CustomerId: integer("CustomerId", { mode: "number" }).primaryKey({ autoIncrement: true }),

  // title of the blog post
  CompanyName: text("CompanyName", { length: 256 }).notNull(),

  // content of the blog post
  ContactName: text("ContactName", { length: 256 }).notNull(),

  // timestamp is set on insert
  //   timestamp: text('timestamp')
  //     .default(sql`CURRENT_TIMESTAMP`)
  //     .notNull(),
});

export const clientProfile = sqliteTable("client-profiles", {
  // id is set on insert, incrementing
  Id: text("Id", { length: 256 }).primaryKey(),
  dateCreated: text("dateCreated")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  companyName: text("companyName", { length: 256 }).notNull(),
  website: text("website", { length: 256 }).notNull(),
  linkedinUrl: text("linkedinUrl", { length: 256 }).notNull(),
  tagline: text("tagline", { length: 256 }).notNull(),
  description: text("description", { length: 256 }).notNull(),
  logo: text("logo", { length: 256 }),
  logoR2: text("logoR2", { mode: "json" }),
});
