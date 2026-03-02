import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConversionLayout } from "./ConversionLayout";
import { useConversionQuery, useCurrenciesQuery } from "../../features/currency/hooks";

vi.mock("../../features/currency/hooks", () => ({
  useCurrenciesQuery: vi.fn(),
  useConversionQuery: vi.fn(),
}));

const mockedUseCurrenciesQuery = vi.mocked(useCurrenciesQuery);
const mockedUseConversionQuery = vi.mocked(useConversionQuery);

const defaultCurrencies = [
  { code: "GBP", name: "Pound sterling" },
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "US Dollar" },
];

const conversionRates: Record<string, number> = {
  GBP_EUR: 1.2,
  USD_EUR: 0.9,
  GBP_USD: 1.3,
};

function setupQueries(currencies = defaultCurrencies) {
  mockedUseCurrenciesQuery.mockReturnValue({
    data: currencies,
    isLoading: false,
    isError: false,
    dataUpdatedAt: 1_772_444_749_000,
  } as never);

  mockedUseConversionQuery.mockImplementation(({ amount, from, to, enabled }) => {
    if (!enabled) {
      return {
        data: undefined,
        isFetching: false,
        isError: false,
        dataUpdatedAt: 1_772_444_749_000,
      } as never;
    }

    const rate = conversionRates[`${from}_${to}`] ?? 1;

    return {
      data: amount * rate,
      isFetching: false,
      isError: false,
      dataUpdatedAt: 1_772_444_749_000,
    } as never;
  });
}

describe("ConversionLayout functional behaviour", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupQueries();
  });

  afterEach(() => {
    cleanup();
  });

  it("populates both currency dropdowns from API data", () => {
    render(<ConversionLayout />);

    expect(screen.getAllByRole("option", { name: "US Dollar" })).toHaveLength(2);
    expect(screen.getAllByRole("option", { name: "Pound sterling" })).toHaveLength(2);
    expect(screen.getAllByRole("option", { name: "Euro" })).toHaveLength(2);
  });

  it("updates conversion when amount changes", async () => {
    const user = userEvent.setup();
    render(<ConversionLayout />);

    const amountInput = screen.getAllByRole("textbox")[0];
    await user.clear(amountInput);
    await user.type(amountInput, "2");

    expect(screen.getByText("2.40 Euro")).toBeInTheDocument();
  });

  it("updates conversion when from currency changes", async () => {
    const user = userEvent.setup();
    render(<ConversionLayout />);

    const fromSelect = screen.getAllByRole("combobox")[0];
    await user.selectOptions(fromSelect, "USD");

    expect(screen.getByText("0.90 Euro")).toBeInTheDocument();
  });

  it("updates conversion when to currency changes", async () => {
    const user = userEvent.setup();
    render(<ConversionLayout />);

    const toSelect = screen.getAllByRole("combobox")[1];
    await user.selectOptions(toSelect, "USD");

    expect(screen.getByText("1.30 US Dollar")).toBeInTheDocument();
  });

  it("returns input amount when from and to resolve to same currency", () => {
    setupQueries([{ code: "GBP", name: "Pound sterling" }]);
    render(<ConversionLayout />);

    expect(screen.getByText("1.00 Pound sterling")).toBeInTheDocument();
    const lastCallArgs = mockedUseConversionQuery.mock.lastCall?.[0];
    expect(lastCallArgs?.enabled).toBe(false);
  });

  it("does not trigger conversion when input is invalid", async () => {
    const user = userEvent.setup();
    render(<ConversionLayout />);

    const amountInput = screen.getAllByRole("textbox")[0];
    await user.clear(amountInput);
    await user.type(amountInput, "abc");

    await waitFor(() => {
      const lastCallArgs = mockedUseConversionQuery.mock.lastCall?.[0];
      expect(lastCallArgs?.enabled).toBe(false);
    });
  });
});
