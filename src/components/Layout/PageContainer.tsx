import styles from "./PageContainer.module.css";

type Props = {
  children: React.ReactNode;
};

export function PageContainer({ children }: Props) {
  return <div className={styles.container}>{children}</div>;
}
