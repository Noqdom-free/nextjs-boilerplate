import jsPDF from 'jspdf';
import { InvoiceData, PAYMENT_TERMS_OPTIONS } from '@/types/invoice';
import { formatCurrency, formatDate } from './utils';

export interface PDFGenerationOptions {
  filename?: string;
  autoDownload?: boolean;
}

export class InvoicePDFGenerator {
  private pdf: jsPDF;
  private readonly pageWidth: number;
  private readonly pageHeight: number;
  private readonly margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  };
  private yPosition: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = this.margins.top;
  }

  generateInvoicePDF(data: InvoiceData, options: PDFGenerationOptions = {}): Uint8Array {
    this.renderHeader(data);
    this.renderInvoiceDetails(data);
    this.renderBillingInfo(data);
    this.renderItemsTable(data);
    this.renderTotals(data);
    this.renderPaymentInstructions(data);
    this.renderFooter(data);

    const pdfOutput = this.pdf.output('arraybuffer');

    if (options.autoDownload !== false) {
      const filename = options.filename || `invoice-${data.details.invoiceNumber}.pdf`;
      this.pdf.save(filename);
    }

    return new Uint8Array(pdfOutput);
  }

  private renderHeader(data: InvoiceData): void {
    // Logo placeholder and INVOICE title
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('INVOICE', this.margins.left, this.yPosition);

    // Business information (right-aligned)
    const businessInfo = [
      data.business.name || 'Your Business Name',
      data.business.address,
      data.business.phone ? `Phone: ${data.business.phone}` : null,
      data.business.email ? `Email: ${data.business.email}` : null
    ].filter(Boolean) as string[];

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');

    const rightAlign = this.pageWidth - this.margins.right;
    let businessYPos = this.yPosition;

    businessInfo.forEach((line, index) => {
      const textWidth = this.pdf.getTextWidth(line);
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(12);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
      }
      this.pdf.text(line, rightAlign - textWidth, businessYPos);
      businessYPos += 5;
    });

    this.yPosition += 30;
  }

  private renderInvoiceDetails(data: InvoiceData): void {
    // Invoice details (right-aligned)
    const rightAlign = this.pageWidth - this.margins.right;

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');

    const invoiceDetails = [
      `Invoice #: ${data.details.invoiceNumber}`,
      `Issue Date: ${formatDate(data.details.issueDate)}`,
      `Due Date: ${formatDate(data.details.dueDate)}`,
      `Terms: ${PAYMENT_TERMS_OPTIONS[data.details.paymentTerms as keyof typeof PAYMENT_TERMS_OPTIONS] || 'Net 30'}`
    ];

    let detailYPos = this.yPosition;
    invoiceDetails.forEach((detail, index) => {
      const textWidth = this.pdf.getTextWidth(detail);
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
      } else {
        this.pdf.setFont('helvetica', 'normal');
      }
      this.pdf.text(detail, rightAlign - textWidth, detailYPos);
      detailYPos += 5;
    });

    this.yPosition += 30;
  }

  private renderBillingInfo(data: InvoiceData): void {
    // Bill To section
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Bill To:', this.margins.left, this.yPosition);
    this.yPosition += 7;

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');

    const customerInfo = [
      data.customer.name || 'Customer Name',
      data.customer.address,
      data.customer.phone ? `Phone: ${data.customer.phone}` : null,
      data.customer.email ? `Email: ${data.customer.email}` : null
    ].filter(Boolean) as string[];

    customerInfo.forEach((line, index) => {
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
      } else {
        this.pdf.setFont('helvetica', 'normal');
      }
      this.pdf.text(line, this.margins.left, this.yPosition);
      this.yPosition += 5;
    });

    this.yPosition += 15;
  }

  private renderItemsTable(data: InvoiceData): void {
    const tableStartY = this.yPosition;
    const tableWidth = this.pageWidth - this.margins.left - this.margins.right;

    // Column widths
    const descriptionWidth = tableWidth * 0.5;
    const quantityWidth = tableWidth * 0.15;
    const priceWidth = tableWidth * 0.175;
    const totalWidth = tableWidth * 0.175;

    // Table header
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');

    // Header background
    this.pdf.setFillColor(240, 240, 240);
    this.pdf.rect(this.margins.left, this.yPosition - 3, tableWidth, 8, 'F');

    // Header text
    this.pdf.text('Description', this.margins.left + 2, this.yPosition);
    this.pdf.text('Qty', this.margins.left + descriptionWidth + 2, this.yPosition);
    this.pdf.text('Price', this.margins.left + descriptionWidth + quantityWidth + 2, this.yPosition);
    this.pdf.text('Total', this.margins.left + descriptionWidth + quantityWidth + priceWidth + 2, this.yPosition);

    this.yPosition += 10;

    // Table rows
    this.pdf.setFont('helvetica', 'normal');

    const items = data.items.length > 0 ? data.items : [{
      id: '1',
      description: 'Item description',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }];

    items.forEach((item, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        this.pdf.setFillColor(250, 250, 250);
        this.pdf.rect(this.margins.left, this.yPosition - 3, tableWidth, 8, 'F');
      }

      // Row data
      this.pdf.text(item.description, this.margins.left + 2, this.yPosition);
      this.pdf.text(item.quantity.toString(), this.margins.left + descriptionWidth + 2, this.yPosition);
      this.pdf.text(formatCurrency(item.unitPrice), this.margins.left + descriptionWidth + quantityWidth + 2, this.yPosition);
      this.pdf.text(formatCurrency(item.total), this.margins.left + descriptionWidth + quantityWidth + priceWidth + 2, this.yPosition);

      this.yPosition += 8;
    });

    // Table border
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.rect(this.margins.left, tableStartY - 3, tableWidth, this.yPosition - tableStartY + 3);

    this.yPosition += 15;
  }

  private renderTotals(data: InvoiceData): void {
    const rightAlign = this.pageWidth - this.margins.right;
    const labelX = rightAlign - 60;
    const valueX = rightAlign;

    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');

    // Subtotal
    this.pdf.text('Subtotal:', labelX, this.yPosition);
    const subtotalWidth = this.pdf.getTextWidth(formatCurrency(data.calculations.subtotal));
    this.pdf.text(formatCurrency(data.calculations.subtotal), valueX - subtotalWidth, this.yPosition);
    this.yPosition += 6;

    // Tax (if applicable)
    if (data.tax.rate > 0) {
      this.pdf.text(`Tax (${data.tax.rate}%):`, labelX, this.yPosition);
      const taxWidth = this.pdf.getTextWidth(formatCurrency(data.calculations.taxAmount));
      this.pdf.text(formatCurrency(data.calculations.taxAmount), valueX - taxWidth, this.yPosition);
      this.yPosition += 6;
    }

    // Line above total
    this.pdf.setDrawColor(0, 0, 0);
    this.pdf.line(labelX, this.yPosition, rightAlign, this.yPosition);
    this.yPosition += 5;

    // Total
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(12);
    this.pdf.text('Total:', labelX, this.yPosition);
    const totalWidth = this.pdf.getTextWidth(formatCurrency(data.calculations.total));
    this.pdf.text(formatCurrency(data.calculations.total), valueX - totalWidth, this.yPosition);

    this.yPosition += 20;
  }

  private renderPaymentInstructions(data: InvoiceData): void {
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Payment Instructions:', this.margins.left, this.yPosition);
    this.yPosition += 7;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Please remit payment by the due date specified above.', this.margins.left, this.yPosition);
    this.yPosition += 5;

    const contactEmail = data.business.email || 'your business email';
    this.pdf.text(`For questions regarding this invoice, please contact ${contactEmail}.`, this.margins.left, this.yPosition);
    this.yPosition += 10;

    // Notes (if any)
    if (data.details.notes) {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Notes:', this.margins.left, this.yPosition);
      this.yPosition += 7;

      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(data.details.notes, this.margins.left, this.yPosition);
      this.yPosition += 10;
    }
  }

  private renderFooter(data: InvoiceData): void {
    // Thank you message (centered)
    const footerY = this.pageHeight - this.margins.bottom - 10;
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');

    const thankYouText = 'Thank you for your business!';
    const textWidth = this.pdf.getTextWidth(thankYouText);
    const centerX = (this.pageWidth - textWidth) / 2;

    this.pdf.text(thankYouText, centerX, footerY);
  }
}

export async function generateInvoicePDF(data: InvoiceData, options?: PDFGenerationOptions): Promise<Uint8Array> {
  // Add a small delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 100));

  const generator = new InvoicePDFGenerator();
  return generator.generateInvoicePDF(data, options);
}