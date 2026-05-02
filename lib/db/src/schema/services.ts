import { pgTable, varchar, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const servicesTable = pgTable("services", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  longDescription: text("long_description").notNull().default(""),
  image: text("image").notNull().default(""),
  whyBest: jsonb("why_best").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  icon: text("icon").notNull().default("HardHat"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ServiceRow = typeof servicesTable.$inferSelect;
export type InsertService = typeof servicesTable.$inferInsert;
