import jsPDF from 'jspdf';
import { InvoiceData } from '@/types/invoice';

/** Base class for PDF renderers with common utilities and state management */
export abstract class PDFRendererBase {
  protected pdf: jsPDF;
  protected readonly pageWidth: number;
  protected readonly pageHeight: number;
  protected readonly margins = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25
  };
  protected yPosition: number;

  constructor(pdf: jsPDF, initialYPosition: number) {
    this.pdf = pdf;
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = initialYPosition;
  }

  /** Get current Y position for chaining renderers */
  getCurrentY(): number {
    return this.yPosition;
  }

  /** Set Y position for precise control */
  setCurrentY(y: number): void {
    this.yPosition = y;
  }

  /** Add a visual separator line */
  protected addSeparatorLine(): void {
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;
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