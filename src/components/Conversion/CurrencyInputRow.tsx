import styles from "./ConversionLayout.module.css";

type Props = {
  amount: string;
  currency: string;
  onAmountChange: (value: string) => void;
  onCurrencyChange: (value: string) => void;
  currencies: string[];
};

export function CurrencyInputRow({
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  currencies,
}: Props) {
  return (
    <div className={styles.inputRow}>
      <input
        className={styles.input}
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
      />

      <div className={styles.divider} />

      <select
        className={styles.select}
        value={currency}
        onChange={(e) => onCurrencyChange(e.target.value)}
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
