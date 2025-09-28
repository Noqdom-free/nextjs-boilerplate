import jsPDF from 'jspdf';
import { InvoiceData } from '@/types/invoice';

/** Base class for PDF renderers with common utilities and state management */
export abstract class PDFRendererBase {
  protected pdf: jsPDF;
  protected readonly pageWidth: number;
  protected readonly pageHeight: number;
  protected readonly margins = {
    top: 15,
    bottom: 15,
    left: 15,
    right: 15
  };
  protected yPosition: number;
  protected currentPageNumber: number;

  constructor(pdf: jsPDF, initialYPosition: number) {
    this.pdf = pdf;
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = initialYPosition;
    this.currentPageNumber = 1;
  }

  /** Get current Y position for chaining renderers */
  getCurrentY(): number {
    return this.yPosition;
  }

  /** Set Y position for precise control */
  setCurrentY(y: number): void {
    this.yPosition = y;
  }

  /** Check if we need a new page and create one if necessary */
  protected checkPageOverflow(requiredSpace: number = 10): boolean {
    const remainingSpace = this.pageHeight - this.margins.bottom - this.yPosition;
    if (remainingSpace < requiredSpace) {
      this.addNewPage();
      return true;
    }
    return false;
  }

  /** Add a new page and reset Y position */
  protected addNewPage(): void {
    this.pdf.addPage();
    this.currentPageNumber++;
    this.yPosition = this.margins.top;
  }

  /** Get remaining space on current page */
  protected getRemainingSpace(): number {
    return this.pageHeight - this.margins.bottom - this.yPosition;
  }

  /** Add a clean separator line like preview */
  protected addSeparatorLine(): void {
    this.checkPageOverflow(10);
    this.pdf.setDrawColor(220, 220, 220);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 6;
  }

  /** Reset text formatting to default black */
  protected resetTextFormatting(): void {
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
  }

  /** Set header text styling */
  protected setHeaderStyle(fontSize = 14): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
  }

  /** Set normal text styling */
  protected setNormalStyle(fontSize = 10): void {
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
  }

  /** Calculate right-aligned text position */
  protected getRightAlignedX(text: string): number {
    const textWidth = this.pdf.getTextWidth(text);
    return this.pageWidth - this.margins.right - textWidth;
  }

  /** Calculate center-aligned text position */
  protected getCenterAlignedX(text: string): number {
    const textWidth = this.pdf.getTextWidth(text);
    return (this.pageWidth - textWidth) / 2;
  }

  /** Abstract method that each renderer must implement */
  abstract render(data: InvoiceData): void;
}