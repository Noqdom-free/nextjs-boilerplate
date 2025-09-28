import { InvoiceData } from '@/types/invoice';
import { formatCurrency } from '../../utils';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for itemized table with description, quantity, price, and totals */
export class TableRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    this.checkPageOverflow(25);
    
    // Add proper spacing before table to prevent overlap with previous content
    this.yPosition += 8;

    const tableWidth = this.pageWidth - this.margins.left - this.margins.right;

    // Proportional column widths for optimal layout
    const descriptionWidth = tableWidth * 0.5;   // 50% for item description
    const quantityWidth = tableWidth * 0.15;     // 15% for quantity
    const priceWidth = tableWidth * 0.175;       // 17.5% for unit price
    const totalWidth = tableWidth * 0.175;       // 17.5% for line total

    // Render header and track where it ends
    const headerStartY = this.yPosition;
    this.renderTableHeader(tableWidth, descriptionWidth, quantityWidth, priceWidth);
    const headerEndY = this.yPosition;
    
    // Render table rows
    this.renderTableRows(data, tableWidth, descriptionWidth, quantityWidth, priceWidth, totalWidth);
    
    // Render borders starting AFTER header text is complete
    this.renderTableBorders(headerStartY, headerEndY, tableWidth, descriptionWidth, quantityWidth, priceWidth);

    this.yPosition += 6;
  }

  private renderTableHeader(_tableWidth: number, descriptionWidth: number, quantityWidth: number, priceWidth: number): void {
    // Add space above header to ensure it's not overlapped by borders
    this.yPosition += 4;
    
    // Clean table header like preview - small fonts, no background
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);

    // Clean header text positioning like preview - aligned left like other sections
    this.pdf.text('Description', this.margins.left, this.yPosition);
    this.pdf.text('Qty', this.margins.left + descriptionWidth + 2, this.yPosition);
    this.pdf.text('Price', this.margins.left + descriptionWidth + quantityWidth + 2, this.yPosition);
    this.pdf.text('Total', this.margins.left + descriptionWidth + quantityWidth + priceWidth + 2, this.yPosition);

    this.yPosition += 6; // Space after header before rows
  }

  private renderTableRows(
    data: InvoiceData, 
    tableWidth: number, 
    descriptionWidth: number, 
    quantityWidth: number, 
    priceWidth: number, 
    totalWidth: number
  ): void {
    // Clean table rows like preview - small fonts, no backgrounds
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);

    const items = data.items.length > 0 ? data.items : [{
      id: '1',
      description: 'Item description',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }];

    items.forEach((item, index) => {
      this.checkPageOverflow(6);

      // Clean row data alignment - no background
      this.pdf.text(item.description, this.margins.left, this.yPosition);

      // Center quantity under "Qty" header
      const qtyText = item.quantity.toString();
      const qtyTextWidth = this.pdf.getTextWidth(qtyText);
      const qtyColumnCenter = this.margins.left + descriptionWidth + 2 + (quantityWidth - 4) / 2;
      const qtyX = qtyColumnCenter - qtyTextWidth / 2;
      this.pdf.text(qtyText, qtyX, this.yPosition);

      // Right-align price under "Price" header
      const priceText = formatCurrency(item.unitPrice);
      const priceColumnEnd = this.margins.left + descriptionWidth + quantityWidth + priceWidth;
      const priceTextWidth = this.pdf.getTextWidth(priceText);
      this.pdf.text(priceText, priceColumnEnd - priceTextWidth - 2, this.yPosition);

      // Right-align total under "Total" header
      const totalText = formatCurrency(item.total);
      const totalColumnEnd = this.margins.left + descriptionWidth + quantityWidth + priceWidth + totalWidth;
      const totalTextWidth = this.pdf.getTextWidth(totalText);
      this.pdf.text(totalText, totalColumnEnd - totalTextWidth - 2, this.yPosition);

      this.yPosition += 4; // Compact spacing
      
      // Add separator line between items (except after the last item)
      if (index < items.length - 1) {
        this.yPosition += 1; // Small space before separator
        this.pdf.setDrawColor(240, 240, 240);
        this.pdf.setLineWidth(0.2);
        this.pdf.line(this.margins.left, this.yPosition, this.margins.left + tableWidth, this.yPosition);
        this.yPosition += 1; // Small space after separator
      }
    });
  }

  private renderTableBorders(
    _headerStartY: number,
    headerEndY: number, 
    tableWidth: number, 
    _descriptionWidth: number, 
    _quantityWidth: number, 
    _priceWidth: number
  ): void {
    // Clean table borders like preview - simple horizontal lines only
    this.pdf.setDrawColor(220, 220, 220);
    this.pdf.setLineWidth(0.3);
    
    // Top border line under the header
    this.pdf.line(this.margins.left, headerEndY, this.margins.left + tableWidth, headerEndY);
    
    // Bottom border line under all items
    this.yPosition += 2; // Small spacing before bottom border
    this.pdf.line(this.margins.left, this.yPosition, this.margins.left + tableWidth, this.yPosition);
  }
}