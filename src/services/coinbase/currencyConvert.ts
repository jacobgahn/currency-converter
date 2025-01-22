export const fetchCoinbaseExchangeRate = async (
	fromCurrency: string,
	toCurrency: string
) => {
	const response = await fetch(
		`https://api.coinbase.com/v2/prices/${fromCurrency}-${toCurrency}/buy`
	);
	const data = await response.json();
	console.log(data);
	return Number(data.data.amount);
};

export const getConvertedCurrencyAmount = async (
	from: string,
	to: string,
	amount: number
) => {
	// TODO move to fetch method
	const exchangeRate = await fetchCoinbaseExchangeRate(from, to);

	return {
		targetAmount: exchangeRate * amount,
		exchangeRate: exchangeRate,
	};
};
