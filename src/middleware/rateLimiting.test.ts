import { shouldRateLimit } from "./rateLimiting";

describe("shouldRateLimit", () => {
	it("should return true if userRequestsAmount is greater than 100 on a weekday", () => {
		const result = shouldRateLimit(101, new Date("01-27-2025")); // A Monday
		expect(result).toBe(true);
	});

	it("should return false if userRequestsAmount is 100 or less on a weekday", () => {
		const result = shouldRateLimit(100, new Date("01-27-2025")); // A Monday
		expect(result).toBe(false);
	});

	it("should return true if userRequestsAmount is greater than 200 on a weekend", () => {
		const result = shouldRateLimit(201, new Date("01-26-2025")); // A Saturday
		expect(result).toBe(true);
	});

	it("should return false if userRequestsAmount is 200 or less on a weekend", () => {
		const result = shouldRateLimit(200, new Date("01-26-2025")); // A Saturday
		expect(result).toBe(false);
	});
});
