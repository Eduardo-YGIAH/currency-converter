import { useEffect } from "react";
import { colors, spacing } from "../config/designTokens";
import { layout } from "../config/layout";
import { typography } from "../config/typography";

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  useEffect(() => {
    const root = document.documentElement;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, String(value));
    });

    Object.entries(spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, `${value}px`);
    });

    Object.entries(layout).forEach(([key, value]) => {
      if (typeof value === "number") {
        root.style.setProperty(`--layout-${key}`, `${value}px`);
      }
    });

    Object.entries(typography).forEach(([key, styles]) => {
      Object.entries(styles).forEach(([styleKey, styleValue]) => {
        root.style.setProperty(
          `--typography-${key}-${styleKey}`,
          typeof styleValue === "number" ? `${styleValue}px` : String(styleValue)
        );
      });
    });
  }, []);

  return <>{children}</>;
}