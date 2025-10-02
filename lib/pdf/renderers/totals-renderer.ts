import { InvoiceData } from '@/types/invoice';
import { Currency } from '@/types/currency';
import { formatCurrency } from '../../utils';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for subtotal, tax, and total amounts */
export class TotalsRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    this.checkPageOverflow(20);
    
    // Create clean right-aligned totals like preview - no background box
    const rightAlign = this.pageWidth - this.margins.right;
    const totalsWidth = 70; // Width of totals section
    const labelX = rightAlign - totalsWidth;
    const valueX = rightAlign - 5;

    // Small, clean typography like preview
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);

    this.renderSubtotal(data, labelX, valueX);
    
    if (data.tax.rate > 0) {
      this.renderTax(data, labelX, valueX);
    }

    this.renderTotalSeparator(labelX, valueX);
    this.renderFinalTotal(data, labelX, valueX);

    this.yPosition += 6; // Clean spacing after totals
  }

  private renderSubtotal(data: InvoiceData, labelX: number, valueX: number): void {
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(9);
    this.pdf.text('Subtotal:', labelX, this.yPosition);
    const currency = data.currency || Currency.USD;
    const subtotalText = formatCurrency(data.calculations.subtotal, currency);
    const subtotalWidth = this.pdf.getTextWidth(subtotalText);
    this.pdf.text(subtotalText, valueX - subtotalWidth, this.yPosition);
    this.yPosition += 5;
  }

  private renderTax(data: InvoiceData, labelX: number, valueX: number): void {
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(9);
    this.pdf.text(`Tax (${data.tax.rate}%):`, labelX, this.yPosition);
    const currency = data.currency || Currency.USD;
    const taxText = formatCurrency(data.calculations.taxAmount, currency);
    const taxWidth = this.pdf.getTextWidth(taxText);
    this.pdf.text(taxText, valueX - taxWidth, this.yPosition);
    this.yPosition += 5;
  }

  private renderTotalSeparator(labelX: number, valueX: number): void {
    // Clean separator line like preview
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(labelX, this.yPosition, valueX, this.yPosition);
    this.yPosition += 4;
  }

  private renderFinalTotal(data: InvoiceData, labelX: number, valueX: number): void {
    // Bold total but keep font size reasonable like preview
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10); // Slightly larger but not huge
    this.pdf.text('Total:', labelX, this.yPosition);
    const currency = data.currency || Currency.USD;
    const totalText = formatCurrency(data.calculations.total, currency);
    const totalWidth = this.pdf.getTextWidth(totalText);
    this.pdf.text(totalText, valueX - totalWidth, this.yPosition);
  }
}