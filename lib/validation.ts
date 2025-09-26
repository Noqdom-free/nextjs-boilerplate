import { z } from 'zod';
import { Country } from '@/types/banking';
import { PaymentMethod } from '@/types/payment';
import {
  validateBankingField,
  validatePaymentURL,
  BANKING_FORMAT_MESSAGES
} from '@/lib/constants';

export const businessInfoSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100, 'Business name too long'),
  address: z.string().max(200, 'Address too long').optional(),
  phone: z.string().max(20, 'Phone number too long').optional(),
  email: z.string().email('Invalid email address').max(100, 'Email too long').optional().or(z.literal('')),
});

export const customerInfoSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(100, 'Customer name too long'),
  address: z.string().max(200, 'Address too long').optional(),
  email: z.string().email('Invalid email address').max(100, 'Email too long').optional().or(z.literal('')),
  phone: z.string().max(20, 'Phone number too long').optional(),
});

export const lineItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, 'Item description is required').max(200, 'Description too long'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0').max(999999, 'Quantity too large'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative').max(999999.99, 'Unit price too large'),
  total: z.number(),
});

export const invoiceDetailsSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required').max(50, 'Invoice number too long'),
  issueDate: z.date({
    message: 'Issue date is required',
  }),
  dueDate: z.date({
    message: 'Due date is required',
  }),
  paymentTerms: z.string().min(1, 'Payment terms are required'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

export const taxInfoSchema = z.object({
  rate: z.number().min(0, 'Tax rate cannot be negative').max(100, 'Tax rate cannot exceed 100%'),
  amount: z.number().min(0, 'Tax amount cannot be negative'),
});

// Payment link validation schema
export const paymentLinkSchema = z.object({
  id: z.string(),
  method: z.nativeEnum(PaymentMethod),
  url: z.string()
    .min(1, 'Payment URL is required')
    .refine((val) => validatePaymentURL(val), {
      message: 'Must be a valid URL starting with http:// or https://'
    }),
  displayName: z.string().max(50, 'Display name too long').optional(),
  isEnabled: z.boolean(),
  instructions: z.string().max(200, 'Instructions too long').optional()
});

export const paymentLinksDataSchema = z.object({
  links: z.array(paymentLinkSchema),
  globalInstructions: z.string().max(500, 'Instructions too long').optional()
});

export const invoiceFormSchema = z.object({
  business: businessInfoSchema,
  customer: customerInfoSchema,
  details: invoiceDetailsSchema,
  items: z.array(lineItemSchema).min(1, 'At least one item is required'),
  tax: taxInfoSchema,
  selectedCountry: z.nativeEnum(Country).optional(),
  bankingInfo: z.record(z.string(), z.any()).optional(), // Dynamic banking info based on country
  paymentLinks: paymentLinksDataSchema.optional(), // Payment links configuration
}).refine((data) => {
  // Validate that issue date is not after due date
  const issueDate = data.details.issueDate;
  const dueDate = data.details.dueDate;

  if (issueDate && dueDate) {
    return issueDate <= dueDate;
  }
  return true; // Allow if either date is missing
}, {
  message: "Due date cannot be before issue date",
  path: ["details", "dueDate"] // Show error on due date field
}).refine((data) => {
  // Validate banking info if country is selected
  if (data.selectedCountry && data.bankingInfo) {
    try {
      const schema = getBankingSchema(data.selectedCountry);
      schema.parse(data.bankingInfo);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: "Invalid banking information for selected country",
  path: ["bankingInfo"]
}).refine((data) => {
  // Validate payment links: URLs required when payment methods are enabled
  if (data.paymentLinks?.links) {
    for (const link of data.paymentLinks.links) {
      if (link.isEnabled && (!link.url || !validatePaymentURL(link.url))) {
        return false;
      }
    }
  }
  return true;
}, {
  message: "Payment URL is required for enabled payment methods",
  path: ["paymentLinks", "links"]
});

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;
export type LineItemFormData = z.infer<typeof lineItemSchema>;
export type InvoiceDetailsFormData = z.infer<typeof invoiceDetailsSchema>;
export type TaxInfoFormData = z.infer<typeof taxInfoSchema>;
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

// Banking validation schemas by country
export const usBankingSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required').max(100, 'Bank name too long'),
  routingNumber: z.string()
    .min(1, 'Routing number is required')
    .refine((val) => validateBankingField(Country.US, 'routingNumber', val), {
      message: BANKING_FORMAT_MESSAGES.US.routingNumber
    }),
  accountNumber: z.string()
    .min(1, 'Account number is required')
    .refine((val) => validateBankingField(Country.US, 'accountNumber', val), {
      message: BANKING_FORMAT_MESSAGES.US.accountNumber
    }),
  accountHolderName: z.string().min(1, 'Account holder name is required').max(100, 'Name too long'),
  bankAddress: z.string().max(200, 'Address too long').optional()
});

export const euBankingSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required').max(100, 'Bank name too long'),
  iban: z.string()
    .min(1, 'IBAN is required')
    .refine((val) => validateBankingField(Country.EU, 'iban', val), {
      message: BANKING_FORMAT_MESSAGES.EU.iban
    }),
  bicSwiftCode: z.string()
    .min(1, 'BIC/SWIFT code is required')
    .refine((val) => validateBankingField(Country.EU, 'bicSwiftCode', val), {
      message: BANKING_FORMAT_MESSAGES.EU.bicSwiftCode
    }),
  accountHolderName: z.string().min(1, 'Account holder name is required').max(100, 'Name too long'),
  bankAddress: z.string().max(200, 'Address too long').optional()
});

