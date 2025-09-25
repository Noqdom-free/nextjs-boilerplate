export interface BusinessInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface CustomerInfo {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  paymentTerms: string;
  notes?: string;
}

export interface TaxInfo {
  rate: number;
  amount: number;
}

export interface InvoiceCalculations {
  subtotal: number;
  taxAmount: number;
  total: number;
}

export interface PaymentInstructions {
  method: string;
  details: string;
}

export interface InvoiceData {
  business: BusinessInfo;
  customer: CustomerInfo;
  details: InvoiceDetails;
  items: LineItem[];
  tax: TaxInfo;
  calculations: InvoiceCalculations;
  paymentInstructions?: PaymentInstructions;
}

export type PaymentTermsOption =
  | 'due_on_receipt'
  | 'net_15'
  | 'net_30'
  | 'net_60'
  | 'net_90';

export const PAYMENT_TERMS_OPTIONS: Record<PaymentTermsOption, string> = {
  due_on_receipt: 'Due on Receipt',
  net_15: 'Net 15',
  net_30: 'Net 30',
  net_60: 'Net 60',
  net_90: 'Net 90',
};

export const DEFAULT_PAYMENT_TERMS: PaymentTermsOption = 'net_30';