import { convertCurrency } from "./currencyConvert";

/* 
    Even though this is a simple function, I've provided some unit test example here to protect against bad inputs.

    Perhaps this function will become more complex in the future?
*/

describe("convertCurrency", () => {
	it("should correctly convert the currency based on the exchange rate", async () => {
		const exchangeRate = 1.2;
		const amount = 100;
		const expectedConvertedAmount = 120;

		const result = await convertCurrency(exchangeRate, amount);

		expect(result).toBe(expectedConvertedAmount);
	});

	it("should return 0 if the amount is 0", async () => {
		const exchangeRate = 1.2;
		const amount = 0;
		const expectedConvertedAmount = 0;

		const result = await convertCurrency(exchangeRate, amount);

		expect(result).toBe(expectedConvertedAmount);
	});

	it("should throw an error if the exchange rate is 0", async () => {
		const exchangeRate = 0;
		const amount = 100;

		await expect(convertCurrency(exchangeRate, amount)).rejects.toThrow(
			"Invalid exchange rate"
		);
	});

	it("should throw an error if the exchange rate is negative", async () => {
		const exchangeRate = -1.2;
		const amount = 100;

		await expect(convertCurrency(exchangeRate, amount)).rejects.toThrow(
			"Invalid exchange rate"
		);
	});

	it("should throw an error if the amount is negative", async () => {
		const exchangeRate = 1.2;
		const amount = -100;

		await expect(convertCurrency(exchangeRate, amount)).rejects.toThrow(
			"Invalid amount"
		);
	});
});
