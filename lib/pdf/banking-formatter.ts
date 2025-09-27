import { Country, type CountryBankingInfo } from '@/types/banking';

/** Format banking details based on country-specific requirements */
export function formatBankingInfo(bankingInfo: CountryBankingInfo): string[] {
  switch (bankingInfo.country) {
    case Country.US:
      // US banking format: routing + account number
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `Routing Number: ${bankingInfo.data.routingNumber}`,
        `Account Number: ${bankingInfo.data.accountNumber}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`,
        ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
      ];
    case Country.EU:
      // European format: IBAN + BIC/SWIFT
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `IBAN: ${bankingInfo.data.iban}`,
        `BIC/SWIFT: ${bankingInfo.data.bicSwiftCode}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`,
        ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
      ];
    case Country.UK:
      // UK format: sort code + account number
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `Sort Code: ${bankingInfo.data.sortCode}`,
        `Account Number: ${bankingInfo.data.accountNumber}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`,
        ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
      ];
    case Country.CA:
      // Canadian format: institution + transit + account
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `Institution Number: ${bankingInfo.data.institutionNumber}`,
        `Transit Number: ${bankingInfo.data.transitNumber}`,
        `Account Number: ${bankingInfo.data.accountNumber}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`
      ];
    case Country.AU:
      // Australian format: BSB + account number
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `BSB Number: ${bankingInfo.data.bsbNumber}`,
        `Account Number: ${bankingInfo.data.accountNumber}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`,
        ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
      ];
    default:
      return [];
  }
}