"use client";

import { CurrencyDollar, CaretDown } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Currency, CURRENCY_INFO } from "@/types/currency";

interface CurrencySelectorProps {
  value?: Currency;
  onChange: (currency: Currency) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function CurrencySelector({
  value,
  onChange,
  error,
  className = "",
  disabled = false
}: CurrencySelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCurrency = event.target.value as Currency;
    onChange(selectedCurrency);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="currency-selector" className="text-sm sm:text-base flex items-center gap-2">
        <CurrencyDollar className="w-4 h-4" />
        Currency *
      </Label>
      <div className="relative">
        <select
          id="currency-selector"
          value={value || Currency.USD}
          onChange={handleChange}
          disabled={disabled}
          className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-8"
        >
          {Object.values(CURRENCY_INFO).map((currencyInfo) => (
            <option key={currencyInfo.code} value={currencyInfo.code}>
              {currencyInfo.code} - {currencyInfo.name} ({currencyInfo.symbol})
            </option>
          ))}
        </select>
        <CaretDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
      </div>
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
