import { Request, Response, NextFunction } from "express";
import { getRequestUser } from "../utils/auth";

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Missing authentication token" });
	}

	try {
		// TODO: validate token against internal user service
		try {
			const user = getRequestUser(req);
			next();
		} catch (error) {
			return res.status(403).json({ error: "Invalid token payload" });
		}
	} catch (error) {
		return res.status(403).json({ error: "Invalid authentication token" });
	}
};
