// Country enum for supported banking systems
export enum Country {
  US = 'US',
  EU = 'EU',
  UK = 'UK',
  CA = 'CA',
  AU = 'AU'
}

// Country display names
export const COUNTRY_NAMES: Record<Country, string> = {
  [Country.US]: 'United States',
  [Country.EU]: 'European Union',
  [Country.UK]: 'United Kingdom',
  [Country.CA]: 'Canada',
  [Country.AU]: 'Australia'
};

// Base banking information interface
export interface BaseBankingInfo {
  bankName: string;
  accountHolderName: string;
  bankAddress?: string;
}

// United States banking information
export interface USBankingInfo extends BaseBankingInfo {
  routingNumber: string; // 9 digits
  accountNumber: string;
}

// European Union banking information
export interface EUBankingInfo extends BaseBankingInfo {
  iban: string; // International Bank Account Number
  bicSwiftCode: string; // BIC/SWIFT Code
}

// United Kingdom banking information
export interface UKBankingInfo extends BaseBankingInfo {
  sortCode: string; // 6 digits
  accountNumber: string;
}

// Canada banking information
export interface CABankingInfo extends BaseBankingInfo {
  institutionNumber: string; // 3 digits
  transitNumber: string; // 5 digits
  accountNumber: string;
}

// Australia banking information
export interface AUBankingInfo extends BaseBankingInfo {
  bsbNumber: string; // 6 digits
  accountNumber: string;
}

// Union type for all country-specific banking info
export type CountryBankingInfo =
  | { country: Country.US; data: USBankingInfo }
  | { country: Country.EU; data: EUBankingInfo }
  | { country: Country.UK; data: UKBankingInfo }
  | { country: Country.CA; data: CABankingInfo }
  | { country: Country.AU; data: AUBankingInfo };

// Banking field requirements by country
export interface BankingFieldRequirements {
  required: string[];
  optional: string[];
  formats: Record<string, string>; // field name -> format description
}

export const BANKING_REQUIREMENTS: Record<Country, BankingFieldRequirements> = {
  [Country.US]: {
    required: ['bankName', 'routingNumber', 'accountNumber', 'accountHolderName'],
    optional: ['bankAddress'],
    formats: {
      routingNumber: '9 digits (e.g., 123456789)',
      accountNumber: 'Account number'
    }
  },
  [Country.EU]: {
    required: ['bankName', 'iban', 'bicSwiftCode', 'accountHolderName'],
    optional: ['bankAddress'],
    formats: {
      iban: 'IBAN format (e.g., DE89370400440532013000)',
      bicSwiftCode: 'BIC/SWIFT Code (8 or 11 characters)'
    }
  },
  [Country.UK]: {
    required: ['bankName', 'sortCode', 'accountNumber', 'accountHolderName'],
    optional: ['bankAddress'],
    formats: {
      sortCode: '6 digits (e.g., 12-34-56 or 123456)',
      accountNumber: 'Account number'
    }
  },
  [Country.CA]: {
    required: ['bankName', 'institutionNumber', 'transitNumber', 'accountNumber', 'accountHolderName'],
    optional: ['bankAddress'],
    formats: {
      institutionNumber: '3 digits (e.g., 001)',
      transitNumber: '5 digits (e.g., 12345)',
      accountNumber: 'Account number'
    }
  },
  [Country.AU]: {
    required: ['bankName', 'bsbNumber', 'accountNumber', 'accountHolderName'],
    optional: ['bankAddress'],
    formats: {
      bsbNumber: '6 digits (e.g., 123-456 or 123456)',
      accountNumber: 'Account number'
    }
  }
};