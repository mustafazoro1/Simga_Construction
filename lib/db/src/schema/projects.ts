import { pgTable, varchar, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const projectsTable = pgTable("projects", {
  id: varchar("id", { length: 64 }).primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull().default("Other"),
  status: text("status").notNull().default("Upcoming"),
  employer: text("employer").notNull().default("N/A"),
  originalContractValue: text("original_contract_value").notNull().default("N/A"),
  subcontractingAmount: text("subcontracting_amount").notNull().default("N/A"),
  awarded: text("awarded").notNull().default("N/A"),
  completed: text("completed").notNull().default("N/A"),
  scopeNote: text("scope_note"),
  hero: text("hero").notNull().default(""),
  gallery: jsonb("gallery").$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ProjectRow = typeof projectsTable.$inferSelect;
export type InsertProject = typeof projectsTable.$inferInsert;
