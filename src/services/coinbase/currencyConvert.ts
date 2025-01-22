export const getConvertedCurrencyAmount = async (
	from: string,
	to: string,
	amount: number
) => {
	const response = await fetch(
		`https://api.coinbase.com/v2/prices/${from}-${to}/buy`
	);
	const data = await response.json();
	const exchangeRate = Number(data.data.amount);
	return {
		targetAmount: exchangeRate * amount,
		exchangeRate: exchangeRate,
	};
};
