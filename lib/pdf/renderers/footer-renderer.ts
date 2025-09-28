import { InvoiceData } from '@/types/invoice';
import { PDFRendererBase } from '../pdf-renderer-base';

/** Renderer for payment instructions and footer */
export class FooterRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    this.checkPageOverflow(20); // Reduced space check
    this.renderPaymentInstructions(data);
    this.renderFooter(data);
  }

  /** Render payment instructions and notes section */
  private renderPaymentInstructions(data: InvoiceData): void {
    this.addSeparatorLine();

    this.setHeaderStyle(11);
    this.pdf.text('Payment Instructions:', this.margins.left, this.yPosition);
    this.yPosition += 5; // Further reduced from 8 to 5

    this.setNormalStyle(9);
    this.pdf.text('Please remit payment by the due date specified above.', this.margins.left, this.yPosition);
    this.yPosition += 3; // Further reduced from 5 to 3

    const contactEmail = data.business.email || 'your business email';
    this.pdf.text(`For questions regarding this invoice, please contact ${contactEmail}.`, this.margins.left, this.yPosition);
    this.yPosition += 5; // Further reduced from 8 to 5

    // Additional notes or special instructions
    if (data.details.notes) {
      this.renderNotes(data.details.notes);
    }
  }

  private renderNotes(notes: string): void {
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.pdf.text('Notes:', this.margins.left, this.yPosition);
    this.yPosition += 4; // Further reduced from 6 to 4

    this.setNormalStyle(9);

    // Wrap long text to fit within margins
    const maxWidth = this.pageWidth - this.margins.left - this.margins.right;
    const noteLines = this.pdf.splitTextToSize(notes, maxWidth);

    noteLines.forEach((line: string) => {
      this.pdf.text(line, this.margins.left, this.yPosition);
      this.yPosition += 3; // Further reduced from 4 to 3
    });

    this.yPosition += 3; // Further reduced from 4 to 3
  }

  /** Render footer with thank you message */
  private renderFooter(_data: InvoiceData): void {
    // Position footer at bottom of page or after content, whichever is lower
    const minFooterY = this.yPosition + 10;
    const idealFooterY = this.pageHeight - this.margins.bottom - 15;
    const footerY = Math.max(minFooterY, idealFooterY);

    // Add separator line above footer
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, footerY - 8, this.pageWidth - this.margins.right, footerY - 8);

    // Centered thank you message in gray italic
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(100, 100, 100);

    const thankYouText = 'Thank you for your business!';
    const centerX = this.getCenterAlignedX(thankYouText);

    this.pdf.text(thankYouText, centerX, footerY);
  }
}