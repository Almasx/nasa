import { pgTable, text, jsonb } from "drizzle-orm/pg-core";

export const fields = pgTable("fields", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  cropType: text("crop_type"),
  coordinates: jsonb("coordinates").notNull(),
});
