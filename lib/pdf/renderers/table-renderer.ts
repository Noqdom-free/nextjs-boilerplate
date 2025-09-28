import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '../../utils';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for itemized table with description, quantity, price, and totals */
export class TableRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    this.checkPageOverflow(25); // Reduced space check
    this.addSeparatorLine();

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

    this.yPosition += 6; // Further reduced from 12 to 6
  }

  private renderTableHeader(tableWidth: number, descriptionWidth: number, quantityWidth: number, priceWidth: number): void {
    // Table header with better styling
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);

    // Light gray header background for contrast
    this.pdf.setFillColor(230, 230, 230);
    this.pdf.rect(this.margins.left, this.yPosition - 2, tableWidth, 6, 'F'); // Further reduced height

    // Header text with better positioning
    this.pdf.text('Description', this.margins.left + 3, this.yPosition + 1);
    this.pdf.text('Qty', this.margins.left + descriptionWidth + 3, this.yPosition + 1);
    this.pdf.text('Price', this.margins.left + descriptionWidth + quantityWidth + 3, this.yPosition + 1);
    this.pdf.text('Total', this.margins.left + descriptionWidth + quantityWidth + priceWidth + 3, this.yPosition + 1);

    this.yPosition += 6; // Further reduced from 9 to 6
  }

  private renderTableRows(
    data: InvoiceData, 
    tableWidth: number, 
    descriptionWidth: number, 
    quantityWidth: number, 
    priceWidth: number, 
    totalWidth: number
  ): void {
    // Table rows with improved spacing
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(9);

    const items = data.items.length > 0 ? data.items : [{
      id: '1',
      description: 'Item description',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }];

    items.forEach((item, index) => {
      // Check if we need a new page for each row
      this.checkPageOverflow(5);
      
      // Zebra striping for better readability
      if (index % 2 === 0) {
        this.pdf.setFillColor(248, 248, 248);
        this.pdf.rect(this.margins.left, this.yPosition - 1, tableWidth, 5, 'F'); // Further reduced height
      }

      // Row data with better alignment
      this.pdf.text(item.description, this.margins.left + 3, this.yPosition + 1);

      // Center quantity in its column
      const qtyText = item.quantity.toString();
      const qtyWidth = this.pdf.getTextWidth(qtyText);
      const qtyX = this.margins.left + descriptionWidth + (quantityWidth - qtyWidth) / 2;
      this.pdf.text(qtyText, qtyX, this.yPosition + 1);

      // Right-align currency values for clean appearance
      const priceText = formatCurrency(item.unitPrice);
      const priceTextWidth = this.pdf.getTextWidth(priceText);
      this.pdf.text(priceText, this.margins.left + descriptionWidth + quantityWidth + priceWidth - priceTextWidth - 3, this.yPosition + 1);

      const totalText = formatCurrency(item.total);
      const totalTextWidth = this.pdf.getTextWidth(totalText);
      this.pdf.text(totalText, this.margins.left + descriptionWidth + quantityWidth + priceWidth + totalWidth - totalTextWidth - 3, this.yPosition + 1);

      this.yPosition += 5; // Further reduced from 7 to 5
    });
  }

  private renderTableBorders(
    tableStartY: number, 
    tableWidth: number, 
    descriptionWidth: number, 
    quantityWidth: number, 
    priceWidth: number
  ): void {
    // Table border
    this.pdf.setDrawColor(180, 180, 180);
    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margins.left, tableStartY - 2, tableWidth, this.yPosition - tableStartY + 2); // Adjusted for further reduced header height

    // Column separators
    this.pdf.line(this.margins.left + descriptionWidth, tableStartY - 2, this.margins.left + descriptionWidth, this.yPosition);
    this.pdf.line(this.margins.left + descriptionWidth + quantityWidth, tableStartY - 2, this.margins.left + descriptionWidth + quantityWidth, this.yPosition);
    this.pdf.line(this.margins.left + descriptionWidth + quantityWidth + priceWidth, tableStartY - 2, this.margins.left + descriptionWidth + quantityWidth + priceWidth, this.yPosition);
  }
}