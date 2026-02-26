import { useState } from "react";
import styles from "./ConversionLayout.module.css";
import { text } from "../../config/text";
import { CurrencyInputRow } from "./CurrencyInputRow";

export function ConversionLayout() {
  const [fromAmount, setFromAmount] = useState(text.defaultAmount);
  const [toAmount, setToAmount] = useState(text.defaultConvertedAmount);

  const [fromCurrency, setFromCurrency] = useState(text.defaultFromCurrency);
  const [toCurrency, setToCurrency] = useState(text.defaultToCurrency);

  // TODO(phase-5): Replace hardcoded currency list with data from /v1/currencies API
  const availableCurrencies = [
    text.defaultFromCurrency,
    text.defaultToCurrency,
  ];
  const title = text.titleTemplate
    .replace("{amount}", fromAmount)
    .replace("{from}", fromCurrency);

  // TODO(phase-4): Replace static timestamp with dynamic UTC formatter using text.timestampFormat
  const meta = `26 Feb, 09:32 UTC · ${text.disclaimerLabel}`;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.value}>
        {toAmount} {toCurrency}
      </div>

      <div className={styles.meta}>{meta}</div>

      <CurrencyInputRow
        amount={fromAmount}
        currency={fromCurrency}
        onAmountChange={setFromAmount}
        onCurrencyChange={setFromCurrency}
        currencies={availableCurrencies}
      />

      <CurrencyInputRow
        amount={toAmount}
        currency={toCurrency}
        onAmountChange={setToAmount}
        onCurrencyChange={setToCurrency}
        currencies={availableCurrencies}
      />
    </div>
  );
}
