import styles from "./ConversionLayout.module.css";
import { text } from "../../config/text";

export function ConversionLayout() {
  const title = text.titleTemplate
    .replace("{amount}", text.defaultAmount)
    .replace("{from}", text.defaultFromCurrency);

  // TODO(phase-4): Replace static timestamp with dynamic UTC formatter using text.timestampFormat  
  const meta = `26 Feb, 09:32 UTC · ${text.disclaimerLabel}`;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.value}>
        {text.defaultConvertedAmount} {text.defaultToCurrency}
      </div>

      <div className={styles.meta}>{meta}</div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={text.defaultAmount}
          readOnly
        />
        <div className={styles.divider} />
        <select className={styles.select}>
          <option>{text.defaultFromCurrency}</option>
        </select>
      </div>

      <div className={styles.inputRow}>
        <input
          className={styles.input}
          value={text.defaultConvertedAmount}
          readOnly
        />
        <div className={styles.divider} />
        <select className={styles.select}>
          <option>{text.defaultToCurrency}</option>
        </select>
      </div>
    </div>
  );
}
