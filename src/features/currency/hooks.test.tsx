import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useConversionQuery, useCurrenciesQuery } from "./hooks";
import { convertCurrency, fetchCurrencies } from "./api";

vi.mock("./api", () => ({
  fetchCurrencies: vi.fn(),
  convertCurrency: vi.fn(),
}));

const mockedFetchCurrencies = vi.mocked(fetchCurrencies);
const mockedConvertCurrency = vi.mocked(convertCurrency);

function createWrapper(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

describe("currency hooks performance and cache", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("caches currencies query for one hour", async () => {
    mockedFetchCurrencies.mockResolvedValue([
      { code: "GBP", name: "Pound sterling" },
      { code: "EUR", name: "Euro" },
    ]);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    const wrapper = createWrapper(queryClient);

    const first = renderHook(() => useCurrenciesQuery(), { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();

    const second = renderHook(() => useCurrenciesQuery(), { wrapper });
    await waitFor(() => expect(second.result.current.isSuccess).toBe(true));

    expect(mockedFetchCurrencies).toHaveBeenCalledTimes(1);
  });

  it("does not refetch repeated conversion within cache window", async () => {
    mockedConvertCurrency.mockResolvedValue(1.2);

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    const wrapper = createWrapper(queryClient);

    const first = renderHook(
      () =>
        useConversionQuery({
          amount: 1,
          from: "GBP",
          to: "EUR",
          enabled: true,
        }),
      { wrapper },
    );
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();

    const second = renderHook(
      () =>
        useConversionQuery({
          amount: 1,
          from: "GBP",
          to: "EUR",
          enabled: true,
        }),
      { wrapper },
    );
    await waitFor(() => expect(second.result.current.isSuccess).toBe(true));

    expect(mockedConvertCurrency).toHaveBeenCalledTimes(1);
  });

  it("keeps conversion disabled until inputs are valid", async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    const wrapper = createWrapper(queryClient);

    const result = renderHook(
      () =>
        useConversionQuery({
          amount: Number.NaN,
          from: "GBP",
          to: "EUR",
          enabled: false,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.result.current.isFetching).toBe(false));
    expect(mockedConvertCurrency).not.toHaveBeenCalled();
  });
});
