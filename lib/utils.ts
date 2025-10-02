import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Currency, getCurrencyInfo } from "@/types/currency"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: Currency = Currency.USD): string {
  const currencyInfo = getCurrencyInfo(currency);
  return new Intl.NumberFormat(currencyInfo.locale, {
    style: 'currency',
    currency: currencyInfo.code,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `INV-${timestamp}-${random.toString().padStart(3, '0')}`;
}

export function formatDate(date: Date | string | undefined): string {
  // Handle undefined or null dates
  if (!date) {
    return "--";
  }

  // Convert string to Date if needed
  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    // Handle case where date might be a plain object (from JSON parsing)
    try {
      dateObj = new Date(date as any);
    } catch {
      return "--";
    }
  }

  // Handle invalid dates gracefully to prevent crashes
  if (!dateObj || isNaN(dateObj.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function generateId(): string {
  return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}