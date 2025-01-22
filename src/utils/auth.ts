import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConvertRequest } from "../types/requestTypes";

export const getRequestUser = (req: Request | ConvertRequest) => {
	const auth = req.headers.authorization;
	const token = auth && auth.split(" ")[1];
	const payload = token && jwt.decode(token);
	if (!payload || typeof payload !== "object" || !("user_id" in payload)) {
		throw new Error("Invalid token payload");
	}
	const userId = Number(payload && payload.user_id);
	return userId;
};
