import { InvoiceData } from '@/types/invoice';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for invoice header with title and business information */
export class HeaderRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    // Create two-column layout like preview
    const leftColumnX = this.margins.left;
    const rightColumnX = this.pageWidth - this.margins.right - 80; // Space for invoice details
    
    // Left side: INVOICE title and business info
    this.renderLeftColumn(data, leftColumnX);
    
    // Right side: Invoice details
    this.renderRightColumn(data, rightColumnX);
    
    this.yPosition += 20; // Moderate spacing after header
  }
  
  private renderLeftColumn(data: InvoiceData, x: number): void {
    let currentY = this.yPosition;
    
    // INVOICE title - smaller and cleaner like preview
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('INVOICE', x, currentY);
    currentY += 8;
    
    // Business name - prominent but not huge
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(data.business.name || 'Your Business Name', x, currentY);
    currentY += 5;
    
    // Business details - small, clean typography like preview
    const businessInfo = [
      data.business.address,
      data.business.phone ? `Phone: ${data.business.phone}` : null,
      data.business.email ? `Email: ${data.business.email}` : null
    ].filter(Boolean) as string[];
    
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    
    businessInfo.forEach((line) => {
      this.pdf.text(line, x, currentY);
      currentY += 4;
    });
  }
  
  private renderRightColumn(data: InvoiceData, x: number): void {
    let currentY = this.yPosition;
    const rightAlign = this.pageWidth - this.margins.right;
    
    // Invoice details with consistent small typography like preview
    const invoiceDetails = [
      `Invoice #: ${data.details.invoiceNumber}`,
      `Issue Date: ${this.formatDate(data.details.issueDate)}`,
      `Due Date: ${this.formatDate(data.details.dueDate)}`,
      `Terms: Net 30`
    ];
    
    invoiceDetails.forEach((detail, index) => {
      const textWidth = this.pdf.getTextWidth(detail);
      
      if (index === 0) {
        // Invoice number - slightly bold
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(9);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(9);
      }
      
      this.pdf.text(detail, rightAlign - textWidth, currentY);
      currentY += 4;
    });
  }
  
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}