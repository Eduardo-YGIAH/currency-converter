import axios from "axios";
import { z } from "zod";
import type { CurrencyOption } from "../../types/currency";

const CURRENCY_BEACON_BASE_URL = "https://api.currencybeacon.com/v1";

const currenciesResponseSchema = z.object({
  response: z.array(
    z.object({
      short_code: z.string(),
      name: z.string(),
    }),
  ),
});

const convertResponseSchema = z.object({
  response: z.object({
    value: z.coerce.number(),
  }),
});

const currencyApi = axios.create({
  baseURL: CURRENCY_BEACON_BASE_URL,
});

currencyApi.interceptors.request.use((config) => {
  const apiKey = import.meta.env.VITE_CURRENCYBEACON_API_KEY;

  if (!apiKey) {
    throw new Error(
      "Missing CurrencyBeacon API key. Set VITE_CURRENCYBEACON_API_KEY in your environment.",
    );
  }

  return {
    ...config,
    params: {
      ...config.params,
      api_key: apiKey,
    },
  };
});

export async function fetchCurrencies(): Promise<CurrencyOption[]> {
  const { data } = await currencyApi.get("/currencies");
  const parsed = currenciesResponseSchema.parse(data);

  return parsed.response
    .map((currency) => ({
      code: currency.short_code,
      name: currency.name,
    }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

type ConvertCurrencyParams = {
  from: string;
  to: string;
  amount: number;
};

export async function convertCurrency({
  from,
  to,
  amount,
}: ConvertCurrencyParams): Promise<number> {
  const { data } = await currencyApi.get("/convert", {
    params: {
      from,
      to,
      amount,
    },
  });

  const parsed = convertResponseSchema.parse(data);
  return parsed.response.value;
}
