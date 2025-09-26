"use client";

import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { PAYMENT_TERMS_OPTIONS } from "@/types/invoice";
import type { InvoiceData } from "@/types/invoice";
import { Country, COUNTRY_NAMES, type CountryBankingInfo } from "@/types/banking";
import { type PaymentLinksData, type PaymentLinkConfig } from "@/types/payment";

interface InvoicePreviewProps {
  data: Partial<InvoiceData>;
}

// Helper function to format banking information by country
function formatBankingInfo(bankingInfo: CountryBankingInfo): string[] {
  switch (bankingInfo.country) {
    case Country.US:
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `Routing Number: ${bankingInfo.data.routingNumber}`,
        `Account Number: ${bankingInfo.data.accountNumber}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`,
        ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
      ];
    case Country.EU:
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `IBAN: ${bankingInfo.data.iban}`,
        `BIC/SWIFT: ${bankingInfo.data.bicSwiftCode}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`,
        ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
      ];
    case Country.UK:
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `Sort Code: ${bankingInfo.data.sortCode}`,
        `Account Number: ${bankingInfo.data.accountNumber}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`,
        ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
      ];
    case Country.CA:
      return [
        `Bank: ${bankingInfo.data.bankName}`,
        `Institution Number: ${bankingInfo.data.institutionNumber}`,
        `Transit Number: ${bankingInfo.data.transitNumber}`,
        `Account Number: ${bankingInfo.data.accountNumber}`,
        `Account Holder: ${bankingInfo.data.accountHolderName}`
      ];
    case Country.AU:
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
  const bankingInfo = data.bankingInfo;
  const paymentLinks = data.paymentLinks;

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6 print:p-4 print:space-y-4">
      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-4 sm:p-6 print:p-0">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 print:mb-6 space-y-4 sm:space-y-0">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded flex items-center justify-center print:bg-black">
                  <span className="text-white text-xs sm:text-sm font-bold">$</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-primary print:text-black">INVOICE</h1>
              </div>
              <div className="text-sm text-muted-foreground print:text-black">
                <p className="font-semibold text-base sm:text-lg text-foreground print:text-black break-words">
                  {business.name || "Your Business Name"}
                </p>
                {business.address && <p className="break-words">{business.address}</p>}
                <div className="flex flex-col sm:flex-row sm:gap-4 mt-1 space-y-1 sm:space-y-0">
                  {business.phone && <p className="break-words">Phone: {business.phone}</p>}
                  {business.email && <p className="break-words">Email: {business.email}</p>}
                </div>
              </div>
            </div>
            <div className="sm:text-right space-y-1 text-sm">
              <div className="space-y-1">
                <p className="font-medium text-foreground print:text-black break-words">
                  Invoice #: {details.invoiceNumber || "INV-000"}
                </p>
                <p className="text-muted-foreground print:text-black break-words">
                  Issue Date: {details.issueDate ? formatDate(details.issueDate) : formatDate(new Date())}
                </p>
                <p className="font-medium text-foreground print:text-black break-words">
                  Due Date: {details.dueDate ? formatDate(details.dueDate) : "Not set"}
                </p>
                <p className="text-muted-foreground print:text-black break-words">
                  Terms: {details.paymentTerms ? PAYMENT_TERMS_OPTIONS[details.paymentTerms as keyof typeof PAYMENT_TERMS_OPTIONS] : "Net 30"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4 sm:my-6 print:my-4" />

          {/* Bill To Section */}
          <div className="mb-6 sm:mb-8 print:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 print:text-black">Bill To:</h3>
            <div className="text-sm space-y-1">
              <p className="font-medium text-foreground print:text-black break-words">
                {customer.name || "Customer Name"}
              </p>
              {customer.address && <p className="text-muted-foreground print:text-black break-words">{customer.address}</p>}
              <div className="flex flex-col sm:flex-row sm:gap-4 text-muted-foreground print:text-black space-y-1 sm:space-y-0">
                {customer.phone && <p className="break-words">Phone: {customer.phone}</p>}
                {customer.email && <p className="break-words">Email: {customer.email}</p>}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          {(bankingInfo || (paymentLinks && paymentLinks.links && paymentLinks.links.filter(link => link.isEnabled).length > 0)) && (
            <>
              <Separator className="my-4 sm:my-6 print:my-4" />
              <div className="mb-6 sm:mb-8 print:mb-6">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 print:text-black">Payment Information:</h3>

                {/* Banking Information */}
                {bankingInfo && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 print:text-black">Wire Transfer:</h4>
                    <div className="text-sm space-y-1">
                      {formatBankingInfo(bankingInfo).map((line, index) => (
                        <p key={index} className="text-muted-foreground print:text-black break-words">{line}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Online Payment Options */}
                {paymentLinks && paymentLinks.links && paymentLinks.links.filter(link => link.isEnabled).length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 print:text-black">Online Payment Options:</h4>
                    <div className="text-sm space-y-2">
                      {paymentLinks.links
                        .filter(link => link.isEnabled)
                        .map((link, index) => (
                          <div key={index} className="break-words">
                            <p className="text-primary hover:text-primary/80 print:text-black font-medium cursor-pointer">
                              {link.displayName || `Pay with ${link.method.charAt(0).toUpperCase() + link.method.slice(1)}`}
                            </p>
                            <p className="text-xs text-muted-foreground print:text-black mt-1">
                              Click here to pay online: {link.url}
                            </p>
                            {link.instructions && (
                              <p className="text-xs text-muted-foreground print:text-black italic mt-1">
                                {link.instructions}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Global Payment Instructions */}
                {paymentLinks && paymentLinks.globalInstructions && (
                  <div className="text-sm text-muted-foreground print:text-black italic">
                    <p className="break-words">{paymentLinks.globalInstructions}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Items Table */}
          <div className="mb-6 sm:mb-8 print:mb-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="print:border-black">
                  <TableHead className="font-semibold print:text-black text-xs sm:text-sm min-w-[100px]">Description</TableHead>
                  <TableHead className="text-center font-semibold print:text-black text-xs sm:text-sm w-12 sm:w-16">Qty</TableHead>
                  <TableHead className="text-right font-semibold print:text-black text-xs sm:text-sm w-16 sm:w-20">Price</TableHead>
                  <TableHead className="text-right font-semibold print:text-black text-xs sm:text-sm w-16 sm:w-24">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length > 0 ? (
                  items.map((item, index) => (
                    <TableRow key={item.id || index} className="print:border-black">
                      <TableCell className="print:text-black text-xs sm:text-sm break-words min-w-[100px]">
                        {item.description || "Item description"}
                      </TableCell>
                      <TableCell className="text-center print:text-black text-xs sm:text-sm w-12 sm:w-16">
                        {item.quantity || 1}
                      </TableCell>
                      <TableCell className="text-right print:text-black text-xs sm:text-sm whitespace-nowrap w-16 sm:w-20">
                        {formatCurrency(item.unitPrice || 0)}
                      </TableCell>
                      <TableCell className="text-right print:text-black text-xs sm:text-sm whitespace-nowrap w-16 sm:w-24">
                        {formatCurrency(item.total || 0)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="print:border-black">
                    <TableCell className="text-muted-foreground italic print:text-black text-xs sm:text-sm break-words min-w-[100px]">
                      Item description
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground print:text-black text-xs sm:text-sm w-12 sm:w-16">1</TableCell>
                    <TableCell className="text-right text-muted-foreground print:text-black text-xs sm:text-sm whitespace-nowrap w-16 sm:w-20">
                      {formatCurrency(0)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground print:text-black text-xs sm:text-sm whitespace-nowrap w-16 sm:w-24">
                      {formatCurrency(0)}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-6 sm:mb-8 print:mb-6">
            <div className="w-full max-w-xs sm:w-72 space-y-3">
              <div className="flex justify-between items-center pb-2">
                <span className="text-xs sm:text-sm font-medium print:text-black">Subtotal:</span>
                <span className="text-xs sm:text-sm print:text-black whitespace-nowrap">{formatCurrency(calculations.subtotal)}</span>
              </div>
              {tax.rate > 0 && (
                <div className="flex justify-between items-center pb-2">
                  <span className="text-xs sm:text-sm font-medium print:text-black">Tax ({tax.rate}%):</span>
                  <span className="text-xs sm:text-sm print:text-black whitespace-nowrap">{formatCurrency(calculations.taxAmount)}</span>
                </div>
              )}
              <Separator className="print:border-black" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-base sm:text-lg font-bold print:text-black">Total:</span>
                <span className="text-base sm:text-lg font-bold print:text-black whitespace-nowrap">{formatCurrency(calculations.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t print:mt-6 print:pt-4 print:border-black">
            <h3 className="text-xs sm:text-sm font-semibold mb-2 print:text-black">Payment Instructions:</h3>
            <div className="text-xs text-muted-foreground space-y-1 print:text-black">
              <p className="break-words">Please remit payment by the due date specified above.</p>
              <p className="break-words">For questions regarding this invoice, please contact {business.email || "your business email"}.</p>
              {details.notes && (
                <div className="mt-3">
                  <p className="font-medium print:text-black">Notes:</p>
                  <p className="mt-1 print:text-black break-words">{details.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Thank You */}
          <div className="mt-4 sm:mt-6 text-center print:mt-4">
            <p className="text-xs sm:text-sm text-muted-foreground print:text-black">
              Thank you for your business!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});