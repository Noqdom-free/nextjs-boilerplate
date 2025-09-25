import { LineItem, InvoiceCalculations, TaxInfo } from '@/types/invoice';

export function calculateLineItemTotal(quantity: number, unitPrice: number): number {
  const validQuantity = isNaN(quantity) || quantity < 0 ? 0 : quantity;
  const validUnitPrice = isNaN(unitPrice) || unitPrice < 0 ? 0 : unitPrice;
  return validQuantity * validUnitPrice;
}

export function calculateSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => {
    const itemTotal = isNaN(item.total) ? 0 : item.total;
    return sum + itemTotal;
  }, 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
  const validSubtotal = isNaN(subtotal) || subtotal < 0 ? 0 : subtotal;
  const validTaxRate = isNaN(taxRate) || taxRate < 0 ? 0 : taxRate;
  return validSubtotal * (validTaxRate / 100);
}

export function calculateTotal(subtotal: number, taxAmount: number): number {
  const validSubtotal = isNaN(subtotal) ? 0 : subtotal;
  const validTaxAmount = isNaN(taxAmount) ? 0 : taxAmount;
  return validSubtotal + validTaxAmount;
}

export function calculateInvoiceTotal(items: LineItem[], taxRate: number = 0): InvoiceCalculations {
  // Ensure we have valid items array
  const validItems = Array.isArray(items) ? items : [];

  const subtotal = calculateSubtotal(validItems);
  const taxAmount = calculateTax(subtotal, taxRate);
  const total = calculateTotal(subtotal, taxAmount);

  return {
    subtotal,
    taxAmount,
    total,
  };
}

export function updateLineItem(
  item: Partial<LineItem> & { quantity: number; unitPrice: number }
): Pick<LineItem, 'total'> {
  return {
    total: calculateLineItemTotal(item.quantity, item.unitPrice),
  };
}