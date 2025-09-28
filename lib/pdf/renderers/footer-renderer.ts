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
    this.addCleanSeparator();

    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(9);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Payment Instructions:', this.margins.left, this.yPosition);
    this.yPosition += 4;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);
    this.pdf.text('Please remit payment by the due date specified above.', this.margins.left, this.yPosition);
    this.yPosition += 3;

    const contactEmail = data.business.email || 'your business email';
    this.pdf.text(`For questions regarding this invoice, please contact ${contactEmail}.`, this.margins.left, this.yPosition);
    this.yPosition += 4;

    // Additional notes or special instructions
    if (data.details.notes) {
      this.renderNotes(data.details.notes);
    }
  }

  private renderNotes(notes: string): void {
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(8);
    this.pdf.text('Notes:', this.margins.left, this.yPosition);
    this.yPosition += 3;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);

    // Wrap long text to fit within margins
    const maxWidth = this.pageWidth - this.margins.left - this.margins.right;
    const noteLines = this.pdf.splitTextToSize(notes, maxWidth);

    noteLines.forEach((line: string) => {
      this.pdf.text(line, this.margins.left, this.yPosition);
      this.yPosition += 3;
    });

    this.yPosition += 3;
  }

  /** Render footer with thank you message */
  private renderFooter(_data: InvoiceData): void {
    // Simple centered thank you like preview
    this.yPosition += 6;
    
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(100, 100, 100);

    const thankYouText = 'Thank you for your business!';
    const centerX = this.getCenterAlignedX(thankYouText);

    this.pdf.text(thankYouText, centerX, this.yPosition);
  }
  
  /** Add clean separator line like preview */
  private addCleanSeparator(): void {
    this.pdf.setDrawColor(220, 220, 220);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 6;
  }
}