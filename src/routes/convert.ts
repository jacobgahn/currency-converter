import { Response } from "express";
import { checkSchema, validationResult } from "express-validator";
import { getConvertedCurrencyAmount } from "../services/coinbase/currencyConvert";
import db from "../db";
import { InsertRequest, requests } from "../db/schema";
import { rateLimiting, authenticate } from "../middleware";
import { getRequestUser } from "../utils/auth";
import { ConvertRequest } from "../types/requestTypes";

var express = require("express");
var router = express.Router();

// Add query parser middleware
router.use(express.urlencoded({ extended: true }));

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

const validateConvert = checkSchema({
	from: {
		in: ["query"],
		isString: true,
		isLength: {
			options: { min: 3, max: 3 },
			errorMessage: "Currency code must be 3 characters (e.g. USD, EUR, BTC)",
		},
	},
	amount: {
		in: ["query"],
		isNumeric: true,
		errorMessage: "Amount must be a valid number",
		toFloat: true,
	},
	to: {
		in: ["query"],
		isString: true,
		isLength: {
			options: { min: 3, max: 3 },
			errorMessage: "Currency code must be 3 characters (e.g. USD, EUR, BTC)",
		},
	},
});

router.get(
	"/",
	authenticate,
	rateLimiting,
	validateConvert,
	async function (req: ConvertRequest, res: Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const from = req.query.from;
		const to = req.query.to;
		const amount = req.query.amount;

		const user_id = getRequestUser(req);

		const { targetAmount, exchangeRate } = await getConvertedCurrencyAmount(
			from,
			to,
			amount
		);

		const insertRequest: InsertRequest = {
			userId: user_id,
			currency: from,
			amount: amount,
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
