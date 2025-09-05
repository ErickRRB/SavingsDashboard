export const getNumber = (key: string, def = 0): number => {
  const raw = localStorage.getItem(key);
  return raw !== null && !isNaN(Number(raw)) ? Number(raw) : def;
};

export const setNumber = (key: string, value: number): void => {
  localStorage.setItem(key, String(value));
};

export const getJSON = <T>(key: string, def: T): T => {
  const raw = localStorage.getItem(key);
  if (!raw) return def;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return def;
  }
};

export const setJSON = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};
