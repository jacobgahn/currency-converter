import { isWeekend } from "./datetime";

describe("isWeekend", () => {
	it("should return true for Saturday", () => {
		const saturday = new Date("01-25-2025"); // Saturday
		expect(isWeekend(saturday)).toBe(true);
	});

	it("should return true for Sunday", () => {
		const sunday = new Date("01-26-2025"); // Sunday
		expect(isWeekend(sunday)).toBe(true);
	});

	it("should return false for a weekday", () => {
		const monday = new Date("01-27-2025"); // Monday
		expect(isWeekend(monday)).toBe(false);
	});

	it("should return true for the current day if it is a weekend", () => {
		const today = new Date();
		const isTodayWeekend = today.getDay() === 0 || today.getDay() === 6;
		expect(isWeekend(today)).toBe(isTodayWeekend);
	});
});
