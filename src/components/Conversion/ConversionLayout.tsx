import { useMemo, useState } from "react";
import styles from "./ConversionLayout.module.css";
import { text } from "../../config/text";
import { CurrencyInputRow } from "./CurrencyInputRow";
import type { Currency, CurrencySelectOption } from "../../types/currency";
import { formatAmount } from "../../utils/formatAmount";
import { formatUtcTimestamp } from "../../utils/formatUtcTimestamp";
import { useConversionQuery, useCurrenciesQuery } from "../../features/currency/hooks";

export function ConversionLayout() {
  const [fromAmount, setFromAmount] = useState(text.defaultAmount);

  const [fromCurrency, setFromCurrency] = useState<Currency>(
    text.defaultFromCurrencyCode,
  );
  const [toCurrency, setToCurrency] = useState<Currency>(
    text.defaultToCurrencyCode,
  );

  const currenciesQuery = useCurrenciesQuery();

  const currencyOptions = useMemo<CurrencySelectOption[]>(
    () =>
      currenciesQuery.data?.map(({ code, name }) => ({ value: code, label: name })) ?? [
        {
          value: text.defaultFromCurrencyCode,
          label: text.defaultFromCurrencyLabel,
        },
        {
          value: text.defaultToCurrencyCode,
          label: text.defaultToCurrencyLabel,
        },
      ],
    [currenciesQuery.data],
  );

  const availableCurrencies = useMemo(
    () => currencyOptions.map(({ value }) => value),
    [currencyOptions],
  );

  const currencyLabelsByCode = useMemo(
    () => new Map(currencyOptions.map(({ value, label }) => [value, label])),
    [currencyOptions],
  );

  const resolvedFromCurrency = availableCurrencies.includes(fromCurrency)
    ? fromCurrency
    : (availableCurrencies[0] ?? text.defaultFromCurrencyCode);

  const resolvedToCurrency = availableCurrencies.includes(toCurrency)
    ? toCurrency
    : (availableCurrencies.find((code) => code !== resolvedFromCurrency) ??
      resolvedFromCurrency);

  const resolvedFromLabel =
    currencyLabelsByCode.get(resolvedFromCurrency) ?? resolvedFromCurrency;
  const resolvedToLabel =
    currencyLabelsByCode.get(resolvedToCurrency) ?? resolvedToCurrency;

  const numericFrom = Number(fromAmount);
  const hasValidAmount = fromAmount.trim() !== "" && Number.isFinite(numericFrom);
  const shouldConvert =
    hasValidAmount && resolvedFromCurrency !== resolvedToCurrency;

  const conversionQuery = useConversionQuery({
    amount: numericFrom,
    from: resolvedFromCurrency,
    to: resolvedToCurrency,
    enabled: shouldConvert,
  });

  const converted = hasValidAmount
    ? resolvedFromCurrency === resolvedToCurrency
      ? numericFrom
      : (conversionQuery.data ?? 0)
    : 0;

  const formatted = formatAmount(converted);

  const title = text.titleTemplate
    .replace("{amount}", fromAmount)
    .replace("{from}", resolvedFromLabel);

  const isLoading = currenciesQuery.isLoading || conversionQuery.isFetching;
  const hasAnyError = currenciesQuery.isError || conversionQuery.isError;
  const lastUpdatedAt =
    conversionQuery.dataUpdatedAt || currenciesQuery.dataUpdatedAt;

  const disclaimerMeta = text.metaTemplate.replace(
    "{disclaimer}",
    text.disclaimerLabel,
  );

  const meta = isLoading
    ? text.loadingRatesLabel
    : lastUpdatedAt > 0
      ? disclaimerMeta.replace("{timestamp}", formatUtcTimestamp(lastUpdatedAt))
      : disclaimerMeta.replace("{timestamp}", text.timestampUnavailableLabel);

  const handleFromCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === resolvedToCurrency) {
      setToCurrency(resolvedFromCurrency);
      setFromCurrency(resolvedToCurrency);
    } else {
      setFromCurrency(newCurrency);
    }
  };

  const handleToCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === resolvedFromCurrency) {
      setFromCurrency(resolvedToCurrency);
      setToCurrency(resolvedFromCurrency);
    } else {
      setToCurrency(newCurrency);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.value}>
        {formatted} {resolvedToLabel}
      </div>

      <div className={styles.meta} aria-live="polite">
        {meta}
      </div>

      <CurrencyInputRow
        amount={fromAmount}
        currency={resolvedFromCurrency}
        onAmountChange={setFromAmount}
        onCurrencyChange={handleFromCurrencyChange}
        currencies={currencyOptions}
        amountLabel={text.amountLabelTemplate.replace("{currency}", resolvedFromLabel)}
        currencyLabel={text.fromCurrencyLabel}
        disabled={currenciesQuery.isLoading}
      />

      <CurrencyInputRow
        amount={formatted}
        currency={resolvedToCurrency}
        onAmountChange={() => {}}
        onCurrencyChange={handleToCurrencyChange}
        currencies={currencyOptions}
        amountLabel={text.convertedAmountLabelTemplate.replace(
          "{currency}",
          resolvedToLabel,
        )}
        currencyLabel={text.toCurrencyLabel}
        readOnly
        disabled={currenciesQuery.isLoading}
      />

      {hasAnyError ? (
        <div className={styles.meta} role="alert">
          {text.ratesFetchErrorLabel}
        </div>
      ) : null}
    </div>
  );
}
