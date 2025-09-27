import jsPDF from 'jspdf';
import { InvoiceData, PAYMENT_TERMS_OPTIONS } from '@/types/invoice';
import { formatCurrency, formatDate } from './utils';
import { Country, COUNTRY_NAMES, type CountryBankingInfo } from '@/types/banking';
import { type PaymentLinksData, type PaymentLinkConfig } from '@/types/payment';

/** Options for PDF generation and download behavior */
export interface PDFGenerationOptions {
  filename?: string;
  autoDownload?: boolean;
}

/** PDF generator for creating professional invoice documents */
export class InvoicePDFGenerator {
  private pdf: jsPDF;
  private readonly pageWidth: number;
  private readonly pageHeight: number;
  // Standard margins for professional document layout
  private readonly margins = {
    top: 25,
    bottom: 25,
    left: 25,
    right: 25
  };
  // Current vertical position for content placement
  private yPosition: number;

  constructor() {
    // Initialize A4 portrait PDF with millimeter units
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageWidth = this.pdf.internal.pageSize.getWidth();
    this.pageHeight = this.pdf.internal.pageSize.getHeight();
    this.yPosition = this.margins.top;
  }

  /** Generate complete invoice PDF with all sections */
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

    // Auto-download unless explicitly disabled
    if (options.autoDownload !== false) {
      const filename = options.filename || `invoice-${data.details.invoiceNumber}.pdf`;
      this.pdf.save(filename);
    }

