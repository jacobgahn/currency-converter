import { currencyFieldValidator } from "../../src/validators/currencyValidator";
import { validationResult, checkSchema } from "express-validator";
import { Request } from "express";

const mockRequest = (query: any): Request =>
	({
		query,
	} as Request);

const runValidation = async (fieldName: string, value: any) => {
	const req = mockRequest({ [fieldName]: value });
	const schema = checkSchema(currencyFieldValidator(fieldName));

	await Promise.all(schema.map((validation) => validation.run(req)));

	return validationResult(req);
};

describe("currencyFieldValidator", () => {
	it("should return an error if currency code is invalid", async () => {
		const result = await runValidation("from", "XYZ");
		expect(result.isEmpty()).toBe(false);
		expect(result.array()[0].msg).toBe(
			"Currency code must be one of the following: USD, EUR, BTC, ETH"
		);
	});

	it.each(["USD", "EUR", "BTC", "ETH"])(
		"should pass validation for a valid currency code: %s",
		async (currency) => {
			const result = await runValidation("from", currency);
			expect(result.isEmpty()).toBe(true);
		}
	);
});
