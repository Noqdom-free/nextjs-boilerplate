import { InvoiceData, PAYMENT_TERMS_OPTIONS } from '@/types/invoice';
import { formatDate } from '../../utils';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for invoice details and customer billing information */
export class DetailsRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    this.renderInvoiceDetails(data);
    this.renderBillingInfo(data);
  }

  /** Render invoice number, dates, and payment terms */
  private renderInvoiceDetails(data: InvoiceData): void {
    this.addSeparatorLine();

    // Invoice details aligned to right for clean layout
    const rightAlign = this.pageWidth - this.margins.right;

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
        this.pdf.setFontSize(12);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
      }
      this.pdf.text(detail, rightAlign - textWidth, detailYPos);
      detailYPos += index === 0 ? 8 : 6;
    });

    this.yPosition += 35;
  }

  /** Render customer billing information section */
  private renderBillingInfo(data: InvoiceData): void {
    this.addSeparatorLine();

    // Bill To section with improved styling
    this.setHeaderStyle(14);
    this.pdf.text('Bill To:', this.margins.left, this.yPosition);
    this.yPosition += 10;

    const customerInfo = [
      data.customer.name || 'Customer Name',
      data.customer.address,
      data.customer.phone ? `Phone: ${data.customer.phone}` : null,
      data.customer.email ? `Email: ${data.customer.email}` : null
    ].filter(Boolean) as string[];

    customerInfo.forEach((line, index) => {
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(12);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
      }
      this.pdf.text(line, this.margins.left, this.yPosition);
      this.yPosition += index === 0 ? 7 : 5;
    });

    this.yPosition += 20;
  }
}