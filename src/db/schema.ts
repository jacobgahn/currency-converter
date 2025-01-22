import { sql } from "drizzle-orm";
import { pgTable, integer, text, serial, timestamp } from "drizzle-orm/pg-core";

const requests = pgTable("requests", {
	id: serial("id").primaryKey(),
	userId: text("user_id").notNull(),
	currency: text("currency").notNull(),
	amount: integer("amount").notNull(),
	result: integer("result").notNull(),
	timestamp: timestamp("timestamp").default(sql`CURRENT_TIMESTAMP`),
});

type SelectRequest = typeof requests.$inferSelect;

export { requests, type SelectRequest };
