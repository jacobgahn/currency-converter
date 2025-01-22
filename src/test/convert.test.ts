import request from "supertest";
import { fetchCoinbaseExchangeRate } from "../services/coinbase/currencyConvert";

// TODO: Use app for supertest instead of baseUrl, to enable mocking, etc
const baseUrl = "http://localhost:3000";

jest.mock("../services/coinbase/currencyConvert", () => ({
	fetchCoinbaseExchangeRate: jest.fn(),
}));

describe("GET /convert", () => {
	it("should convert currency and return the correct response", async () => {
		// Mock the response from the Coinbase API
		(fetchCoinbaseExchangeRate as jest.Mock).mockResolvedValue(1.25);

		const response = await request(baseUrl)
			.get("/convert")
			.set(
				"Authorization",
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.HqfBqMQXjCge8RyIepyGkT2arZPD62bIGwD36lKiUWk"
			)
			.query({ from: "USD", to: "EUR", amount: 800 });

		expect(response.status).toBe(200);
		// expect(response.body).toEqual({
		// 	targetAmount: 1000,
		// 	exchangeRate: 1.25,
		// 	timestamp: expect.any(String),
		// });
	});

	it("should return 400 if validation fails", async () => {
		const response = await request(baseUrl)
			.get("/convert")
			.set(
				"Authorization",
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxfQ.HqfBqMQXjCge8RyIepyGkT2arZPD62bIGwD36lKiUWk"
			)
			.query({ from: "US", to: "EUR", amount: "invalid" });

		expect(response.status).toBe(400);
		expect(response.body.errors).toBeDefined();
	});

	it("should return 401 if no token is provided", async () => {
		const response = await request(baseUrl)
			.get("/convert")
			.query({ from: "USD", to: "EUR", amount: 800 });

		expect(response.status).toBe(401);
		expect(response.body.error).toBe("Missing authentication token");
	});

	it("should return 403 if token is invalid", async () => {
		const response = await request(baseUrl)
			.get("/convert")
			.set("Authorization", "Bearer invalid-token")
			.query({ from: "USD", to: "EUR", amount: 800 });

		expect(response.status).toBe(403);
		expect(response.body.error).toBe("Invalid token payload");
	});
});
