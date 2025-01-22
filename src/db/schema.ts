import { sql } from "drizzle-orm";
import {
	pgTable,
	integer,
	text,
	serial,
	timestamp,
	numeric,
} from "drizzle-orm/pg-core";

const requests = pgTable("requests", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").notNull(),
	currency: text("currency").notNull(),
	amount: integer("amount").notNull(),
	convertedAmount: numeric("converted_amount").notNull(),
	exchangeRate: numeric("exchange_rate").notNull(),
	timestamp: timestamp("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

type SelectRequest = typeof requests.$inferSelect;
type InsertRequest = typeof requests.$inferInsert;

export { requests, type SelectRequest, type InsertRequest };
