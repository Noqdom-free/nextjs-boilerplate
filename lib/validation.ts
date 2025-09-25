import { z } from 'zod';

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

export const invoiceFormSchema = z.object({
  business: businessInfoSchema,
  customer: customerInfoSchema,
  details: invoiceDetailsSchema,
  items: z.array(lineItemSchema).min(1, 'At least one item is required'),
  tax: taxInfoSchema,
});

export type BusinessInfoFormData = z.infer<typeof businessInfoSchema>;
export type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;
export type LineItemFormData = z.infer<typeof lineItemSchema>;
export type InvoiceDetailsFormData = z.infer<typeof invoiceDetailsSchema>;
export type TaxInfoFormData = z.infer<typeof taxInfoSchema>;
export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;