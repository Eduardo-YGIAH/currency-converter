export type CurrencyCode = string;

export type Currency = CurrencyCode;

export type CurrencyOption = {
  code: CurrencyCode;
  name: string;
};

export type CurrencySelectOption = {
  value: CurrencyCode;
  label: string;
};

