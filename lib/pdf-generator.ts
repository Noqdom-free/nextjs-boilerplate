import jsPDF from 'jspdf';
import { InvoiceData, PAYMENT_TERMS_OPTIONS } from '@/types/invoice';
import { formatCurrency, formatDate } from './utils';
import { Country, COUNTRY_NAMES, type CountryBankingInfo } from '@/types/banking';
import { type PaymentLinksData, type PaymentLinkConfig } from '@/types/payment';

export interface PDFGenerationOptions {
  filename?: string;
  autoDownload?: boolean;
}

export class InvoicePDFGenerator {
  private pdf: jsPDF;
  private readonly pageWidth: number;
  private readonly pageHeight: number;
  private readonly margins = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25
  };
  private yPosition: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = this.margins.top;
  }

  generateInvoicePDF(data: InvoiceData, options: PDFGenerationOptions = {}): Uint8Array {
    this.renderHeader(data);
    this.renderInvoiceDetails(data);
    this.renderBillingInfo(data);
    this.renderPaymentInformation(data);
    this.renderItemsTable(data);
    this.renderTotals(data);
    this.renderPaymentInstructions(data);
    this.renderFooter(data);

    const pdfOutput = this.pdf.output('arraybuffer');

    if (options.autoDownload !== false) {
      const filename = options.filename || `invoice-${data.details.invoiceNumber}.pdf`;
      this.pdf.save(filename);
    }

    return new Uint8Array(pdfOutput);
  }

  private renderHeader(data: InvoiceData): void {
    // INVOICE title with improved styling
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('INVOICE', this.margins.left, this.yPosition);

    // Business information (right-aligned) with better spacing
    const businessInfo = [
      data.business.name || 'Your Business Name',
      data.business.address,
      data.business.phone ? `Phone: ${data.business.phone}` : null,
      data.business.email ? `Email: ${data.business.email}` : null
    ].filter(Boolean) as string[];

    const rightAlign = this.pageWidth - this.margins.right;
    let businessYPos = this.yPosition;

    businessInfo.forEach((line, index) => {
      const textWidth = this.pdf.getTextWidth(line);
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(14);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
      }
      this.pdf.text(line, rightAlign - textWidth, businessYPos);
      businessYPos += index === 0 ? 8 : 6;
    });

    this.yPosition += 40;
  }

  private renderInvoiceDetails(data: InvoiceData): void {
    // Add separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;

    // Invoice details (right-aligned) with improved formatting
    const rightAlign = this.pageWidth - this.margins.right;

    const invoiceDetails = [
      `Invoice #: ${data.details.invoiceNumber}`,
      `Issue Date: ${formatDate(data.details.issueDate)}`,
      `Due Date: ${formatDate(data.details.dueDate)}`,
      `Terms: ${PAYMENT_TERMS_OPTIONS[data.details.paymentTerms as keyof typeof PAYMENT_TERMS_OPTIONS] || 'Net 30'}`
    ];

    let detailYPos = this.yPosition;
    invoiceDetails.forEach((detail, index) => {
      const textWidth = this.pdf.getTextWidth(detail);
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(12);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
      }
      this.pdf.text(detail, rightAlign - textWidth, detailYPos);
      detailYPos += index === 0 ? 8 : 6;
    });

    this.yPosition += 35;
  }

  private renderBillingInfo(data: InvoiceData): void {
    // Add separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;

    // Bill To section with improved styling
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Bill To:', this.margins.left, this.yPosition);
    this.yPosition += 10;

    const customerInfo = [
      data.customer.name || 'Customer Name',
      data.customer.address,
      data.customer.phone ? `Phone: ${data.customer.phone}` : null,
      data.customer.email ? `Email: ${data.customer.email}` : null
    ].filter(Boolean) as string[];

    customerInfo.forEach((line, index) => {
      if (index === 0) {
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setFontSize(12);
      } else {
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
      }
      this.pdf.text(line, this.margins.left, this.yPosition);
      this.yPosition += index === 0 ? 7 : 5;
    });

    this.yPosition += 20;
  }

  // Helper function to format banking information by country
  private formatBankingInfo(bankingInfo: CountryBankingInfo): string[] {
    switch (bankingInfo.country) {
      case Country.US:
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `Routing Number: ${bankingInfo.data.routingNumber}`,
          `Account Number: ${bankingInfo.data.accountNumber}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`,
          ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
        ];
      case Country.EU:
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `IBAN: ${bankingInfo.data.iban}`,
          `BIC/SWIFT: ${bankingInfo.data.bicSwiftCode}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`,
          ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
        ];
      case Country.UK:
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `Sort Code: ${bankingInfo.data.sortCode}`,
          `Account Number: ${bankingInfo.data.accountNumber}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`,
          ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
        ];
      case Country.CA:
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `Institution Number: ${bankingInfo.data.institutionNumber}`,
          `Transit Number: ${bankingInfo.data.transitNumber}`,
          `Account Number: ${bankingInfo.data.accountNumber}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`
        ];
      case Country.AU:
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `BSB Number: ${bankingInfo.data.bsbNumber}`,
          `Account Number: ${bankingInfo.data.accountNumber}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`,
          ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
        ];
      default:
        return [];
    }
  }

  private renderPaymentInformation(data: InvoiceData): void {
    const bankingInfo = data.bankingInfo;
    const paymentLinks = data.paymentLinks;

    // Only render if we have payment information
    if (!bankingInfo && (!paymentLinks?.links || paymentLinks.links.filter(link => link.isEnabled).length === 0)) {
      return;
    }

    // Add separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;

    // Payment Information header
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Payment Information:', this.margins.left, this.yPosition);
    this.yPosition += 15;

    // Banking Information
    if (bankingInfo) {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('Wire Transfer:', this.margins.left, this.yPosition);
      this.yPosition += 8;

      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');

      const bankingDetails = this.formatBankingInfo(bankingInfo);
      bankingDetails.forEach((detail) => {
        this.pdf.text(detail, this.margins.left + 5, this.yPosition);
        this.yPosition += 5;
      });

      this.yPosition += 8;
    }

    // Online Payment Options
    if (paymentLinks?.links) {
      const enabledLinks = paymentLinks.links.filter(link => link.isEnabled);

      if (enabledLinks.length > 0) {
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.setTextColor(0, 0, 0);
        this.pdf.text('Online Payment Options:', this.margins.left, this.yPosition);
        this.yPosition += 8;

        enabledLinks.forEach((link) => {
          const displayName = link.displayName || `Pay with ${link.method.charAt(0).toUpperCase() + link.method.slice(1)}`;

          // Make payment method name clickable
          this.pdf.setFontSize(10);
          this.pdf.setFont('helvetica', 'bold');
          this.pdf.setTextColor(0, 100, 200); // Blue color for links

          const linkText = `• ${displayName}`;
          const textWidth = this.pdf.getTextWidth(linkText);

          this.pdf.text(linkText, this.margins.left + 5, this.yPosition);

          // Add clickable link area
          this.pdf.link(this.margins.left + 5, this.yPosition - 4, textWidth, 6, { url: link.url });

          this.yPosition += 6;

          // Show URL as secondary text
          this.pdf.setFont('helvetica', 'normal');
          this.pdf.setFontSize(9);
          this.pdf.setTextColor(100, 100, 100);
          this.pdf.text(`   ${link.url}`, this.margins.left + 5, this.yPosition);
          this.yPosition += 5;

          // Show instructions if available
          if (link.instructions) {
            this.pdf.setFont('helvetica', 'italic');
            this.pdf.setFontSize(9);
            this.pdf.setTextColor(80, 80, 80);
            this.pdf.text(`   ${link.instructions}`, this.margins.left + 5, this.yPosition);
            this.yPosition += 5;
          }

          this.yPosition += 3;
        });
      }
    }

    // Global payment instructions
    if (paymentLinks?.globalInstructions) {
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'italic');
      this.pdf.setTextColor(60, 60, 60);
      this.pdf.text(paymentLinks.globalInstructions, this.margins.left + 5, this.yPosition);
      this.yPosition += 8;
    }

    this.yPosition += 15;

    // Reset text color
    this.pdf.setTextColor(0, 0, 0);
  }

  private renderItemsTable(data: InvoiceData): void {
    // Add separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;

    const tableStartY = this.yPosition;
    const tableWidth = this.pageWidth - this.margins.left - this.margins.right;

    // Improved column widths
    const descriptionWidth = tableWidth * 0.5;
    const quantityWidth = tableWidth * 0.15;
    const priceWidth = tableWidth * 0.175;
    const totalWidth = tableWidth * 0.175;

    // Table header with better styling
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);

    // Header background with darker color
    this.pdf.setFillColor(230, 230, 230);
    this.pdf.rect(this.margins.left, this.yPosition - 4, tableWidth, 10, 'F');

    // Header text with better positioning
    this.pdf.text('Description', this.margins.left + 3, this.yPosition + 2);
    this.pdf.text('Qty', this.margins.left + descriptionWidth + 3, this.yPosition + 2);
    this.pdf.text('Price', this.margins.left + descriptionWidth + quantityWidth + 3, this.yPosition + 2);
    this.pdf.text('Total', this.margins.left + descriptionWidth + quantityWidth + priceWidth + 3, this.yPosition + 2);

    this.yPosition += 12;

    // Table rows with improved spacing
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);

    const items = data.items.length > 0 ? data.items : [{
      id: '1',
      description: 'Item description',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }];

    items.forEach((item, index) => {
      // Alternate row background
      if (index % 2 === 0) {
        this.pdf.setFillColor(248, 248, 248);
        this.pdf.rect(this.margins.left, this.yPosition - 3, tableWidth, 9, 'F');
      }

      // Row data with better alignment
      this.pdf.text(item.description, this.margins.left + 3, this.yPosition + 1);

      // Center-align quantity
      const qtyText = item.quantity.toString();
      const qtyWidth = this.pdf.getTextWidth(qtyText);
      const qtyX = this.margins.left + descriptionWidth + (quantityWidth - qtyWidth) / 2;
      this.pdf.text(qtyText, qtyX, this.yPosition + 1);

      // Right-align price and total
      const priceText = formatCurrency(item.unitPrice);
      const priceTextWidth = this.pdf.getTextWidth(priceText);
      this.pdf.text(priceText, this.margins.left + descriptionWidth + quantityWidth + priceWidth - priceTextWidth - 3, this.yPosition + 1);

      const totalText = formatCurrency(item.total);
      const totalTextWidth = this.pdf.getTextWidth(totalText);
      this.pdf.text(totalText, this.margins.left + descriptionWidth + quantityWidth + priceWidth + totalWidth - totalTextWidth - 3, this.yPosition + 1);

      this.yPosition += 9;
    });

    // Table border
    this.pdf.setDrawColor(180, 180, 180);
    this.pdf.setLineWidth(0.5);
    this.pdf.rect(this.margins.left, tableStartY - 4, tableWidth, this.yPosition - tableStartY + 4);

    // Column separators
    this.pdf.line(this.margins.left + descriptionWidth, tableStartY - 4, this.margins.left + descriptionWidth, this.yPosition);
    this.pdf.line(this.margins.left + descriptionWidth + quantityWidth, tableStartY - 4, this.margins.left + descriptionWidth + quantityWidth, this.yPosition);
    this.pdf.line(this.margins.left + descriptionWidth + quantityWidth + priceWidth, tableStartY - 4, this.margins.left + descriptionWidth + quantityWidth + priceWidth, this.yPosition);

    this.yPosition += 20;
  }

  private renderTotals(data: InvoiceData): void {
    const rightAlign = this.pageWidth - this.margins.right;
    const labelX = rightAlign - 80;
    const valueX = rightAlign - 5;

    // Totals background
    this.pdf.setFillColor(248, 248, 248);
    const totalsHeight = data.tax.rate > 0 ? 35 : 25;
    this.pdf.rect(labelX - 5, this.yPosition - 5, 85, totalsHeight, 'F');

    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);

    // Subtotal
    this.pdf.text('Subtotal:', labelX, this.yPosition);
    const subtotalText = formatCurrency(data.calculations.subtotal);
    const subtotalWidth = this.pdf.getTextWidth(subtotalText);
    this.pdf.text(subtotalText, valueX - subtotalWidth, this.yPosition);
    this.yPosition += 8;

    // Tax (if applicable)
    if (data.tax.rate > 0) {
      this.pdf.text(`Tax (${data.tax.rate}%):`, labelX, this.yPosition);
      const taxText = formatCurrency(data.calculations.taxAmount);
      const taxWidth = this.pdf.getTextWidth(taxText);
      this.pdf.text(taxText, valueX - taxWidth, this.yPosition);
      this.yPosition += 8;
    }

    // Line above total
    this.pdf.setDrawColor(100, 100, 100);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(labelX, this.yPosition, valueX, this.yPosition);
    this.yPosition += 6;

    // Total with emphasis
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.text('Total:', labelX, this.yPosition);
    const totalText = formatCurrency(data.calculations.total);
    const totalWidth = this.pdf.getTextWidth(totalText);
    this.pdf.text(totalText, valueX - totalWidth, this.yPosition);

    this.yPosition += 25;
  }

  private renderPaymentInstructions(data: InvoiceData): void {
    // Add separator line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;

    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('Payment Instructions:', this.margins.left, this.yPosition);
    this.yPosition += 10;

    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setFontSize(10);
    this.pdf.text('Please remit payment by the due date specified above.', this.margins.left, this.yPosition);
    this.yPosition += 6;

    const contactEmail = data.business.email || 'your business email';
    this.pdf.text(`For questions regarding this invoice, please contact ${contactEmail}.`, this.margins.left, this.yPosition);
    this.yPosition += 12;

    // Notes (if any)
    if (data.details.notes) {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(11);
      this.pdf.text('Notes:', this.margins.left, this.yPosition);
      this.yPosition += 8;

      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(10);

      // Handle long notes with text wrapping
      const maxWidth = this.pageWidth - this.margins.left - this.margins.right;
      const noteLines = this.pdf.splitTextToSize(data.details.notes, maxWidth);

      noteLines.forEach((line: string) => {
        this.pdf.text(line, this.margins.left, this.yPosition);
        this.yPosition += 5;
      });

      this.yPosition += 5;
    }
  }

  private renderFooter(data: InvoiceData): void {
    // Calculate footer position - ensure it's at the bottom but not cut off
    const minFooterY = this.yPosition + 10;
    const idealFooterY = this.pageHeight - this.margins.bottom - 15;
    const footerY = Math.max(minFooterY, idealFooterY);

    // Add separator line above footer
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, footerY - 8, this.pageWidth - this.margins.right, footerY - 8);

    // Thank you message (centered)
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(100, 100, 100);

    const thankYouText = 'Thank you for your business!';
    const textWidth = this.pdf.getTextWidth(thankYouText);
    const centerX = (this.pageWidth - textWidth) / 2;

    this.pdf.text(thankYouText, centerX, footerY);
  }
}

export async function generateInvoicePDF(data: InvoiceData, options?: PDFGenerationOptions): Promise<Uint8Array> {
  // Add a small delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 100));

  const generator = new InvoicePDFGenerator();
  return generator.generateInvoicePDF(data, options);
}