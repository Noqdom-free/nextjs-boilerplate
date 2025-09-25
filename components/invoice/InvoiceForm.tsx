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
  FloppyDisk
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { invoiceFormSchema, type InvoiceFormData } from "@/lib/validation";
import { PAYMENT_TERMS_OPTIONS, DEFAULT_PAYMENT_TERMS, type PaymentTermsOption, type InvoiceData } from "@/types/invoice";
import { generateInvoiceNumber, formatCurrency } from "@/lib/utils";

interface InvoiceFormProps {
  onDataChange: (data: Partial<InvoiceData>) => void;
}

export function InvoiceForm({ onDataChange }: InvoiceFormProps) {


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


  const onSubmit = (data: InvoiceFormData) => {
    console.log("Invoice data:", data);
    // This will be used later for PDF generation and preview
  };

  const clearForm = () => {
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
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business.name">Business Name *</Label>
                <Input
                  id="business.name"
                  {...form.register("business.name")}
                  placeholder="Your Business Name"
                />
                {form.formState.errors.business?.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="business.email">Email</Label>
                <Input
                  id="business.email"
                  type="email"
                  {...form.register("business.email")}
                  placeholder="business@example.com"
                />
                {form.formState.errors.business?.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.business.email.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="business.address">Address</Label>
                <Input
                  id="business.address"
                  {...form.register("business.address")}
                  placeholder="123 Business St, City, State, ZIP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business.phone">Phone</Label>
                <Input
                  id="business.phone"
                  {...form.register("business.phone")}
                  placeholder="(555) 123-4567"
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer.name">Customer Name *</Label>
                <Input
                  id="customer.name"
                  {...form.register("customer.name")}
                  placeholder="Customer Name"
                />
                {form.formState.errors.customer?.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.customer.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer.email">Email</Label>
                <Input
                  id="customer.email"
                  type="email"
                  {...form.register("customer.email")}
                  placeholder="customer@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer.address">Address</Label>
                <Input
                  id="customer.address"
                  {...form.register("customer.address")}
                  placeholder="123 Customer St, City, State, ZIP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer.phone">Phone</Label>
                <Input
                  id="customer.phone"
                  {...form.register("customer.phone")}
                  placeholder="(555) 987-6543"
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="details.invoiceNumber">Invoice Number *</Label>
                <Input
                  id="details.invoiceNumber"
                  {...form.register("details.invoiceNumber")}
                  placeholder="INV-001"
                />
                {form.formState.errors.details?.invoiceNumber && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.details.invoiceNumber.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.issueDate">Issue Date *</Label>
                <Input
                  id="details.issueDate"
                  type="date"
                  {...form.register("details.issueDate", {
                    valueAsDate: true
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="details.dueDate">Due Date *</Label>
                <Input
                  id="details.dueDate"
                  type="date"
                  {...form.register("details.dueDate", {
                    valueAsDate: true
                  })}
                />
                {form.formState.errors.details?.dueDate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.details.dueDate.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="details.paymentTerms">Payment Terms *</Label>
              <select
                id="details.paymentTerms"
                {...form.register("details.paymentTerms")}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="items.0.description">Description *</Label>
              <Input
                id="items.0.description"
                {...form.register("items.0.description")}
                placeholder="Description of item or service"
              />
              {form.formState.errors.items?.[0]?.description && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.items[0].description.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="items.0.quantity">Quantity *</Label>
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
                />
                {form.formState.errors.items?.[0]?.quantity && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.items[0].quantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="items.0.unitPrice">Unit Price *</Label>
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
                />
                {form.formState.errors.items?.[0]?.unitPrice && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.items[0].unitPrice.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Line Total</Label>
                <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="tax.rate">Tax Rate (%)</Label>
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
                />
                {form.formState.errors.tax?.rate && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.tax.rate.message}
                  </p>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Subtotal:</span>
                  <span className="text-sm">{formatCurrency(calculations.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tax:</span>
                  <span className="text-sm">{formatCurrency(calculations.taxAmount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold">{formatCurrency(calculations.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={clearForm}
            className="flex items-center gap-2"
          >
            <Trash className="w-4 h-4" />
            Clear Form
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
          >
            <FloppyDisk className="w-4 h-4" />
            Generate Invoice
          </Button>
        </div>
      </form>
    </div>
  );
}