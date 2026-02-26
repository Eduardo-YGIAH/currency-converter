import type { Currency } from "../types/currency";

export const STATIC_RATES: Record<
  Currency,
  Partial<Record<Currency, number>>
> = {
  "Pound sterling": {
    Euro: 1.15,
  },
  Euro: {
    "Pound sterling": 0.87,
  },
};
