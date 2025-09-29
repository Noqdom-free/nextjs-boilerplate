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
  DownloadSimple,
  Info
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PrivacyNotice } from "@/components/ui/PrivacyNotice";
import { CountrySelector } from "@/components/ui/CountrySelector";
import { ItemManager } from "./ItemManager";
import { BankingForm } from "./BankingForm";
import { PaymentLinksForm } from "./PaymentLinksForm";

import { invoiceFormSchema, type InvoiceFormData } from "@/lib/validation";
import { type InvoiceData } from "@/types/invoice";
import { Country } from "@/types/banking";
import { generateInvoiceNumber, formatCurrency } from "@/lib/utils";
import { generateInvoicePDF } from "@/lib/pdf-generator";
import { useFormPersistence } from "@/lib/useFormPersistence";
import { cleanupExpiredFormData } from "@/lib/formStorage";

interface InvoiceFormProps {
  onDataChange: (data: Partial<InvoiceData>) => void;
}

export function InvoiceForm({ onDataChange }: InvoiceFormProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState<string | null>(null);
  const [persistenceInfo, setPersistenceInfo] = useState<string | null>(null);


  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
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
      },
      selectedCountry: undefined,
      bankingInfo: {},
      paymentLinks: {
        links: [],
        globalInstructions: ""
      }
    }
  });

  // Initialize form persistence
  const formPersistence = useFormPersistence(form.watch, form.reset, {
    storageKey: 'invoice_draft',
    debounceMs: 2000, // Save every 2 seconds after user stops typing
    expirationHours: 48, // Keep data for 2 days
    excludeFields: [], // Don't exclude any fields - we want to persist everything
    onRestore: (data) => {
      setPersistenceInfo('✓ Draft restored from previous session. Click \'Clear Form\' button to clear the draft.');
      setTimeout(() => setPersistenceInfo(null), 5000);
    },
    onSave: () => {
      // Optionally show save indicator
    },
    onError: (error) => {
      console.warn('Form persistence error:', error);
    }
  });

  // Watch form data directly - this triggers on ANY field change
  const formData = form.watch();
  const items = formData.items || [];
  const taxRate = formData.tax?.rate || 0;
  const selectedCountry = formData.selectedCountry;
  const bankingInfo = formData.bankingInfo;
  const paymentLinks = formData.paymentLinks;
  
  // Helper function to format Date to YYYY-MM-DD string for date inputs
  const formatDateForInput = (date: Date | string | undefined): string => {
    if (!date) return '';
    
    // If it's already a string in YYYY-MM-DD format, return it
    if (typeof date === 'string') {
      // Check if it's already in YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      // Try to parse the string as a date
      try {
        const parsedDate = new Date(date);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString().split('T')[0];
        }
      } catch {
        return '';
      }
    }
    
    // Handle Date objects
    if (date instanceof Date) {
      try {
        return date.toISOString().split('T')[0];
      } catch {
        return '';
      }
    }
    
    // Handle objects that might be Date-like (from JSON parsing)
    try {
      const dateObj = new Date(date as any);
      if (!isNaN(dateObj.getTime())) {
        return dateObj.toISOString().split('T')[0];
      }
    } catch {
      return '';
    }
    
    return '';
  };

  // Helper function to parse date string to Date object
  const parseInputDate = (dateString: string): Date => {
    return new Date(dateString + 'T00:00:00.000Z');
  };

  // Dynamic calculations for multiple items
  const calculations = useMemo(() => {
    if (!items || items.length === 0) {
      return {
        subtotal: 0,
        taxAmount: 0,
        total: 0,
        items: []
      };
    }

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
  }, [
    // JSON stringify approach to avoid dynamic dependency array size
    JSON.stringify(items.map(item => ({
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice
    }))),
    taxRate
  ]);

  // Invoice data with multiple items support
  const invoiceData = useMemo(() => {
    const baseData = {
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
    };

    // Add optional payment features
    let extendedData = { ...baseData };

    // Add banking information if country is selected
    if (selectedCountry && bankingInfo && Object.keys(bankingInfo).length > 0) {
      extendedData = {
        ...extendedData,
        selectedCountry,
        bankingInfo: {
          country: selectedCountry,
          data: bankingInfo
        } as any // Temporary type assertion for dynamic banking data
      } as any;
    }

    // Add payment links if configured
    if (paymentLinks && paymentLinks.links && paymentLinks.links.length > 0) {
      extendedData = {
        ...extendedData,
        paymentLinks
      } as any;
    }

    return extendedData;
  }, [
    // Individual primitive values instead of object references
    formData.business?.name, formData.business?.email, formData.business?.address, formData.business?.phone,
    formData.customer?.name, formData.customer?.email, formData.customer?.address, formData.customer?.phone,
    formData.details?.invoiceNumber, formData.details?.issueDate, formData.details?.dueDate, formData.details?.notes,
    calculations.items, calculations.subtotal, calculations.taxAmount, calculations.total, taxRate,
    selectedCountry, JSON.stringify(bankingInfo), JSON.stringify(paymentLinks)
  ]);

  // Send data to preview immediately on any form data change
  useEffect(() => {
    onDataChange(invoiceData);
  }, [onDataChange, invoiceData]);

  // Cleanup expired form data on component mount
  useEffect(() => {
    cleanupExpiredFormData();
  }, []);

  // Handle country selection change
  const handleCountryChange = (country: Country) => {
    form.setValue('selectedCountry', country);
    // Clear banking info when country changes
    form.setValue('bankingInfo', {});
  };


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
      if (!data.items.length || !data.items.some(item => item.description)) {
        throw new Error("At least one item with description is required");
      }

      // Generate PDF using the invoice data
      const invoiceDataForPDF = invoiceData as InvoiceData;
      await generateInvoicePDF(invoiceDataForPDF, {
        filename: `invoice-${data.details.invoiceNumber}.pdf`,
        autoDownload: true
      });

      setGenerateSuccess(`Invoice ${data.details.invoiceNumber} generated successfully!`);

      // Optionally clear the saved draft after successful generation
      // formPersistence.clearData();

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
    setPersistenceInfo(null);

    // Clear the stored draft data
    formPersistence.clearData();

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
      },
      selectedCountry: undefined,
      bankingInfo: {},
      paymentLinks: {
        links: [],
        globalInstructions: ""
      }
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Draft Notification - Top Right Corner */}
      {persistenceInfo && (
        <div className="fixed top-4 right-4 z-50 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-md shadow-lg max-w-xs">
          <p className="text-sm text-blue-700 font-medium">{persistenceInfo}</p>
        </div>
      )}
      
      {/* Privacy Notice */}
      <PrivacyNotice />

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

        {/* Payment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CurrencyDollar className="w-5 h-5" />
              Payment Information
            </CardTitle>
            <CardDescription>
              Select your country and configure banking details for payment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6">
            <CountrySelector
              value={selectedCountry}
              onChange={handleCountryChange}
              error={form.formState.errors.selectedCountry?.message}
            />
          </CardContent>
        </Card>

        {/* Banking Form */}
        <BankingForm
          selectedCountry={selectedCountry}
          register={form.register}
          errors={form.formState.errors}
          setValue={form.setValue}
          control={form.control}
        />

        {/* Payment Links Form */}
        <PaymentLinksForm
          register={form.register}
          errors={form.formState.errors}
          setValue={form.setValue}
          control={form.control}
          watch={form.watch}
        />

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
                  value={formatDateForInput(formData.details?.issueDate)}
                  onChange={(e) => {
                    const dateValue = e.target.value ? parseInputDate(e.target.value) : new Date();
                    form.setValue("details.issueDate", dateValue);
                  }}
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.dueDate" className="text-sm sm:text-base">Due Date *</Label>
                <Input
                  id="details.dueDate"
                  type="date"
                  value={formatDateForInput(formData.details?.dueDate)}
                  onChange={(e) => {
                    const dateValue = e.target.value ? parseInputDate(e.target.value) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    form.setValue("details.dueDate", dateValue);
                  }}
                  className="text-sm sm:text-base"
                />
                {form.formState.errors.details?.dueDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.details.dueDate.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <ItemManager
          control={form.control}
          errors={form.formState.errors}
          items={items}
          setValue={form.setValue}
        />

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