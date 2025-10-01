import { InvoiceData } from '@/types/invoice';
import { PDFRendererBase } from '../pdf-renderer-base';
import { formatBankingInfo } from '../banking-formatter';

/** Renderer for payment methods including banking and online options */
export class PaymentRenderer extends PDFRendererBase {
  render(data: InvoiceData): void {
    const bankingInfo = data.bankingInfo;
    const paymentLinks = data.paymentLinks;

    // Skip section if no payment options are available
    if (!bankingInfo && (!paymentLinks?.links || paymentLinks.links.filter(link => link.isEnabled).length === 0)) {
      return;
    }

    this.checkPageOverflow(25);
    this.addCleanSeparator();

    // Payment Information header - small and clean like preview
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Payment Information:', this.margins.left, this.yPosition);
    this.yPosition += 6;

    // Wire transfer details section
    if (bankingInfo) {
      this.renderBankingDetails(bankingInfo);
    }

    // Digital payment methods (PayPal, Stripe, etc.)
    if (paymentLinks?.links) {
      this.renderPaymentLinks(paymentLinks);
    }

    // Global payment instructions
    if (paymentLinks?.globalInstructions) {
      this.renderGlobalInstructions(paymentLinks.globalInstructions);
    }

    this.yPosition += 4;
    this.resetTextFormatting();
  }

  private renderBankingDetails(bankingInfo: any): void {
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Wire Transfer:', this.margins.left, this.yPosition);
    this.yPosition += 4;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(8);

    const bankingDetails = formatBankingInfo(bankingInfo);
    bankingDetails.forEach((detail) => {
      this.pdf.text(detail, this.margins.left + 5, this.yPosition);
      this.yPosition += 3;
    });

    this.yPosition += 4;
  }

  private renderPaymentLinks(paymentLinks: any): void {
    const enabledLinks = paymentLinks.links.filter((link: any) => link.isEnabled);

    if (enabledLinks.length > 0) {
      this.pdf.setFontSize(9);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text('Online Payment Options:', this.margins.left, this.yPosition);
      this.yPosition += 4;

      enabledLinks.forEach((link: any) => {
        const displayName = link.displayName || `Pay with ${link.method.charAt(0).toUpperCase() + link.method.slice(1)}`;

        // Display name as regular text
        this.pdf.setFontSize(8);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(0, 0, 0); // Black color for display name

        this.pdf.text(displayName, this.margins.left + 5, this.yPosition);
        this.yPosition += 3;

        // Show URL as primary clickable link with blue color
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(0, 100, 200); // Blue color for clickable URL link

        // Create clickable hyperlink
        const linkText = `Click here to pay online: ${link.url}`;
        this.pdf.textWithLink(linkText, this.margins.left + 5, this.yPosition, { url: link.url });
        this.yPosition += 3;

        // Show instructions if available
        if (link.instructions) {
          this.pdf.setFont('helvetica', 'italic');
          this.pdf.setFontSize(7);
          this.pdf.setTextColor(80, 80, 80);
          this.pdf.text(link.instructions, this.margins.left + 5, this.yPosition);
          this.yPosition += 3;
        }

        this.yPosition += 1;
      });
    }
  }

  private renderGlobalInstructions(instructions: string): void {
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(60, 60, 60);
    this.pdf.text(instructions, this.margins.left + 5, this.yPosition);
    this.yPosition += 4;
  }
  
  /** Add clean separator line like preview */
  private addCleanSeparator(): void {
    this.pdf.setDrawColor(220, 220, 220);
    this.pdf.setLineWidth(0.3);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 6;
  }
}