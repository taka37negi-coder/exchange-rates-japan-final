import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  fetchExchangeRates,
  convertCurrencies,
  formatCurrencyAmount,
  formatLastUpdateTime,
  TARGET_CURRENCIES,
} from "../exchange-rates";

describe("Exchange Rates", () => {
  describe("convertCurrencies", () => {
    it("should convert JPY to target currencies correctly", () => {
      const jpyAmount = 10000;
      const mockRates = {
        USD: 0.0067,
        EUR: 0.0062,
        KRW: 9.12,
        CNY: 0.049,
        TWD: 0.22,
        GBP: 0.0053,
        AUD: 0.0105,
        MYR: 0.030,
      };

      const conversions = convertCurrencies(jpyAmount, mockRates);

      expect(conversions).toHaveLength(8);
      expect(conversions[0].code).toBe("USD");
      expect(conversions[0].amount).toBe(67);
      expect(conversions[0].symbol).toBe("$");
      expect(conversions[0].flag).toBe("🇺🇸");
    });

    it("should handle missing rates gracefully", () => {
      const jpyAmount = 10000;
      const mockRates = {
        USD: 0.0067,
      };

      const conversions = convertCurrencies(jpyAmount, mockRates);

      expect(conversions).toHaveLength(8);
      // Missing rates should result in 0
      expect(conversions[1].amount).toBe(0);
    });
  });

  describe("formatCurrencyAmount", () => {
    it("should format KRW without decimals", () => {
      const formatted = formatCurrencyAmount(91200, "KRW");
      expect(formatted).toBe("91,200");
    });

    it("should format USD with 2 decimals", () => {
      const formatted = formatCurrencyAmount(67.5, "USD");
      expect(formatted).toBe("67.50");
    });

    it("should format EUR with 2 decimals", () => {
      const formatted = formatCurrencyAmount(62.123, "EUR");
      expect(formatted).toBe("62.12");
    });
  });

  describe("formatLastUpdateTime", () => {
    it("should format recent time in minutes", () => {
      const now = Date.now();
      const fiveMinutesAgo = Math.floor(now / 1000) - 5 * 60;
      const formatted = formatLastUpdateTime(fiveMinutesAgo);
      expect(formatted).toBe("5 minutes ago");
    });

    it("should format time in hours", () => {
      const now = Date.now();
      const twoHoursAgo = Math.floor(now / 1000) - 2 * 60 * 60;
      const formatted = formatLastUpdateTime(twoHoursAgo);
      expect(formatted).toBe("2 hours ago");
    });

    it("should handle singular minute", () => {
      const now = Date.now();
      const oneMinuteAgo = Math.floor(now / 1000) - 60;
      const formatted = formatLastUpdateTime(oneMinuteAgo);
      expect(formatted).toBe("1 minute ago");
    });
  });

  describe("TARGET_CURRENCIES", () => {
    it("should have 8 target currencies", () => {
      expect(TARGET_CURRENCIES).toHaveLength(8);
    });

    it("should include all required currencies", () => {
      const codes = TARGET_CURRENCIES.map((c) => c.code);
      expect(codes).toEqual(["USD", "EUR", "KRW", "CNY", "TWD", "GBP", "AUD", "MYR"]);
    });

    it("should have flag emojis for all currencies", () => {
      TARGET_CURRENCIES.forEach((currency) => {
        expect(currency.flag).toBeTruthy();
        expect(currency.flag.length).toBeGreaterThan(0);
      });
    });
  });

  describe("fetchExchangeRates", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it("should fetch exchange rates successfully", async () => {
      const mockResponse = {
        result: "success",
        provider: "https://www.exchangerate-api.com",
        documentation: "https://www.exchangerate-api.com/docs/free",
        terms_of_use: "https://www.exchangerate-api.com/terms",
        time_last_update_unix: 1234567890,
        time_last_update_utc: "Fri, 13 Feb 2009 23:31:30 +0000",
        time_next_update_unix: 1234654290,
        time_next_update_utc: "Sat, 14 Feb 2009 23:31:30 +0000",
        time_eol_unix: 0,
        base_code: "JPY",
        rates: {
          USD: 0.0067,
          EUR: 0.0062,
          KRW: 9.12,
          CNY: 0.049,
          TWD: 0.22,
          GBP: 0.0053,
          AUD: 0.0105,
          MYR: 0.030,
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchExchangeRates();

      expect(result).toEqual(mockResponse);
      expect(result.result).toBe("success");
      expect(result.base_code).toBe("JPY");
    });

    it("should throw error on failed fetch", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchExchangeRates()).rejects.toThrow();
    });

    it("should throw error on API error result", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          result: "error",
          "error-type": "invalid-key",
        }),
      } as Response);

      await expect(fetchExchangeRates()).rejects.toThrow("API returned error result");
    });
  });
});
