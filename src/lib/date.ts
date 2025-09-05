export const currentYearMonth = (): string => {
  return new Date().toISOString().slice(0, 7);
};

export const daysInMonth = (yearMonth: string): number => {
  const [y, m] = yearMonth.split('-').map(Number);
  return new Date(y, m, 0).getDate();
};

export const dateKey = (yearMonth: string, day: number): string => {
  return `${yearMonth}-${String(day).padStart(2, '0')}`;
};

export const weekdayLabel = (key: string): string => {
  const d = new Date(key);
  return d.toLocaleDateString('es-AR', { weekday: 'short' });
};
