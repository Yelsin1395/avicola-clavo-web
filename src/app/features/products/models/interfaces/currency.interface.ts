const CurrencyMap = {
  PEN: 'S/',
} as const;

export type CurrencyCode = keyof typeof CurrencyMap;
export type CurrencySymbol = (typeof CurrencyMap)[CurrencyCode];
