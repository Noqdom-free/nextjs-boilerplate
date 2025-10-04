"use client";

import { Globe, CaretDown } from "@phosphor-icons/react";
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
      <div className="relative">
        <select
          id="country-selector"
          value={value || ""}
          onChange={handleChange}
          disabled={disabled}
          className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pr-8"
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