export const ukBankingSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required').max(100, 'Bank name too long'),
  sortCode: z.string()
    .min(1, 'Sort code is required')
    .refine((val) => validateBankingField(Country.UK, 'sortCode', val), {
      message: BANKING_FORMAT_MESSAGES.UK.sortCode
    }),
  accountNumber: z.string()
    .min(1, 'Account number is required')
    .refine((val) => validateBankingField(Country.UK, 'accountNumber', val), {
      message: BANKING_FORMAT_MESSAGES.UK.accountNumber
    }),
  accountHolderName: z.string().min(1, 'Account holder name is required').max(100, 'Name too long'),
  bankAddress: z.string().max(200, 'Address too long').optional()
});

export const caBankingSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required').max(100, 'Bank name too long'),
  institutionNumber: z.string()
    .min(1, 'Institution number is required')
    .refine((val) => validateBankingField(Country.CA, 'institutionNumber', val), {
      message: BANKING_FORMAT_MESSAGES.CA.institutionNumber
    }),
  transitNumber: z.string()
    .min(1, 'Transit number is required')
    .refine((val) => validateBankingField(Country.CA, 'transitNumber', val), {
      message: BANKING_FORMAT_MESSAGES.CA.transitNumber
    }),
  accountNumber: z.string()
    .min(1, 'Account number is required')
    .refine((val) => validateBankingField(Country.CA, 'accountNumber', val), {
      message: BANKING_FORMAT_MESSAGES.CA.accountNumber
    }),
  accountHolderName: z.string().min(1, 'Account holder name is required').max(100, 'Name too long'),
  bankAddress: z.string().max(200, 'Address too long').optional()
});

export const auBankingSchema = z.object({
  bankName: z.string().min(1, 'Bank name is required').max(100, 'Bank name too long'),
  bsbNumber: z.string()
    .min(1, 'BSB number is required')
    .refine((val) => validateBankingField(Country.AU, 'bsbNumber', val), {
      message: BANKING_FORMAT_MESSAGES.AU.bsbNumber
    }),
  accountNumber: z.string()
    .min(1, 'Account number is required')
    .refine((val) => validateBankingField(Country.AU, 'accountNumber', val), {
      message: BANKING_FORMAT_MESSAGES.AU.accountNumber
    }),
  accountHolderName: z.string().min(1, 'Account holder name is required').max(100, 'Name too long'),
  bankAddress: z.string().max(200, 'Address too long').optional()
});

// Helper function to get banking schema by country
export const getBankingSchema = (country: Country) => {
  switch (country) {
    case Country.US:
      return usBankingSchema;
    case Country.EU:
      return euBankingSchema;
    case Country.UK:
      return ukBankingSchema;
    case Country.CA:
      return caBankingSchema;
    case Country.AU:
      return auBankingSchema;
    default:
      throw new Error(`Unsupported country: ${country}`);
  }
};

// Type exports for banking schemas
export type USBankingFormData = z.infer<typeof usBankingSchema>;
export type EUBankingFormData = z.infer<typeof euBankingSchema>;
export type UKBankingFormData = z.infer<typeof ukBankingSchema>;
export type CABankingFormData = z.infer<typeof caBankingSchema>;
export type AUBankingFormData = z.infer<typeof auBankingSchema>;
export type PaymentLinkFormData = z.infer<typeof paymentLinkSchema>;
export type PaymentLinksDataFormData = z.infer<typeof paymentLinksDataSchema>;