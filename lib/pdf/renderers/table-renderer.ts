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

      // Position quantity under "Qty" header - use EXACT same position as header
      const qtyText = item.quantity.toString();
      const qtyHeaderPos = this.margins.left + descriptionWidth + 2;
      this.pdf.text(qtyText, qtyHeaderPos, this.yPosition);

      // Position price under "Price" header - use EXACT same position as header
      const priceText = formatCurrency(item.unitPrice);
      const priceHeaderPos = this.margins.left + descriptionWidth + quantityWidth + 2;
      this.pdf.text(priceText, priceHeaderPos, this.yPosition);

      // Position total under "Total" header - use EXACT same position as header
      const totalText = formatCurrency(item.total);
      const totalHeaderPos = this.margins.left + descriptionWidth + quantityWidth + priceWidth + 2;
      this.pdf.text(totalText, totalHeaderPos, this.yPosition);

      // Add separator line between items (except after the last item)
      if (index < items.length - 1) {
        this.yPosition += 2; // Simple space before separator
        this.pdf.setDrawColor(240, 240, 240);
        this.pdf.setLineWidth(0.2);
        this.pdf.line(this.margins.left, this.yPosition, this.margins.left + tableWidth, this.yPosition);
        this.yPosition += 2; // Simple space after separator
      } else {
        this.yPosition += 4; // Regular spacing for last item
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
    // Clean table borders like preview - thin lines only
    this.pdf.setDrawColor(240, 240, 240);
    this.pdf.setLineWidth(0.2);
    
    // Top border line under the header - thin like item separators
    this.pdf.line(this.margins.left, headerEndY, this.margins.left + tableWidth, headerEndY);
    
    // Bottom border line under all items - thin like item separators
    this.yPosition += 2; // Small spacing before bottom border
    this.pdf.line(this.margins.left, this.yPosition, this.margins.left + tableWidth, this.yPosition);
  }
}