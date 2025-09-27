import { InvoiceData } from '@/types/invoice';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for invoice header with title and business information */
export class HeaderRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    // Large, bold INVOICE title on left
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('INVOICE', this.margins.left, this.yPosition);

    // Business information aligned to right side
    const businessInfo = [
      data.business.name || 'Your Business Name',
      data.business.address,
      data.business.phone ? `Phone: ${data.business.phone}` : null,
      data.business.email ? `Email: ${data.business.email}` : null
    ].filter(Boolean) as string[];

    const rightAlign = this.pageWidth - this.margins.right;
    let businessYPos = this.yPosition;

    businessInfo.forEach((line, index) => {
      const textWidth = this.pdf.getTextWidth(line);
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(14);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
      }
      this.pdf.text(line, rightAlign - textWidth, businessYPos);
      businessYPos += index === 0 ? 8 : 6;
    });

    this.yPosition += 40;
  }
}