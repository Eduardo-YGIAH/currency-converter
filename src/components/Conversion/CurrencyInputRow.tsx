import type { Currency } from "../../types/currency";
import styles from "./ConversionLayout.module.css";

type Props = {
  amount: string;
  currency: Currency;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: Currency) => void;
  currencies: Currency[];
  readOnly?: boolean;
};

export function CurrencyInputRow({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  currencies,
  readOnly = false,
}: Props) {
  return (
    <div className={styles.inputRow}>
      <input
        className={styles.input}
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        readOnly={readOnly}
      />

      <div className={styles.divider} />

      <select
        className={styles.select}
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value as Currency)}
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
