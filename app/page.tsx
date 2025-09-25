"use client";

import { useState, useCallback } from "react";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import type { InvoiceData } from "@/types/invoice";

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceData>>({});

  const handleDataChange = useCallback((data: Partial<InvoiceData>) => {
    setInvoiceData(data);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card print:hidden">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">$</span>
            </div>
            <h1 className="text-lg sm:text-xl font-semibold truncate">Invoice Generator</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Form Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="lg:sticky lg:top-6">
              <InvoiceForm onDataChange={handleDataChange} />
            </div>
          </div>

          {/* Preview Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="lg:sticky lg:top-6">
              <div className="mb-3 sm:mb-4 print:hidden">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Live Preview</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Your invoice will update automatically as you type
                </p>
              </div>
              <InvoicePreview data={invoiceData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
