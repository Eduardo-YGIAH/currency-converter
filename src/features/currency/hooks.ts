import { useQuery } from "@tanstack/react-query";
import { convertCurrency, fetchCurrencies } from "./api";

const ONE_HOUR_MS = 60 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

type UseConversionQueryParams = {
  amount: number;
  from: string;
  to: string;
  enabled: boolean;
};

export function useCurrenciesQuery() {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
    staleTime: ONE_HOUR_MS,
    gcTime: ONE_HOUR_MS,
  });
}

export function useConversionQuery({
  amount,
  from,
  to,
  enabled,
}: UseConversionQueryParams) {
  return useQuery({
    queryKey: ["conversion", from, to, amount],
    queryFn: () =>
      convertCurrency({
        from,
        to,
        amount,
      }),
    enabled,
    staleTime: FIVE_MINUTES_MS,
    gcTime: ONE_HOUR_MS,
  });
}