    return new Uint8Array(pdfOutput);
  }

  /** Render invoice header with title and business information */
  private renderHeader(data: InvoiceData): void {
    // Large, bold INVOICE title on left
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('INVOICE', this.margins.left, this.yPosition);

    // Business information aligned to right side
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

  /** Render invoice number, dates, and payment terms */
  private renderInvoiceDetails(data: InvoiceData): void {
    // Visual separator between sections
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;

    // Invoice details aligned to right for clean layout
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

  /** Render customer billing information section */
  private renderBillingInfo(data: InvoiceData): void {
    // Visual separator between sections
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

  /** Format banking details based on country-specific requirements */
  private formatBankingInfo(bankingInfo: CountryBankingInfo): string[] {
    switch (bankingInfo.country) {
      case Country.US:
        // US banking format: routing + account number
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `Routing Number: ${bankingInfo.data.routingNumber}`,
          `Account Number: ${bankingInfo.data.accountNumber}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`,
          ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
        ];
      case Country.EU:
        // European format: IBAN + BIC/SWIFT
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `IBAN: ${bankingInfo.data.iban}`,
          `BIC/SWIFT: ${bankingInfo.data.bicSwiftCode}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`,
          ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
        ];
      case Country.UK:
        // UK format: sort code + account number
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `Sort Code: ${bankingInfo.data.sortCode}`,
          `Account Number: ${bankingInfo.data.accountNumber}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`,
          ...(bankingInfo.data.bankAddress ? [`Bank Address: ${bankingInfo.data.bankAddress}`] : [])
        ];
      case Country.CA:
        // Canadian format: institution + transit + account
        return [
          `Bank: ${bankingInfo.data.bankName}`,
          `Institution Number: ${bankingInfo.data.institutionNumber}`,
          `Transit Number: ${bankingInfo.data.transitNumber}`,
          `Account Number: ${bankingInfo.data.accountNumber}`,
          `Account Holder: ${bankingInfo.data.accountHolderName}`
        ];
      case Country.AU:
        // Australian format: BSB + account number
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

  /** Render payment methods including banking and online options */
  private renderPaymentInformation(data: InvoiceData): void {
    const bankingInfo = data.bankingInfo;
    const paymentLinks = data.paymentLinks;

    // Skip section if no payment options are available
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

    // Wire transfer details section
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

    // Digital payment methods (PayPal, Stripe, etc.)
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

          // Style as clickable blue link
          this.pdf.setFontSize(10);
          this.pdf.setFont('helvetica', 'bold');
          this.pdf.setTextColor(0, 100, 200);

          const linkText = `• ${displayName}`;
          const textWidth = this.pdf.getTextWidth(linkText);

          this.pdf.text(linkText, this.margins.left + 5, this.yPosition);

          // Make text clickable in PDF viewers
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

    // Reset to default black text
    this.pdf.setTextColor(0, 0, 0);
  }

  /** Render itemized table with description, quantity, price, and totals */
  private renderItemsTable(data: InvoiceData): void {
    // Visual separator between sections
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margins.left, this.yPosition, this.pageWidth - this.margins.right, this.yPosition);
    this.yPosition += 15;

    const tableStartY = this.yPosition;
    const tableWidth = this.pageWidth - this.margins.left - this.margins.right;

    // Proportional column widths for optimal layout
    const descriptionWidth = tableWidth * 0.5;   // 50% for item description
    const quantityWidth = tableWidth * 0.15;     // 15% for quantity
    const priceWidth = tableWidth * 0.175;       // 17.5% for unit price
    const totalWidth = tableWidth * 0.175;       // 17.5% for line total

    // Table header with better styling
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(0, 0, 0);

    // Light gray header background for contrast
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
      // Zebra striping for better readability
      if (index % 2 === 0) {
        this.pdf.setFillColor(248, 248, 248);
        this.pdf.rect(this.margins.left, this.yPosition - 3, tableWidth, 9, 'F');
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

  /** Render subtotal, tax, and total amounts */
  private renderTotals(data: InvoiceData): void {
    const rightAlign = this.pageWidth - this.margins.right;
    const labelX = rightAlign - 80;  // Labels column position
    const valueX = rightAlign - 5;   // Values column position

    // Light background box for totals section
    this.pdf.setFillColor(248, 248, 248);
    const totalsHeight = data.tax.rate > 0 ? 35 : 25;  // Adjust height for tax line
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

    // Separator line above final total
    this.pdf.setDrawColor(100, 100, 100);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(labelX, this.yPosition, valueX, this.yPosition);
    this.yPosition += 6;

    // Bold, larger font for final total
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setFontSize(14);
    this.pdf.text('Total:', labelX, this.yPosition);
    const totalText = formatCurrency(data.calculations.total);
    const totalWidth = this.pdf.getTextWidth(totalText);
    this.pdf.text(totalText, valueX - totalWidth, this.yPosition);

    this.yPosition += 25;
  }

  /** Render payment instructions and notes section */
  private renderPaymentInstructions(data: InvoiceData): void {
    // Visual separator between sections
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

    // Additional notes or special instructions
    if (data.details.notes) {
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setFontSize(11);
      this.pdf.text('Notes:', this.margins.left, this.yPosition);
      this.yPosition += 8;

      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setFontSize(10);

      // Wrap long text to fit within margins
      const maxWidth = this.pageWidth - this.margins.left - this.margins.right;
      const noteLines = this.pdf.splitTextToSize(data.details.notes, maxWidth);

      noteLines.forEach((line: string) => {
        this.pdf.text(line, this.margins.left, this.yPosition);
        this.yPosition += 5;
      });

      this.yPosition += 5;
    }
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
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(100, 100, 100);

    const thankYouText = 'Thank you for your business!';
    const textWidth = this.pdf.getTextWidth(thankYouText);
    const centerX = (this.pageWidth - textWidth) / 2;

    this.pdf.text(thankYouText, centerX, footerY);
  }
}

/**
 * Generate an invoice PDF with the provided data
 * @param data Invoice data including business info, items, and payment details
 * @param options PDF generation options (filename, auto-download)
 * @returns PDF as Uint8Array for further processing or download
 */
export async function generateInvoicePDF(data: InvoiceData, options?: PDFGenerationOptions): Promise<Uint8Array> {
  // Brief delay to allow UI to show loading state
  await new Promise(resolve => setTimeout(resolve, 100));

  const generator = new InvoicePDFGenerator();
  return generator.generateInvoicePDF(data, options);
}