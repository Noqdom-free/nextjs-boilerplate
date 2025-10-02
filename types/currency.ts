// Top 20 most used currencies worldwide
export enum Currency {
  USD = 'USD', // United States Dollar
  EUR = 'EUR', // Euro
  GBP = 'GBP', // British Pound Sterling
  JPY = 'JPY', // Japanese Yen
  CNY = 'CNY', // Chinese Yuan
  AUD = 'AUD', // Australian Dollar
  CAD = 'CAD', // Canadian Dollar
  CHF = 'CHF', // Swiss Franc
  HKD = 'HKD', // Hong Kong Dollar
  SGD = 'SGD', // Singapore Dollar
  SEK = 'SEK', // Swedish Krona
  KRW = 'KRW', // South Korean Won
  NOK = 'NOK', // Norwegian Krone
  NZD = 'NZD', // New Zealand Dollar
  INR = 'INR', // Indian Rupee
  MXN = 'MXN', // Mexican Peso
  ZAR = 'ZAR', // South African Rand
  BRL = 'BRL', // Brazilian Real
  TRY = 'TRY', // Turkish Lira
  RUB = 'RUB', // Russian Ruble
}

export interface CurrencyInfo {
  code: Currency;
  name: string;
  symbol: string;
  locale: string; // For Intl.NumberFormat
}

export const CURRENCY_INFO: Record<Currency, CurrencyInfo> = {
  [Currency.USD]: { code: Currency.USD, name: 'US Dollar', symbol: '$', locale: 'en-US' },
  [Currency.EUR]: { code: Currency.EUR, name: 'Euro', symbol: '€', locale: 'de-DE' },
  [Currency.GBP]: { code: Currency.GBP, name: 'British Pound', symbol: '£', locale: 'en-GB' },
  [Currency.JPY]: { code: Currency.JPY, name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
  [Currency.CNY]: { code: Currency.CNY, name: 'Chinese Yuan', symbol: '¥', locale: 'zh-CN' },
  [Currency.AUD]: { code: Currency.AUD, name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
  [Currency.CAD]: { code: Currency.CAD, name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
  [Currency.CHF]: { code: Currency.CHF, name: 'Swiss Franc', symbol: 'CHF', locale: 'de-CH' },
  [Currency.HKD]: { code: Currency.HKD, name: 'Hong Kong Dollar', symbol: 'HK$', locale: 'en-HK' },
  [Currency.SGD]: { code: Currency.SGD, name: 'Singapore Dollar', symbol: 'S$', locale: 'en-SG' },
  [Currency.SEK]: { code: Currency.SEK, name: 'Swedish Krona', symbol: 'kr', locale: 'sv-SE' },
  [Currency.KRW]: { code: Currency.KRW, name: 'South Korean Won', symbol: '₩', locale: 'ko-KR' },
  [Currency.NOK]: { code: Currency.NOK, name: 'Norwegian Krone', symbol: 'kr', locale: 'nb-NO' },
  [Currency.NZD]: { code: Currency.NZD, name: 'New Zealand Dollar', symbol: 'NZ$', locale: 'en-NZ' },
  [Currency.INR]: { code: Currency.INR, name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  [Currency.MXN]: { code: Currency.MXN, name: 'Mexican Peso', symbol: '$', locale: 'es-MX' },
  [Currency.ZAR]: { code: Currency.ZAR, name: 'South African Rand', symbol: 'R', locale: 'en-ZA' },
  [Currency.BRL]: { code: Currency.BRL, name: 'Brazilian Real', symbol: 'R$', locale: 'pt-BR' },
  [Currency.TRY]: { code: Currency.TRY, name: 'Turkish Lira', symbol: '₺', locale: 'tr-TR' },
  [Currency.RUB]: { code: Currency.RUB, name: 'Russian Ruble', symbol: '₽', locale: 'ru-RU' },
};

// Helper function to get currency info
export function getCurrencyInfo(currency: Currency): CurrencyInfo {
  return CURRENCY_INFO[currency];
}

// Get all currencies as array for selector
export function getAllCurrencies(): CurrencyInfo[] {
  return Object.values(CURRENCY_INFO);
}
