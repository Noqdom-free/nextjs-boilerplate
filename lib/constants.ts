import { Country } from '@/types/banking';

// Banking format validation patterns
export const BANKING_PATTERNS = {
  // US patterns
  US_ROUTING_NUMBER: /^\d{9}$/,
  US_ACCOUNT_NUMBER: /^[0-9]+$/,

  // EU patterns
  EU_IBAN: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4}[0-9]{7}([A-Z0-9]?){0,16}$/,
  EU_BIC_SWIFT: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,

  // UK patterns
  UK_SORT_CODE: /^(\d{2}-?\d{2}-?\d{2}|\d{6})$/,
  UK_ACCOUNT_NUMBER: /^[0-9]{6,8}$/,

  // Canada patterns
  CA_INSTITUTION_NUMBER: /^\d{3}$/,
  CA_TRANSIT_NUMBER: /^\d{5}$/,
  CA_ACCOUNT_NUMBER: /^[0-9]+$/,

  // Australia patterns
  AU_BSB_NUMBER: /^(\d{3}-?\d{3}|\d{6})$/,
  AU_ACCOUNT_NUMBER: /^[0-9]+$/,
} as const;

// Banking format helper messages
export const BANKING_FORMAT_MESSAGES = {
  US: {
    routingNumber: 'Must be exactly 9 digits (e.g., 123456789)',
    accountNumber: 'Must contain only numbers'
  },
  EU: {
    iban: 'Must be a valid IBAN format (e.g., DE89370400440532013000)',
    bicSwiftCode: 'Must be 8 or 11 characters (e.g., DEUTDEFF or DEUTDEFF500)'
  },
  UK: {
    sortCode: 'Must be 6 digits, optionally with dashes (e.g., 12-34-56 or 123456)',
    accountNumber: 'Must be 6-8 digits'
  },
  CA: {
    institutionNumber: 'Must be exactly 3 digits (e.g., 001)',
    transitNumber: 'Must be exactly 5 digits (e.g., 12345)',
    accountNumber: 'Must contain only numbers'
  },
  AU: {
    bsbNumber: 'Must be 6 digits, optionally with dash (e.g., 123-456 or 123456)',
    accountNumber: 'Must contain only numbers'
  }
} as const;

// Banking field validation functions
export const validateBankingField = (country: Country, fieldName: string, value: string): boolean => {
  switch (country) {
    case Country.US:
      switch (fieldName) {
        case 'routingNumber':
          return BANKING_PATTERNS.US_ROUTING_NUMBER.test(value);
        case 'accountNumber':
          return BANKING_PATTERNS.US_ACCOUNT_NUMBER.test(value);
        default:
          return true;
      }

    case Country.EU:
      switch (fieldName) {
        case 'iban':
          return BANKING_PATTERNS.EU_IBAN.test(value.replace(/\s/g, '').toUpperCase());
        case 'bicSwiftCode':
          return BANKING_PATTERNS.EU_BIC_SWIFT.test(value.toUpperCase());
        default:
          return true;
      }

    case Country.UK:
      switch (fieldName) {
        case 'sortCode':
          return BANKING_PATTERNS.UK_SORT_CODE.test(value.replace(/\s/g, ''));
        case 'accountNumber':
          return BANKING_PATTERNS.UK_ACCOUNT_NUMBER.test(value);
        default:
          return true;
      }

    case Country.CA:
      switch (fieldName) {
        case 'institutionNumber':
          return BANKING_PATTERNS.CA_INSTITUTION_NUMBER.test(value);
        case 'transitNumber':
          return BANKING_PATTERNS.CA_TRANSIT_NUMBER.test(value);
        case 'accountNumber':
          return BANKING_PATTERNS.CA_ACCOUNT_NUMBER.test(value);
        default:
          return true;
      }

    case Country.AU:
      switch (fieldName) {
        case 'bsbNumber':
          return BANKING_PATTERNS.AU_BSB_NUMBER.test(value.replace(/\s/g, ''));
        case 'accountNumber':
          return BANKING_PATTERNS.AU_ACCOUNT_NUMBER.test(value);
        default:
          return true;
      }

    default:
      return true;
  }
};

// Banking field formatters (for display)
export const formatBankingField = (country: Country, fieldName: string, value: string): string => {
  switch (country) {
    case Country.UK:
      if (fieldName === 'sortCode' && value.length === 6) {
        return `${value.slice(0, 2)}-${value.slice(2, 4)}-${value.slice(4, 6)}`;
      }
      break;

    case Country.AU:
      if (fieldName === 'bsbNumber' && value.length === 6) {
        return `${value.slice(0, 3)}-${value.slice(3, 6)}`;
      }
      break;

    case Country.EU:
      if (fieldName === 'iban') {
        // Add spaces every 4 characters for better readability
        return value.replace(/(.{4})/g, '$1 ').trim();
      }
      break;

    default:
      break;
  }

  return value;
};

// URL validation removed - payment links can accept any text

// Common banking field labels by country
export const BANKING_FIELD_LABELS = {
  [Country.US]: {
    bankName: 'Bank Name',
    routingNumber: 'Routing Number',
    accountNumber: 'Account Number',
    accountHolderName: 'Account Holder Name',
    bankAddress: 'Bank Address'
  },
  [Country.EU]: {
    bankName: 'Bank Name',
    iban: 'IBAN',
    bicSwiftCode: 'BIC/SWIFT Code',
    accountHolderName: 'Account Holder Name',
    bankAddress: 'Bank Address'
  },
  [Country.UK]: {
    bankName: 'Bank Name',
    sortCode: 'Sort Code',
    accountNumber: 'Account Number',
    accountHolderName: 'Account Holder Name',
    bankAddress: 'Bank Address'
  },
  [Country.CA]: {
    bankName: 'Bank Name',
    institutionNumber: 'Institution Number',
    transitNumber: 'Transit Number',
    accountNumber: 'Account Number',
    accountHolderName: 'Account Holder Name',
    bankAddress: 'Bank Address'
  },
  [Country.AU]: {
    bankName: 'Bank Name',
    bsbNumber: 'BSB Number',
    accountNumber: 'Account Number',
    accountHolderName: 'Account Holder Name',
    bankAddress: 'Bank Address'
  }
} as const;