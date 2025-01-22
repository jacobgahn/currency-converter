import request from "supertest";
import { getConvertedCurrencyAmount } from "../services/coinbase/currencyConvert";
import jwt from "jsonwebtoken";
import db from "../db";
import { requests } from "../db/schema";
import { eq } from "drizzle-orm";
const app = require("../../app");

// Quick solution for testing within the same database instance
// Assumption is that the user records start at 1 therefore 0 is okay for testing and cleanup
// Improvement would be to use a different database for testing
const mockUserId = 0;
const mockToken = jwt.sign({ user_id: mockUserId }, "secret");

afterEach(async () => {
	await db.delete(requests).where(eq(requests.userId, mockUserId));
});

jest.mock("../services/coinbase/currencyConvert", () => {
	const originalModule = jest.requireActual(
		"../services/coinbase/currencyConvert"
	);

	return {
		__esModule: true,
		...originalModule,
		getConvertedCurrencyAmount: jest.fn(() =>
			Promise.resolve({ targetAmount: 1000.0125, exchangeRate: 1.25 })
		),
	};
});

describe("GET /convert", () => {
	it("should convert currency and return the correct response", async () => {
		const response = await request(app)
			.get("/convert")
			.set("Authorization", `Bearer ${mockToken}`)
			.query({ from: "USD", to: "EUR", amount: 800.01 });

		expect(response.status).toBe(200);
		expect(getConvertedCurrencyAmount).toHaveBeenCalledWith(
			"USD",
			"EUR",
			800.01
		);
		expect(response.body).toEqual({
			targetAmount: 1000.0125,
			exchangeRate: 1.25,
			timestamp: expect.any(String),
		});
	});

	it("should return 400 if validation fails", async () => {
		const response = await request(app)
			.get("/convert")
			.set("Authorization", `Bearer ${mockToken}`)
			.query({ from: "US", to: "EUR", amount: "invalid" });

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it("should return 401 if no token is provided", async () => {
		const response = await request(app)
			.get("/convert")
			.query({ from: "USD", to: "EUR", amount: 800 });

		expect(response.status).toBe(401);
		expect(response.body.error).toBe("Missing authentication token");
	});

	it("should return 403 if token is invalid", async () => {
		const response = await request(app)
			.get("/convert")
			.set("Authorization", "Bearer invalid-token")
			.query({ from: "USD", to: "EUR", amount: 800 });

		expect(response.status).toBe(403);
		expect(response.body.error).toBe("Invalid token payload");
	});

	it("should return 400 if the amount is negative", async () => {
		const response = await request(app)
			.get("/convert")
			.set("Authorization", `Bearer ${mockToken}`)
			.query({ from: "USD", to: "EUR", amount: -800 });
	});

	it("should return 400 if the to currency is not valid", async () => {
		const response = await request(app)
			.get("/convert")
			.set("Authorization", `Bearer ${mockToken}`)
			.query({ from: "USD", to: "BTC", amount: "ABC" });
	});

	it("should return 400 if the from currency is not valid", async () => {
		const response = await request(app)
			.get("/convert")
			.set("Authorization", `Bearer ${mockToken}`)
			.query({ from: "HLO", to: "EUR", amount: 800 });
	});
});
