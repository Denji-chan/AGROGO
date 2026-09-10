import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const leads = sqliteTable("agrogo_leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  region: text("region").notNull(),
  service: text("service").notNull(),
  role: text("role").notNull(),
  locale: text("locale").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull(),
});
