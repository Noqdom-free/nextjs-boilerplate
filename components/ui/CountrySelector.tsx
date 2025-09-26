"use client";

import { Globe } from "@phosphor-icons/react";
import { Label } from "@/components/ui/label";
import { Country, COUNTRY_NAMES } from "@/types/banking";

interface CountrySelectorProps {
  value?: Country;
  onChange: (country: Country) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export function CountrySelector({
  value,
  onChange,
  error,
  className = "",
  disabled = false
}: CountrySelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = event.target.value as Country;
    onChange(selectedCountry);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor="country-selector" className="text-sm sm:text-base flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Country/Region *
      </Label>
      <select
        id="country-selector"
        value={value || ""}
        onChange={handleChange}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="" disabled>
          Select your country...
        </option>
        {Object.entries(COUNTRY_NAMES).map(([countryCode, countryName]) => (
          <option key={countryCode} value={countryCode}>
            {countryName}
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