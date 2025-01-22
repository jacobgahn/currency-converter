import { Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { getConvertedCurrencyAmount } from "../services/coinbase/currencyConvert";
import db from "../db";
import { InsertRequest, requests } from "../db/schema";
import { rateLimiting, authenticate } from "../middleware";
import { getRequestUser } from "../utils/auth";
import { ConvertRequest } from "../types/requestTypes";
import { currencyFieldValidator } from "../validators/currencyValidator";

var express = require("express");
var router = express.Router();

export interface ConvertRequestParams {
	from: string;
	amount: number;
	to: string;
}

interface ConvertResponseParams {
	targetAmount: number;
	exchangeRate: number;
	timestamp: Date;
}

export const validateConvert = checkSchema({
	...currencyFieldValidator("from"),
	amount: {
		in: ["query"],
		isFloat: true,
		errorMessage: "Amount must be a valid number",
	},
	...currencyFieldValidator("to"),
});

router.get(
	"/",
	authenticate,
	rateLimiting,
	validateConvert,
	async function (
		req: ConvertRequest,
		res: Response<ConvertResponseParams | { errors: any }>
	) {
		const validationErrors = validationResult(req);
		if (!validationErrors.isEmpty()) {
			res.status(400).json({ errors: validationErrors.array() });
			return;
		}

		const { from, to, amount } = req.query;

		const user_id = getRequestUser(req);

		const { targetAmount, exchangeRate } = await getConvertedCurrencyAmount(
			from,
			to,
			Number(amount)
		);

		const insertRequest: InsertRequest = {
			userId: user_id,
			currency: from,
			amount: amount.toString(),
			convertedAmount: targetAmount.toString(),
			exchangeRate: exchangeRate.toString(),
			timestamp: new Date(),
		};
		await db.insert(requests).values(insertRequest);

		const response: ConvertResponseParams = {
			targetAmount: targetAmount,
			exchangeRate: exchangeRate,
			timestamp: new Date(),
		};

		res.json(response);
	}
);

module.exports = router;
