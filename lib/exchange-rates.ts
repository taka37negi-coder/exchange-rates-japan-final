/**
 * Exchange Rate API Integration
 * Using ExchangeRate-API free open access endpoint
 * https://www.exchangerate-api.com/docs/free
 */

export interface ExchangeRateResponse {
  result: string;
  provider: string;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: string;
  time_next_update_unix: number;
  time_next_update_utc: string;
  time_eol_unix: number;
  base_code: string;
  rates: Record<string, number>;
}

export interface CurrencyConversion {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  amount: number;
}

// Target currencies for conversion
export const TARGET_CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "KRW", name: "Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾" },
] as const;

const API_ENDPOINT = "https://open.er-api.com/v6/latest/JPY";

/**
 * Fetch exchange rates from JPY to all currencies
 * Caches the result to avoid rate limiting
 */
export async function fetchExchangeRates(): Promise<ExchangeRateResponse> {
  try {
    const response = await fetch(API_ENDPOINT);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ExchangeRateResponse = await response.json();
    
    if (data.result !== "success") {
      throw new Error("API returned error result");
    }
    
    return data;
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error);
    throw error;
  }
}

/**
 * Convert JPY amount to target currencies
 */
export function convertCurrencies(
  jpyAmount: number,
  rates: Record<string, number>
): CurrencyConversion[] {
  return TARGET_CURRENCIES.map((currency) => {
    const rate = rates[currency.code] || 0;
    const amount = jpyAmount * rate;
    
    return {
      code: currency.code,
      name: currency.name,
      symbol: currency.symbol,
      flag: currency.flag,
      amount,
    };
  });
}

/**
 * Format currency amount with appropriate decimal places
 */
export function formatCurrencyAmount(amount: number, currencyCode: string): string {
  // KRW and JPY typically don't use decimal places
  if (currencyCode === "KRW" || currencyCode === "JPY") {
    return Math.round(amount).toLocaleString("en-US");
  }
  
  // Most other currencies use 2 decimal places
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Format the last update time in a human-readable format
 */
export function formatLastUpdateTime(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
