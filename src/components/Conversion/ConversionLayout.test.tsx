import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ConversionLayout } from "./ConversionLayout";
import { useConversionQuery, useCurrenciesQuery } from "../../features/currency/hooks";
import { text } from "../../config/text";
import { formatUtcTimestamp } from "../../utils/formatUtcTimestamp";

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

describe("ConversionLayout API and query state", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupQueries();
  });

  afterEach(() => {
    cleanup();
  });

  it("shows loading state while fetching currencies", () => {
    mockedUseCurrenciesQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      dataUpdatedAt: 0,
    } as never);

    mockedUseConversionQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: false,
      dataUpdatedAt: 0,
    } as never);

    render(<ConversionLayout />);

    expect(screen.getByText(text.loadingRatesLabel)).toBeInTheDocument();
    expect(screen.getAllByRole("combobox")[0]).toBeDisabled();
  });

  it("shows loading state while fetching conversion", () => {
    mockedUseCurrenciesQuery.mockReturnValue({
      data: defaultCurrencies,
      isLoading: false,
      isError: false,
      dataUpdatedAt: 1_772_444_749_000,
    } as never);

    mockedUseConversionQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
      isError: false,
      dataUpdatedAt: 0,
    } as never);

    render(<ConversionLayout />);

    expect(screen.getByText(text.loadingRatesLabel)).toBeInTheDocument();
  });

  it("shows error state when currencies request fails", () => {
    mockedUseCurrenciesQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      dataUpdatedAt: 0,
    } as never);

    mockedUseConversionQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: false,
      dataUpdatedAt: 0,
    } as never);

    render(<ConversionLayout />);

    expect(screen.getByRole("alert")).toHaveTextContent(text.ratesFetchErrorLabel);
  });

  it("shows error state when conversion request fails", () => {
    mockedUseCurrenciesQuery.mockReturnValue({
      data: defaultCurrencies,
      isLoading: false,
      isError: false,
      dataUpdatedAt: 1_772_444_749_000,
    } as never);

    mockedUseConversionQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: true,
      dataUpdatedAt: 0,
    } as never);

    render(<ConversionLayout />);

    expect(screen.getByRole("alert")).toHaveTextContent(text.ratesFetchErrorLabel);
  });

  it("updates timestamp using latest successful query timestamp", () => {
    const currenciesTimestamp = 1_772_444_749_000;
    let conversionTimestamp = 1_772_444_749_000;

    mockedUseCurrenciesQuery.mockImplementation(
      () =>
        ({
          data: defaultCurrencies,
          isLoading: false,
          isError: false,
          dataUpdatedAt: currenciesTimestamp,
        }) as never,
    );

    mockedUseConversionQuery.mockImplementation(
      ({ amount }) =>
        ({
          data: amount * (conversionRates.GBP_EUR ?? 1),
          isFetching: false,
          isError: false,
          dataUpdatedAt: conversionTimestamp,
        }) as never,
    );

    const { rerender } = render(<ConversionLayout />);

    const firstExpectedMeta = text.metaTemplate
      .replace("{timestamp}", formatUtcTimestamp(conversionTimestamp))
      .replace("{disclaimer}", text.disclaimerLabel);
    expect(screen.getByText(firstExpectedMeta)).toBeInTheDocument();

    conversionTimestamp = 1_772_450_000_000;
    rerender(<ConversionLayout />);

    const secondExpectedMeta = text.metaTemplate
      .replace("{timestamp}", formatUtcTimestamp(conversionTimestamp))
      .replace("{disclaimer}", text.disclaimerLabel);
    expect(screen.getByText(secondExpectedMeta)).toBeInTheDocument();
  });
});
