export const CURRENCY_SYMBOL = "LKR";

export const formatPrice = (
  value: number | string,
  symbol: string = CURRENCY_SYMBOL
) => {
  if (value === null || value === undefined) return "";
  return `${symbol} ${Number(value).toFixed(2)}`;
};
