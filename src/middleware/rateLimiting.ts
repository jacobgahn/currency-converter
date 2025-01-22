import db from "../db";
import { requests } from "../db/schema";
import { eq } from "drizzle-orm";
import { isWeekend } from "../utils/datetime";
import { getRequestUser } from "../utils/auth";
import { Request, Response, NextFunction } from "express";
import { REQUEST_LIMIT_WEEKEND, REQUEST_LIMIT_WEEKDAY } from "../constants";
export const shouldRateLimit = (
	userRequestsAmount: number,
	requestDate: Date
) => {
	const isRequestWeekend = isWeekend(requestDate);
	return (
		(isRequestWeekend && userRequestsAmount > REQUEST_LIMIT_WEEKEND) ||
		(!isRequestWeekend && userRequestsAmount > REQUEST_LIMIT_WEEKDAY)
	);
};

export const rateLimiting = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const timezone = (req.headers["x-timezone"] as string) || "UTC";
	const requestDate = new Date(
		new Date().toLocaleString("en-US", {
			timeZone: timezone,
		})
	);

	const user_id = getRequestUser(req);

	const userRequests = await db
		.select()
		.from(requests)
		.where(eq(requests.userId, user_id));

	if (shouldRateLimit(userRequests.length, requestDate)) {
		return res.status(429).json({ error: "Too many requests" });
	}

	next();
};
