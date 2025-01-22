export const fetchCoinbaseExchangeRate = async (
	fromCurrency: string,
	toCurrency: string
) => {
	const response = await fetch(
		`https://api.coinbase.com/v2/prices/${fromCurrency}-${toCurrency}/buy`
	);
	const data = await response.json();
	return Number(data.data.amount);
};

export const convertCurrency = async (exchangeRate: number, amount: number) => {
	if (exchangeRate <= 0) {
		throw new Error("Invalid exchange rate");
	}

	if (amount < 0) {
		throw new Error("Invalid amount");
	}

	try {
		return exchangeRate * amount;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

export const getConvertedCurrencyAmount = async (
	from: string,
	to: string,
	amount: number
) => {
	const exchangeRate = await fetchCoinbaseExchangeRate(from, to);

	return {
		targetAmount: await convertCurrency(exchangeRate, amount),
		exchangeRate: exchangeRate,
	};
};
