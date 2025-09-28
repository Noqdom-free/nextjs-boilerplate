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

    this.checkPageOverflow(25); // Reduced space check
    this.addSeparatorLine();

    // Payment Information header
    this.setHeaderStyle(12);
    this.pdf.text('Payment Information:', this.margins.left, this.yPosition);
    this.yPosition += 6; // Further reduced from 10 to 6

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

    this.yPosition += 5; // Further reduced from 8 to 5
    this.resetTextFormatting();
  }

  private renderBankingDetails(bankingInfo: any): void {
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Wire Transfer:', this.margins.left, this.yPosition);
    this.yPosition += 4; // Further reduced from 6 to 4

    this.setNormalStyle(9);

    const bankingDetails = formatBankingInfo(bankingInfo);
    bankingDetails.forEach((detail) => {
      this.pdf.text(detail, this.margins.left + 5, this.yPosition);
      this.yPosition += 3; // Further reduced from 4 to 3
    });

    this.yPosition += 4; // Further reduced from 6 to 4
  }

  private renderPaymentLinks(paymentLinks: any): void {
    const enabledLinks = paymentLinks.links.filter((link: any) => link.isEnabled);

    if (enabledLinks.length > 0) {
      this.pdf.setFontSize(11);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.text('Online Payment Options:', this.margins.left, this.yPosition);
      this.yPosition += 4; // Further reduced from 6 to 4

      enabledLinks.forEach((link: any) => {
        const displayName = link.displayName || `Pay with ${link.method.charAt(0).toUpperCase() + link.method.slice(1)}`;

        // Style as clickable blue link
        this.pdf.setFontSize(9);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(0, 100, 200);

        const linkText = `• ${displayName}`;
        const textWidth = this.pdf.getTextWidth(linkText);

        this.pdf.text(linkText, this.margins.left + 5, this.yPosition);

        // Make text clickable in PDF viewers
        this.pdf.link(this.margins.left + 5, this.yPosition - 4, textWidth, 6, { url: link.url });

        this.yPosition += 4; // Further reduced from 5 to 4

        // Show URL as secondary text
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(8);
        this.pdf.setTextColor(100, 100, 100);
        this.pdf.text(`   ${link.url}`, this.margins.left + 5, this.yPosition);
        this.yPosition += 3; // Further reduced from 4 to 3

        // Show instructions if available
        if (link.instructions) {
          this.pdf.setFont('helvetica', 'italic');
          this.pdf.setFontSize(8);
          this.pdf.setTextColor(80, 80, 80);
          this.pdf.text(`   ${link.instructions}`, this.margins.left + 5, this.yPosition);
          this.yPosition += 3; // Further reduced from 4 to 3
        }

        this.yPosition += 1; // Further reduced from 2 to 1
      });
    }
  }

  private renderGlobalInstructions(instructions: string): void {
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(60, 60, 60);
    this.pdf.text(instructions, this.margins.left + 5, this.yPosition);
    this.yPosition += 4; // Further reduced from 6 to 4
  }
}