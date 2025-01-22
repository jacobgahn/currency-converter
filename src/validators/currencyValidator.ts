import { Schema } from "express-validator";
import { VALID_CURRENCIES } from "../constants";

export const currencyFieldValidator = (fieldName: string): Schema => ({
	[fieldName]: {
		in: ["query"],
		isString: true,
		isLength: {
			options: { min: 3, max: 3 },
			errorMessage: "Invalid currency code",
		},
		custom: {
			options: (value: string) => VALID_CURRENCIES.includes(value),
			errorMessage:
				"Currency code must be one of the following: USD, EUR, BTC, ETH",
		},
	},
});
