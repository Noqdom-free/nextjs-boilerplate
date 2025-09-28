import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '../../utils';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for itemized table with description, quantity, price, and totals */
export class TableRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    this.checkPageOverflow(25);

    const tableStartY = this.yPosition;
    const tableWidth = this.pageWidth - this.margins.left - this.margins.right;

    // Proportional column widths for optimal layout
    const descriptionWidth = tableWidth * 0.5;   // 50% for item description
    const quantityWidth = tableWidth * 0.15;     // 15% for quantity
    const priceWidth = tableWidth * 0.175;       // 17.5% for unit price
    const totalWidth = tableWidth * 0.175;       // 17.5% for line total

    this.renderTableHeader(tableWidth, descriptionWidth, quantityWidth, priceWidth);
    this.renderTableRows(data, tableWidth, descriptionWidth, quantityWidth, priceWidth, totalWidth);
    this.renderTableBorders(tableStartY, tableWidth, descriptionWidth, quantityWidth, priceWidth);

    this.yPosition += 6;
  }

  private renderTableHeader(_tableWidth: number, descriptionWidth: number, quantityWidth: number, priceWidth: number): void {
    // Clean table header like preview - small fonts, no background
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);

    // Clean header text positioning like preview
    this.pdf.text('Description', this.margins.left + 2, this.yPosition);
    this.pdf.text('Qty', this.margins.left + descriptionWidth + 2, this.yPosition);
    this.pdf.text('Price', this.margins.left + descriptionWidth + quantityWidth + 2, this.yPosition);
    this.pdf.text('Total', this.margins.left + descriptionWidth + quantityWidth + priceWidth + 2, this.yPosition);

    this.yPosition += 5; // Clean spacing
  }

  private renderTableRows(
    data: InvoiceData, 
    tableWidth: number, 
    descriptionWidth: number, 
    quantityWidth: number, 
    priceWidth: number, 
    totalWidth: number
  ): void {
    // Clean table rows like preview - small fonts, subtle striping
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8); // Even smaller for content density

    const items = data.items.length > 0 ? data.items : [{
      id: '1',
      description: 'Item description',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }];

    items.forEach((item, index) => {
      this.checkPageOverflow(4);
      
      // Very subtle zebra striping like preview
      if (index % 2 === 0) {
        this.pdf.setFillColor(252, 252, 252);
        this.pdf.rect(this.margins.left, this.yPosition - 1, tableWidth, 4, 'F');
      }

      // Clean row data alignment
      this.pdf.text(item.description, this.margins.left + 2, this.yPosition);

      // Center quantity
      const qtyText = item.quantity.toString();
      const qtyWidth = this.pdf.getTextWidth(qtyText);
      const qtyX = this.margins.left + descriptionWidth + (quantityWidth - qtyWidth) / 2;
      this.pdf.text(qtyText, qtyX, this.yPosition);

      // Right-align currency values
      const priceText = formatCurrency(item.unitPrice);
      const priceTextWidth = this.pdf.getTextWidth(priceText);
      this.pdf.text(priceText, this.margins.left + descriptionWidth + quantityWidth + priceWidth - priceTextWidth - 2, this.yPosition);

      const totalText = formatCurrency(item.total);
      const totalTextWidth = this.pdf.getTextWidth(totalText);
      this.pdf.text(totalText, this.margins.left + descriptionWidth + quantityWidth + priceWidth + totalWidth - totalTextWidth - 2, this.yPosition);

      this.yPosition += 4; // Compact spacing
    });
  }

  private renderTableBorders(
    tableStartY: number, 
    tableWidth: number, 
    descriptionWidth: number, 
    quantityWidth: number, 
    priceWidth: number
  ): void {
    // Clean table borders like preview
    this.pdf.setDrawColor(220, 220, 220);
    this.pdf.setLineWidth(0.3);
    this.pdf.rect(this.margins.left, tableStartY - 1, tableWidth, this.yPosition - tableStartY + 1);

    // Subtle column separators
    this.pdf.line(this.margins.left + descriptionWidth, tableStartY - 1, this.margins.left + descriptionWidth, this.yPosition);
    this.pdf.line(this.margins.left + descriptionWidth + quantityWidth, tableStartY - 1, this.margins.left + descriptionWidth + quantityWidth, this.yPosition);
    this.pdf.line(this.margins.left + descriptionWidth + quantityWidth + priceWidth, tableStartY - 1, this.margins.left + descriptionWidth + quantityWidth + priceWidth, this.yPosition);
  }
}