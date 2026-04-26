import { pgTable, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const siteContentTable = pgTable("site_content", {
  key: varchar("key", { length: 256 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SiteContent = typeof siteContentTable.$inferSelect;
export type InsertSiteContent = typeof siteContentTable.$inferInsert;
