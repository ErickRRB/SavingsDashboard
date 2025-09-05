export type Currency = 'ARS' | 'USD';

export const formatMoney = (
  value: number,
  currency: Currency,
  rate: number,
): string => {
  const amount = currency === 'ARS' ? value : value / rate;
  return amount.toLocaleString(
    currency === 'ARS' ? 'es-AR' : 'en-US',
    {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'ARS' ? 0 : 2,
    },
  );
};

export const formatARS = (value: number): string =>
  formatMoney(value, 'ARS', 1);
