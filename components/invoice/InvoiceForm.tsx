"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Buildings,
  User,
  Calendar,
  CalendarBlank,
  Hash,
  Clock,
  CurrencyDollar,
  Calculator,
  Percent,
  Trash,
  DownloadSimple
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { invoiceFormSchema, type InvoiceFormData } from "@/lib/validation";
import { PAYMENT_TERMS_OPTIONS, DEFAULT_PAYMENT_TERMS, type PaymentTermsOption, type InvoiceData } from "@/types/invoice";
import { generateInvoiceNumber, formatCurrency } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/pdf-generator";

interface InvoiceFormProps {
  onDataChange: (data: Partial<InvoiceData>) => void;
}

export function InvoiceForm({ onDataChange }: InvoiceFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);


  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      business: {
        name: "",
        address: "",
        phone: "",
        email: ""
      },
      customer: {
        name: "",
        address: "",
        email: "",
        phone: ""
      },
      details: {
        invoiceNumber: generateInvoiceNumber(),
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        paymentTerms: DEFAULT_PAYMENT_TERMS,
        notes: ""
      },
      items: [{
        id: "1",
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0
      }],
      tax: {
        rate: 0,
        amount: 0
      }
    }
  });

  // Watch form data directly - this triggers on ANY field change
  const formData = form.watch();
  const items = formData.items || [];
  const taxRate = formData.tax?.rate || 0;

  // Simple direct calculations
  const calculations = useMemo(() => {
    const validItems = items.map(item => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      return {
        ...item,
        quantity: qty,
        unitPrice: price,
        total: qty * price
      };
    });

    const subtotal = validItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (Number(taxRate) || 0) / 100;
    const total = subtotal + taxAmount;

    return {
      subtotal,
      taxAmount,
      total,
      items: validItems
    };
  }, [items?.[0]?.description, items?.[0]?.quantity, items?.[0]?.unitPrice, taxRate]);

  // Simple invoice data - no complex memoization
  const invoiceData = useMemo(() => ({
    business: formData.business,
    customer: formData.customer,
    details: formData.details,
    items: calculations.items,
    tax: {
      rate: taxRate,
      amount: calculations.taxAmount
    },
    calculations: {
      subtotal: calculations.subtotal,
      taxAmount: calculations.taxAmount,
      total: calculations.total
    }
  }), [
    formData.business?.name, formData.business?.email, formData.business?.address, formData.business?.phone,
    formData.customer?.name, formData.customer?.email, formData.customer?.address, formData.customer?.phone,
    formData.details?.invoiceNumber, formData.details?.issueDate, formData.details?.dueDate, formData.details?.paymentTerms, formData.details?.notes,
    formData.items?.[0]?.description, formData.items?.[0]?.quantity, formData.items?.[0]?.unitPrice,
    calculations.items, calculations.subtotal, calculations.taxAmount, calculations.total, taxRate
  ]);

  // Send data to preview immediately on any form data change
  useEffect(() => {
    onDataChange(invoiceData);
  }, [onDataChange, invoiceData]);


  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsGenerating(true);
      setGenerateError(null);
      setGenerateSuccess(null);

      // Validate required fields
      if (!data.business.name) {
        throw new Error("Business name is required");
      }
      if (!data.customer.name) {
        throw new Error("Customer name is required");
      }
      if (!data.items[0]?.description) {
        throw new Error("Item description is required");
      }

      // Generate PDF using the invoice data
      const invoiceDataForPDF = invoiceData as InvoiceData;
      await generateInvoicePDF(invoiceDataForPDF, {
        filename: `invoice-${data.details.invoiceNumber}.pdf`,
        autoDownload: true
      });

      setGenerateSuccess(`Invoice ${data.details.invoiceNumber} generated successfully!`);

      // Clear success message after 3 seconds
      setTimeout(() => setGenerateSuccess(null), 3000);

    } catch (error) {
      console.error("Error generating PDF:", error);
      setGenerateError(error instanceof Error ? error.message : "Failed to generate PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearForm = () => {
    // Clear any error or success messages
    setGenerateError(null);
    setGenerateSuccess(null);

    form.reset({
      business: {
        name: "",
        address: "",
        phone: "",
        email: ""
      },
      customer: {
        name: "",
        address: "",
        email: "",
        phone: ""
      },
      details: {
        invoiceNumber: generateInvoiceNumber(),
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        paymentTerms: DEFAULT_PAYMENT_TERMS,
        notes: ""
      },
      items: [{
        id: "1",
        description: "",
        quantity: 1,
        unitPrice: 0,
        total: 0
      }],
      tax: {
        rate: 0,
        amount: 0
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Buildings className="w-5 h-5" />
              Business Information
            </CardTitle>
            <CardDescription>
              Enter your business details that will appear on the invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="business.name" className="text-sm sm:text-base">Business Name *</Label>
                <Input
                  id="business.name"
                  {...form.register("business.name")}
                  placeholder="Your Business Name"
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.business?.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="business.email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="business.email"
                  type="email"
                  {...form.register("business.email")}
                  placeholder="business@example.com"
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.business?.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="business.address" className="text-sm sm:text-base">Address</Label>
                <Input
                  id="business.address"
                  {...form.register("business.address")}
                  placeholder="123 Business St, City, State, ZIP"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business.phone" className="text-sm sm:text-base">Phone</Label>
                <Input
                  id="business.phone"
                  {...form.register("business.phone")}
                  placeholder="(555) 123-4567"
                  className="text-sm sm:text-base"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
            <CardDescription>
              Enter the customer's billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer.name" className="text-sm sm:text-base">Customer Name *</Label>
                <Input
                  id="customer.name"
                  {...form.register("customer.name")}
                  placeholder="Customer Name"
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.customer?.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customer.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer.email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="customer.email"
                  type="email"
                  {...form.register("customer.email")}
                  placeholder="customer@example.com"
                  className="text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer.address" className="text-sm sm:text-base">Address</Label>
                <Input
                  id="customer.address"
                  {...form.register("customer.address")}
                  placeholder="123 Customer St, City, State, ZIP"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer.phone" className="text-sm sm:text-base">Phone</Label>
                <Input
                  id="customer.phone"
                  {...form.register("customer.phone")}
                  placeholder="(555) 987-6543"
                  className="text-sm sm:text-base"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="w-5 h-5" />
              Invoice Details
            </CardTitle>
            <CardDescription>
              Set invoice number, dates, and payment terms
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.invoiceNumber" className="text-sm sm:text-base">Invoice Number *</Label>
                <Input
                  id="details.invoiceNumber"
                  {...form.register("details.invoiceNumber")}
                  placeholder="INV-001"
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.details?.invoiceNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.details.invoiceNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.issueDate" className="text-sm sm:text-base">Issue Date *</Label>
                <Input
                  id="details.issueDate"
                  type="date"
                  {...form.register("details.issueDate", {
                    valueAsDate: true
                  })}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.dueDate" className="text-sm sm:text-base">Due Date *</Label>
                <Input
                  id="details.dueDate"
                  type="date"
                  {...form.register("details.dueDate", {
                    valueAsDate: true
                  })}
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.details?.dueDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.details.dueDate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="details.paymentTerms" className="text-sm sm:text-base">Payment Terms *</Label>
              <select
                id="details.paymentTerms"
                {...form.register("details.paymentTerms")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {Object.entries(PAYMENT_TERMS_OPTIONS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Line Item */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CurrencyDollar className="w-5 h-5" />
              Item Details
            </CardTitle>
            <CardDescription>
              Enter the item or service being invoiced
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="space-y-2">
              <Label htmlFor="items.0.description" className="text-sm sm:text-base">Description *</Label>
              <Input
                id="items.0.description"
                {...form.register("items.0.description")}
                placeholder="Description of item or service"
                className="text-sm sm:text-base"
              />
              {form.formState.errors.items?.[0]?.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.items[0].description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="items.0.quantity" className="text-sm sm:text-base">Quantity *</Label>
                <Input
                  id="items.0.quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={items[0]?.quantity ?? 1}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 1 : parseFloat(e.target.value) || 1;
                    form.setValue("items.0.quantity", value);
                  }}
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.items?.[0]?.quantity && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.items[0].quantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="items.0.unitPrice" className="text-sm sm:text-base">Price *</Label>
                <Input
                  id="items.0.unitPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={items[0]?.unitPrice ?? 0}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                    form.setValue("items.0.unitPrice", value);
                  }}
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.items?.[0]?.unitPrice && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.items[0].unitPrice.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Line Total</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm sm:text-base items-center">
                  {formatCurrency(calculations.items[0]?.total || 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax and Totals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Tax & Totals
            </CardTitle>
            <CardDescription>
              Add tax rate and view calculated totals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-2">
                <Label htmlFor="tax.rate" className="text-sm sm:text-base">Tax Rate (%)</Label>
                <Input
                  id="tax.rate"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={taxRate ?? 0}
                  onChange={(e) => {
                    const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                    form.setValue("tax.rate", value);
                  }}
                  placeholder="0.00"
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.tax?.rate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.tax.rate.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-medium">Subtotal:</span>
                  <span className="text-sm sm:text-base">{formatCurrency(calculations.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base font-medium">Tax:</span>
                  <span className="text-sm sm:text-base">{formatCurrency(calculations.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold">Total:</span>
                  <span className="text-base sm:text-lg font-bold">{formatCurrency(calculations.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {generateSuccess && (
          <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-700 font-medium">✓ {generateSuccess}</p>
          </div>
        )}

        {/* Error Message */}
        {generateError && (
          <div className="p-3 sm:p-4 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">Error: {generateError}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-auto"
          >
            <Trash className="w-4 h-4" />
            Clear Form
          </Button>
          <Button
            type="submit"
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 text-sm sm:text-base h-10 sm:h-auto"
          >
            <DownloadSimple className="w-4 h-4" />
            {isGenerating ? "Generating PDF..." : "Generate Invoice"}
          </Button>
        </div>
      </form>
    </div>
  );
}