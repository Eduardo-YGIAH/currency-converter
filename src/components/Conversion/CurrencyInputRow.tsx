import { memo, useId, useMemo } from "react";
import type { Currency, CurrencySelectOption } from "../../types/currency";
import styles from "./ConversionLayout.module.css";

type Props = {
  amount: string;
  currency: Currency;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: Currency) => void;
  currencies: CurrencySelectOption[];
  amountLabel: string;
  currencyLabel: string;
  readOnly?: boolean;
  disabled?: boolean;
};

function CurrencyInputRowComponent({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  currencies,
  amountLabel,
  currencyLabel,
  readOnly = false,
  disabled = false,
}: Props) {
  const amountInputId = useId();
  const currencySelectId = useId();
  const options = useMemo(
    () =>
      currencies.map((currencyOption) => (
        <option key={currencyOption.value} value={currencyOption.value}>
          {currencyOption.label}
        </option>
      )),
    [currencies],
  );

  return (
    <div className={styles.inputRow}>
      <label className={styles.srOnly} htmlFor={amountInputId}>
        {amountLabel}
      </label>
      <input
        id={amountInputId}
        className={styles.input}
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        readOnly={readOnly}
        aria-readonly={readOnly}
        disabled={disabled}
      />

      <div className={styles.divider} />

      <label className={styles.srOnly} htmlFor={currencySelectId}>
        {currencyLabel}
      </label>
      <select
        id={currencySelectId}
        className={styles.select}
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value as Currency)}
        disabled={disabled}
      >
        {options}
      </select>
    </div>
  );
}

export const CurrencyInputRow = memo(CurrencyInputRowComponent);
