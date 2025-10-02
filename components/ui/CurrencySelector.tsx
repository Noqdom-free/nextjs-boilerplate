"use client";

import { CurrencyDollar } from "@phosphor-icons/react";
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
      <select
        id="currency-selector"
        value={value || Currency.USD}
        onChange={handleChange}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {Object.values(CURRENCY_INFO).map((currencyInfo) => (
          <option key={currencyInfo.code} value={currencyInfo.code}>
            {currencyInfo.code} - {currencyInfo.name} ({currencyInfo.symbol})
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
