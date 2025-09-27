"use client";

import { useState } from "react";
import { Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { Bank, Info } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Country, BANKING_REQUIREMENTS } from "@/types/banking";
import { BANKING_FORMAT_MESSAGES, BANKING_FIELD_LABELS, formatBankingField, validateBankingField } from "@/lib/constants";

interface BankingFormProps {
  selectedCountry?: Country;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
}

export function BankingForm({
  selectedCountry,
  register,
  errors,
  setValue
}: BankingFormProps) {
  // State to track field-specific validation errors
  const [fieldValidationErrors, setFieldValidationErrors] = useState<Record<string, string>>({});
  if (!selectedCountry) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bank className="w-5 h-5" />
            Banking Information
          </CardTitle>
          <CardDescription>
            Please select a country above to configure banking details
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Bank className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Choose a country to see banking options</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const requirements = BANKING_REQUIREMENTS[selectedCountry];
  const labels = BANKING_FIELD_LABELS[selectedCountry];
  const formatMessages = BANKING_FORMAT_MESSAGES[selectedCountry];

  const renderField = (fieldName: string, type: "text" | "email" = "text") => {
    const isRequired = requirements.required.includes(fieldName);
    const label = labels[fieldName as keyof typeof labels];
    const formatMessage = formatMessages?.[fieldName as keyof typeof formatMessages];
    const fieldError = errors.bankingInfo?.[fieldName as keyof typeof errors.bankingInfo];

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValue(`bankingInfo.${fieldName}`, value);
      
      // Clear validation error when user starts typing
      if (fieldValidationErrors[fieldName]) {
        setFieldValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }

      // Auto-format certain fields on blur
      if (fieldName === 'sortCode' || fieldName === 'bsbNumber' || fieldName === 'iban') {
        const formatted = formatBankingField(selectedCountry, fieldName, value);
        if (formatted !== value) {
          setValue(`bankingInfo.${fieldName}`, formatted);
        }
      }
    };

    const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      
      // Only validate if field has a value and is a field that needs validation
      if (value && formatMessage) {
        const isValid = validateBankingField(selectedCountry, fieldName, value);
        if (!isValid) {
          setFieldValidationErrors(prev => ({
            ...prev,
            [fieldName]: formatMessage
          }));
        }
      }
    };

    return (
      <div className="space-y-2" key={fieldName}>
        <Label htmlFor={`banking-${fieldName}`} className="text-sm sm:text-base">
          {label} {isRequired && "*"}
        </Label>
        <Input
          id={`banking-${fieldName}`}
          type={type}
          {...register(`bankingInfo.${fieldName}`)}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          placeholder={getFieldPlaceholder(selectedCountry, fieldName)}
          className="text-sm sm:text-base"
        />
        {formatMessage && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{formatMessage}</span>
          </div>
        )}
        {(fieldError || fieldValidationErrors[fieldName]) && (
          <p className="text-sm text-destructive">
            {fieldValidationErrors[fieldName] || (fieldError as any)?.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bank className="w-5 h-5" />
          Banking Information - {selectedCountry === Country.EU ? 'European Union' :
                                selectedCountry === Country.US ? 'United States' :
                                selectedCountry === Country.UK ? 'United Kingdom' :
                                selectedCountry === Country.CA ? 'Canada' : 'Australia'}
        </CardTitle>
        <CardDescription>
          Enter your banking details for wire transfers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bank Name */}
          {renderField('bankName')}

          {/* Account Holder Name */}
          {renderField('accountHolderName')}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Country-specific main fields */}
          {selectedCountry === Country.US && (
            <>
              {renderField('routingNumber')}
              {renderField('accountNumber')}
            </>
          )}

          {selectedCountry === Country.EU && (
            <>
              {renderField('iban')}
              {renderField('bicSwiftCode')}
            </>
          )}

          {selectedCountry === Country.UK && (
            <>
              {renderField('sortCode')}
              {renderField('accountNumber')}
            </>
          )}

          {selectedCountry === Country.CA && (
            <>
              {renderField('institutionNumber')}
              {renderField('transitNumber')}
            </>
          )}

          {selectedCountry === Country.AU && (
            <>
              {renderField('bsbNumber')}
              {renderField('accountNumber')}
            </>
          )}
        </div>

        {/* Additional fields for Canada */}
        {selectedCountry === Country.CA && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderField('accountNumber')}
            <div></div> {/* Empty space for grid alignment */}
          </div>
        )}

        {/* Optional Bank Address */}
        <div className="space-y-2">
          <Label htmlFor="banking-bankAddress" className="text-sm sm:text-base">
            {labels.bankAddress} (Optional)
          </Label>
          <Input
            id="banking-bankAddress"
            {...register('bankingInfo.bankAddress')}
            placeholder={getFieldPlaceholder(selectedCountry, 'bankAddress')}
            className="text-sm sm:text-base"
          />
          {(errors.bankingInfo as any)?.['bankAddress'] && (
            <p className="text-sm text-destructive">
              {((errors.bankingInfo as any)['bankAddress'] as any)?.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get field placeholders
function getFieldPlaceholder(country: Country, fieldName: string): string {
  const placeholders = {
    [Country.US]: {
      bankName: 'Bank of America',
      routingNumber: '123456789',
      accountNumber: '1234567890',
      accountHolderName: 'John Doe',
      bankAddress: '123 Bank St, City, State, ZIP'
    },
    [Country.EU]: {
      bankName: 'Deutsche Bank',
      iban: 'DE89 3704 0044 0532 0130 00',
      bicSwiftCode: 'DEUTDEFF',
      accountHolderName: 'John Doe',
      bankAddress: '123 Bank St, City, Country'
    },
    [Country.UK]: {
      bankName: 'Barclays Bank',
      sortCode: '12-34-56',
      accountNumber: '12345678',
      accountHolderName: 'John Doe',
      bankAddress: '123 Bank St, City, Postcode'
    },
    [Country.CA]: {
      bankName: 'Royal Bank of Canada',
      institutionNumber: '001',
      transitNumber: '12345',
      accountNumber: '1234567',
      accountHolderName: 'John Doe',
      bankAddress: '123 Bank St, City, Province, Postal Code'
    },
    [Country.AU]: {
      bankName: 'Commonwealth Bank',
      bsbNumber: '123-456',
      accountNumber: '12345678',
      accountHolderName: 'John Doe',
      bankAddress: '123 Bank St, City, State, Postcode'
    }
  };

  return placeholders[country]?.[fieldName as keyof typeof placeholders[typeof country]] || '';
}