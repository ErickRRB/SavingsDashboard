export type Currency = 'ARS' | 'USD';

export const formatMoney = (
  value: number,
  currency: Currency,
  rate: number,
): string => {
  const amount = currency === 'ARS' ? value : value / rate;
  return amount.toLocaleString('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  });
};

export const formatARS = (value: number): string =>
  formatMoney(value, 'ARS', 1);
