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
    top: 25,
    bottom: 25,
    left: 25,
    right: 25
  };
  private yPosition: number;

  constructor() {
    // Initialize A4 portrait PDF with millimeter units
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.yPosition = this.margins.top;
  }

  /** Generate complete invoice PDF with all sections */
  generateInvoicePDF(data: InvoiceData, options: PDFGenerationOptions = {}): Uint8Array {
    // Initialize renderers
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

    const pdfOutput = this.pdf.output('arraybuffer');

    // Auto-download unless explicitly disabled
    if (options.autoDownload !== false) {
      const filename = options.filename || `invoice-${data.details.invoiceNumber}.pdf`;
      this.pdf.save(filename);
    }

    return new Uint8Array(pdfOutput);
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