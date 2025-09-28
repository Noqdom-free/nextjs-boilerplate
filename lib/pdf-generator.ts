import jsPDF from 'jspdf';
import { InvoiceData } from '@/types/invoice';
import { HeaderRenderer } from './pdf/renderers/header-renderer';
import { DetailsRenderer } from './pdf/renderers/details-renderer';
import { PaymentRenderer } from './pdf/renderers/payment-renderer';
import { TableRenderer } from './pdf/renderers/table-renderer';
import { TotalsRenderer } from './pdf/renderers/totals-renderer';
import { FooterRenderer } from './pdf/renderers/footer-renderer';

/** Options for PDF generation and download behavior */
export interface PDFGenerationOptions {
  filename?: string;
  autoDownload?: boolean;
}

/** PDF generator for creating professional invoice documents */
export class InvoicePDFGenerator {
  private pdf: jsPDF;
  private readonly margins = {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  };
  private yPosition: number;
  private pageHeight: number;

  constructor() {
    // Initialize A4 portrait PDF with millimeter units
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = this.margins.top;
  }

  /** Estimate content density for intelligent spacing adjustments */
  private estimateContentDensity(data: InvoiceData): 'low' | 'medium' | 'high' {
    let contentScore = 0;
    
    // Base sections (header, details, totals, footer) = 4 points
    contentScore += 4;
    
    // Count invoice line items
    contentScore += data.items.length;
    
    // Payment information sections
    if (data.bankingInfo) contentScore += 1;
    if (data.paymentLinks?.links && data.paymentLinks.links.filter(link => link.isEnabled).length > 0) {
      contentScore += data.paymentLinks.links.filter(link => link.isEnabled).length;
    }
    
    // Notes add complexity
    if (data.details.notes) contentScore += 1;
    
    // Tax line adds content
    if (data.tax.rate > 0) contentScore += 1;
    
    // Classify density
    if (contentScore <= 8) return 'low';
    if (contentScore <= 15) return 'medium';
    return 'high';
  }

  /** Apply density-based optimizations to maximize content per page */
  private applyDensityOptimizations(density: 'low' | 'medium' | 'high'): void {
    // All content now uses aggressive space optimization regardless of density
    // The optimizations are already applied in the individual renderers
    // This method exists for future dynamic adjustments if needed
    
    // Log density for debugging purposes (remove in production)
    console.log(`PDF content density: ${density} - Using aggressive space optimization`);
  }

  /** Generate complete invoice PDF with all sections */
  generateInvoicePDF(data: InvoiceData, options: PDFGenerationOptions = {}): Uint8Array {
    // Analyze content density for aggressive space optimization
    const contentDensity = this.estimateContentDensity(data);
    
    // Apply density-based spacing adjustments
    this.applyDensityOptimizations(contentDensity);
    
    // Initialize renderers with optimized spacing
    const headerRenderer = new HeaderRenderer(this.pdf, this.yPosition);
    headerRenderer.render(data);
    this.yPosition = headerRenderer.getCurrentY();

    const detailsRenderer = new DetailsRenderer(this.pdf, this.yPosition);
    detailsRenderer.render(data);
    this.yPosition = detailsRenderer.getCurrentY();

    const paymentRenderer = new PaymentRenderer(this.pdf, this.yPosition);
    paymentRenderer.render(data);
    this.yPosition = paymentRenderer.getCurrentY();

    const tableRenderer = new TableRenderer(this.pdf, this.yPosition);
    tableRenderer.render(data);
    this.yPosition = tableRenderer.getCurrentY();

    const totalsRenderer = new TotalsRenderer(this.pdf, this.yPosition);
    totalsRenderer.render(data);
    this.yPosition = totalsRenderer.getCurrentY();

    const footerRenderer = new FooterRenderer(this.pdf, this.yPosition);
    footerRenderer.render(data);

    // Add page numbers if multiple pages were created
    const totalPages = this.pdf.getNumberOfPages();
    if (totalPages > 1) {
      this.addPageNumbers(totalPages);
    }

    const pdfOutput = this.pdf.output('arraybuffer');

    // Auto-download unless explicitly disabled
    if (options.autoDownload !== false) {
      const filename = options.filename || `invoice-${data.details.invoiceNumber}.pdf`;
      this.pdf.save(filename);
    }

    return new Uint8Array(pdfOutput);
  }

  /** Add page numbers to all pages */
  private addPageNumbers(totalPages: number): void {
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(8);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(100, 100, 100);
      
      const pageText = `Page ${i} of ${totalPages}`;
      const textWidth = this.pdf.getTextWidth(pageText);
      const pageWidth = this.pdf.internal.pageSize.getWidth();
      
      this.pdf.text(pageText, pageWidth - this.margins.right - textWidth, this.pageHeight - 10);
    }
  }

}

/**
 * Generate an invoice PDF with the provided data
 * @param data Invoice data including business info, items, and payment details
 * @param options PDF generation options (filename, auto-download)
 * @returns PDF as Uint8Array for further processing or download
 */
export async function generateInvoicePDF(data: InvoiceData, options?: PDFGenerationOptions): Promise<Uint8Array> {
  // Brief delay to allow UI to show loading state
  await new Promise(resolve => setTimeout(resolve, 100));

  const generator = new InvoicePDFGenerator();
  return generator.generateInvoicePDF(data, options);
}