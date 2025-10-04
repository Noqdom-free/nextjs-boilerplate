"use client";

import { useState, useCallback } from "react";
import { InvoiceForm } from "@/components/invoice/InvoiceForm";
import { InvoicePreview } from "@/components/invoice/InvoicePreview";
import { ThemeToggle } from "@/components/theme-toggle";
import type { InvoiceData } from "@/types/invoice";

export default function Home() {
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceData>>({});
  const [persistenceInfo, setPersistenceInfo] = useState<string | null>(null);

  const handleDataChange = useCallback((data: Partial<InvoiceData>) => {
    setInvoiceData(data);
  }, []);

  const handlePersistenceInfo = useCallback((message: string | null) => {
    setPersistenceInfo(message);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Draft Notification - Fixed at top right, always on top */}
      {persistenceInfo && (
        <div className="fixed top-4 right-4 z-[9999] p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-md shadow-lg max-w-xs print:hidden">
          <p className="text-sm text-blue-700 font-medium">{persistenceInfo}</p>
        </div>
      )}

      {/* Header */}
      <header className="border-b bg-card print:hidden">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">$</span>
              </div>
              <h1 className="text-lg sm:text-xl font-semibold truncate">Invoice Generator</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Form Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="lg:sticky lg:top-6">
              <InvoiceForm onDataChange={handleDataChange} onPersistenceInfo={handlePersistenceInfo} />
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
