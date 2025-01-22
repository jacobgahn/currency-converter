import { Request, Response } from "express";
import { checkSchema, query, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { getConvertedCurrencyAmount } from "../services/coinbase/currencyConvert";
import db from "../db";
import { InsertRequest, requests } from "../db/schema";
var express = require("express");
var router = express.Router();

// Add query parser middleware
router.use(express.urlencoded({ extended: true }));

interface ConvertRequest {
	from: string;
	amount: number;
	to: string;
}

interface ConvertResponse {
	targetAmount: number;
	exchangeRate: number;
	timestamp: Date;
}

const authenticate = async (req: Request, res: Response, next: Function) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ error: "Missing authentication token" });
	}

	try {
		// TODO: validate token against internal user service
		next();
	} catch (error) {
		return res.status(403).json({ error: "Invalid authentication token" });
	}
};

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
	authenticate, // Add auth middleware before validation
	validateConvert,
	async function (req: Request<{}, {}, {}, ConvertRequest>, res: Response) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const from = req.query.from;
		const to = req.query.to;
		const amount = req.query.amount;

		// TODO refactor to use middleware
		const auth = req.headers.authorization;
		const token = auth && auth.split(" ")[1];
		const payload = token && jwt.decode(token);
		if (!payload || typeof payload !== "object" || !("user_id" in payload)) {
			return res.status(403).json({ error: "Invalid token payload" });
		}
		const user_id = Number(payload && payload.user_id);

		// TODO: add rate limiting

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

		const response: ConvertResponse = {
			targetAmount: targetAmount,
			exchangeRate: exchangeRate,
			timestamp: new Date(),
		};

		res.json(response);
	}
);

module.exports = router;
