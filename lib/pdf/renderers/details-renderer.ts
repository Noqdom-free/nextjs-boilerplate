import { InvoiceData, PAYMENT_TERMS_OPTIONS } from '@/types/invoice';
import { formatDate } from '../../utils';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for invoice details and customer billing information */
export class DetailsRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    this.renderBillingInfo(data);
  }

  /** Render customer billing information section */
  private renderBillingInfo(data: InvoiceData): void {
    this.checkPageOverflow(25);

    // Bill To section with small, clean typography like preview
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Bill To:', this.margins.left, this.yPosition);
    this.yPosition += 6;

    const customerInfo = [
      data.customer.name || 'Customer Name',
      data.customer.address,
      data.customer.phone ? `Phone: ${data.customer.phone}` : null,
      data.customer.email ? `Email: ${data.customer.email}` : null
    ].filter(Boolean) as string[];

    customerInfo.forEach((line, index) => {
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(9);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(9);
      }
      this.pdf.text(line, this.margins.left, this.yPosition);
      this.yPosition += 4; // Consistent spacing
    });

    this.yPosition += 6; // Space before next section
  }
  
  /** Add clean separator line like preview */
  private addCleanSeparator(): void {
    this.pdf.setDrawColor(220, 220, 220);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 6;
  }
}