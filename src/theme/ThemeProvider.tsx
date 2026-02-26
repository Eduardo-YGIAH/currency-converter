import { useEffect } from "react";
import { colors, spacing, shadows } from "../config/designTokens";
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
        let value: string;

        if (styleKey === "fontSize") {
          value = `${styleValue}px`;
        } else if (styleKey === "lineHeight") {
          value =
            typeof styleValue === "number" && styleValue > 10
              ? `${styleValue}px`   // pixel-based line-height
              : String(styleValue); // unitless multiplier
        } else {
          value = String(styleValue); // fontWeight etc
        }

        root.style.setProperty(`--typography-${key}-${styleKey}`, value);
      });
    });

    Object.entries(shadows).forEach(([key, value]) => {
  root.style.setProperty(`--shadow-${key}`, value);
});
  }, []);

  return <>{children}</>;
}