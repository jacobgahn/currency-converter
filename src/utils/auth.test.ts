import { getRequestUser } from "./auth";
import { Request } from "express";
import jwt from "jsonwebtoken";

describe("getRequestUser", () => {
	it("should return userId when token is valid", () => {
		const mockUserId = 123;
		const mockToken = jwt.sign({ user_id: mockUserId }, "secret");
		const req: Request = {
			headers: {
				authorization: `Bearer ${mockToken}`,
			},
		} as Request;

		const userId = getRequestUser(req);
		expect(userId).toBe(mockUserId);
	});

	it("should throw an error when token is invalid", () => {
		const req: Request = {
			headers: {
				authorization: "Bearer invalidtoken",
			},
		} as Request;

		expect(() => getRequestUser(req)).toThrow("Invalid token payload");
	});

	it("should throw an error when authorization header is missing", () => {
		const req: Request = {
			headers: {},
		} as Request;

		expect(() => getRequestUser(req)).toThrow("Invalid token payload");
	});
});
