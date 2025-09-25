"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_TERMS_OPTIONS } from "@/types/invoice";
import type { InvoiceData } from "@/types/invoice";

interface InvoicePreviewProps {
  data: Partial<InvoiceData>;
}

export const InvoicePreview = memo<InvoicePreviewProps>(function InvoicePreview({ data }) {
  const business = data.business || { name: '', address: '', phone: '', email: '' };
  const customer = data.customer || { name: '', address: '', phone: '', email: '' };
  const details = data.details || {
    invoiceNumber: '',
    issueDate: new Date(),
    dueDate: new Date(),
    paymentTerms: 'net_30',
    notes: ''
  };
  const items = data.items || [];
  const tax = data.tax || { rate: 0, amount: 0 };
  const calculations = data.calculations || { subtotal: 0, taxAmount: 0, total: 0 };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 print:p-4 print:space-y-4">
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-6 print:p-0">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8 print:mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center print:bg-black">
                  <span className="text-white text-sm font-bold">$</span>
                </div>
                <h1 className="text-3xl font-bold text-primary print:text-black">INVOICE</h1>
              </div>
              <div className="text-sm text-muted-foreground print:text-black">
                <p className="font-semibold text-lg text-foreground print:text-black">
                  {business.name || "Your Business Name"}
                </p>
                {business.address && <p>{business.address}</p>}
                <div className="flex gap-4 mt-1">
                  {business.phone && <p>Phone: {business.phone}</p>}
                  {business.email && <p>Email: {business.email}</p>}
                </div>
              </div>
            </div>
            <div className="text-right space-y-1 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-foreground print:text-black">
                  Invoice #: {details.invoiceNumber || "INV-000"}
                </p>
                <p className="text-muted-foreground print:text-black">
                  Issue Date: {details.issueDate ? formatDate(details.issueDate) : formatDate(new Date())}
                </p>
                <p className="font-medium text-foreground print:text-black">
                  Due Date: {details.dueDate ? formatDate(details.dueDate) : "Not set"}
                </p>
                <p className="text-muted-foreground print:text-black">
                  Terms: {details.paymentTerms ? PAYMENT_TERMS_OPTIONS[details.paymentTerms as keyof typeof PAYMENT_TERMS_OPTIONS] : "Net 30"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-6 print:my-4" />

          {/* Bill To Section */}
          <div className="mb-8 print:mb-6">
            <h3 className="text-lg font-semibold mb-3 print:text-black">Bill To:</h3>
            <div className="text-sm space-y-1">
              <p className="font-medium text-foreground print:text-black">
                {customer.name || "Customer Name"}
              </p>
              {customer.address && <p className="text-muted-foreground print:text-black">{customer.address}</p>}
              <div className="flex gap-4 text-muted-foreground print:text-black">
                {customer.phone && <p>Phone: {customer.phone}</p>}
                {customer.email && <p>Email: {customer.email}</p>}
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 print:mb-6">
            <Table>
              <TableHeader>
                <TableRow className="print:border-black">
                  <TableHead className="font-semibold print:text-black">Description</TableHead>
                  <TableHead className="text-center font-semibold print:text-black">Qty</TableHead>
                  <TableHead className="text-right font-semibold print:text-black">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold print:text-black">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <TableRow key={item.id || index} className="print:border-black">
                      <TableCell className="print:text-black">
                        {item.description || "Item description"}
                      </TableCell>
                      <TableCell className="text-center print:text-black">
                        {item.quantity || 1}
                      </TableCell>
                      <TableCell className="text-right print:text-black">
                        {formatCurrency(item.unitPrice || 0)}
                      </TableCell>
                      <TableCell className="text-right print:text-black">
                        {formatCurrency(item.total || 0)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="print:border-black">
                    <TableCell className="text-muted-foreground italic print:text-black">
                      Item description
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground print:text-black">1</TableCell>
                    <TableCell className="text-right text-muted-foreground print:text-black">
                      {formatCurrency(0)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground print:text-black">
                      {formatCurrency(0)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8 print:mb-6">
            <div className="w-72 space-y-3">
              <div className="flex justify-between items-center pb-2">
                <span className="text-sm font-medium print:text-black">Subtotal:</span>
                <span className="text-sm print:text-black">{formatCurrency(calculations.subtotal)}</span>
              </div>
              {tax.rate > 0 && (
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-medium print:text-black">Tax ({tax.rate}%):</span>
                  <span className="text-sm print:text-black">{formatCurrency(calculations.taxAmount)}</span>
                </div>
              )}
              <Separator className="print:border-black" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold print:text-black">Total:</span>
                <span className="text-lg font-bold print:text-black">{formatCurrency(calculations.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mt-8 pt-6 border-t print:mt-6 print:pt-4 print:border-black">
            <h3 className="text-sm font-semibold mb-2 print:text-black">Payment Instructions:</h3>
            <div className="text-xs text-muted-foreground space-y-1 print:text-black">
              <p>Please remit payment by the due date specified above.</p>
              <p>For questions regarding this invoice, please contact {business.email || "your business email"}.</p>
              {details.notes && (
                <div className="mt-3">
                  <p className="font-medium print:text-black">Notes:</p>
                  <p className="mt-1 print:text-black">{details.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Thank You */}
          <div className="mt-6 text-center print:mt-4">
            <p className="text-sm text-muted-foreground print:text-black">
              Thank you for your business!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});