import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '../../utils';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for subtotal, tax, and total amounts */
export class TotalsRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    const rightAlign = this.pageWidth - this.margins.right;
    const labelX = rightAlign - 80;  // Labels column position
    const valueX = rightAlign - 5;   // Values column position

    // Light background box for totals section
    this.pdf.setFillColor(248, 248, 248);
    const totalsHeight = data.tax.rate > 0 ? 35 : 25;  // Adjust height for tax line
    this.pdf.rect(labelX - 5, this.yPosition - 5, 85, totalsHeight, 'F');

    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);

    this.renderSubtotal(data, labelX, valueX);
    
    if (data.tax.rate > 0) {
      this.renderTax(data, labelX, valueX);
    }

    this.renderTotalSeparator(labelX, valueX);
    this.renderFinalTotal(data, labelX, valueX);

    this.yPosition += 25;
  }

  private renderSubtotal(data: InvoiceData, labelX: number, valueX: number): void {
    this.pdf.text('Subtotal:', labelX, this.yPosition);
    const subtotalText = formatCurrency(data.calculations.subtotal);
    const subtotalWidth = this.pdf.getTextWidth(subtotalText);
    this.pdf.text(subtotalText, valueX - subtotalWidth, this.yPosition);
    this.yPosition += 8;
  }

  private renderTax(data: InvoiceData, labelX: number, valueX: number): void {
    this.pdf.text(`Tax (${data.tax.rate}%):`, labelX, this.yPosition);
    const taxText = formatCurrency(data.calculations.taxAmount);
    const taxWidth = this.pdf.getTextWidth(taxText);
    this.pdf.text(taxText, valueX - taxWidth, this.yPosition);
    this.yPosition += 8;
  }

  private renderTotalSeparator(labelX: number, valueX: number): void {
    // Separator line above final total
    this.pdf.setDrawColor(100, 100, 100);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(labelX, this.yPosition, valueX, this.yPosition);
    this.yPosition += 6;
  }

  private renderFinalTotal(data: InvoiceData, labelX: number, valueX: number): void {
    // Bold, larger font for final total
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.text('Total:', labelX, this.yPosition);
    const totalText = formatCurrency(data.calculations.total);
    const totalWidth = this.pdf.getTextWidth(totalText);
    this.pdf.text(totalText, valueX - totalWidth, this.yPosition);
  }
}