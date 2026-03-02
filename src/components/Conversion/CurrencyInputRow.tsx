import type { Currency, CurrencySelectOption } from "../../types/currency";
import styles from "./ConversionLayout.module.css";

type Props = {
  amount: string;
  currency: Currency;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: Currency) => void;
  currencies: CurrencySelectOption[];
  readOnly?: boolean;
  disabled?: boolean;
};

export function CurrencyInputRow({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  currencies,
  readOnly = false,
  disabled = false,
}: Props) {
  return (
    <div className={styles.inputRow}>
      <input
        className={styles.input}
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        readOnly={readOnly}
        disabled={disabled}
      />

      <div className={styles.divider} />

      <select
        className={styles.select}
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value as Currency)}
        disabled={disabled}
      >
        {currencies.map((currencyOption) => (
          <option key={currencyOption.value} value={currencyOption.value}>
            {currencyOption.label}
          </option>
        ))}
      </select>
    </div>
  );
}
