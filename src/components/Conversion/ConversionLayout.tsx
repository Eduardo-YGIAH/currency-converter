import { useState } from "react";
import styles from "./ConversionLayout.module.css";
import { text } from "../../config/text";
import { CurrencyInputRow } from "./CurrencyInputRow";
import { convert } from "../../utils/convert";
import { STATIC_RATES } from "../../config/rates";
import type { Currency } from "../../types/currency";
import { formatAmount } from "../../utils/formatAmount";

export function ConversionLayout() {
  const [fromAmount, setFromAmount] = useState(text.defaultAmount);

  const [fromCurrency, setFromCurrency] = useState<Currency>(
    text.defaultFromCurrency as Currency,
  );
  const [toCurrency, setToCurrency] = useState<Currency>(
    text.defaultToCurrency as Currency,
  );

  const rate = STATIC_RATES[fromCurrency]?.[toCurrency] ?? 0;

  const numericFrom = parseFloat(fromAmount);

  let converted = 0;

  if (Number.isFinite(numericFrom)) {
    if (fromCurrency === toCurrency) {
      converted = numericFrom;
    } else {
      converted = convert(numericFrom, rate);
    }
  }

  const formatted = formatAmount(converted);

  // TODO(phase-5): Replace hardcoded currency list with data from /v1/currencies API
  const availableCurrencies = [
    text.defaultFromCurrency,
    text.defaultToCurrency,
  ] as Currency[];

  const title = text.titleTemplate
    .replace("{amount}", fromAmount)
    .replace("{from}", fromCurrency);

  // TODO(phase-4): Replace static timestamp with dynamic UTC formatter using text.timestampFormat
  const meta = `26 Feb, 09:32 UTC · ${text.disclaimerLabel}`;

  const handleFromCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === toCurrency) {
      setToCurrency(fromCurrency);
      setFromCurrency(toCurrency);
    } else {
      setFromCurrency(newCurrency);
    }
  };

  const handleToCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === fromCurrency) {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
    } else {
      setToCurrency(newCurrency);
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.value}>
        {formatted} {toCurrency}
      </div>

      <div className={styles.meta}>{meta}</div>

      <CurrencyInputRow
        amount={fromAmount}
        currency={fromCurrency}
        onAmountChange={setFromAmount}
        onCurrencyChange={handleFromCurrencyChange}
        currencies={availableCurrencies}
      />

      <CurrencyInputRow
        amount={formatted}
        currency={toCurrency}
        onAmountChange={() => {}}
        onCurrencyChange={handleToCurrencyChange}
        currencies={availableCurrencies}
        readOnly
      />
    </div>
  );
}
