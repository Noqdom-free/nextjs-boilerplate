// Payment method types
export enum PaymentMethod {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  SQUARE = 'square',
  CUSTOM = 'custom'
}

// Payment method display names
export const PAYMENT_METHOD_NAMES: Record<PaymentMethod, string> = {
  [PaymentMethod.STRIPE]: 'Stripe',
  [PaymentMethod.PAYPAL]: 'PayPal',
  [PaymentMethod.SQUARE]: 'Square',
  [PaymentMethod.CUSTOM]: 'Custom'
};

// Payment method default display texts
export const PAYMENT_METHOD_DISPLAY_TEXTS: Record<PaymentMethod, string> = {
  [PaymentMethod.STRIPE]: 'Pay with Stripe',
  [PaymentMethod.PAYPAL]: 'Pay with PayPal',
  [PaymentMethod.SQUARE]: 'Pay with Square',
  [PaymentMethod.CUSTOM]: 'Pay Online'
};

// Individual payment link configuration
export interface PaymentLinkConfig {
  id: string;
  method: PaymentMethod;
  url: string;
  displayName?: string; // Custom display name, falls back to default
  isEnabled: boolean;
  instructions?: string; // Optional instructions for this payment method
}

// Payment link management state
export interface PaymentLinksData {
  links: PaymentLinkConfig[];
  globalInstructions?: string; // General payment instructions
}

// Payment link form data for individual link
export interface PaymentLinkFormData {
  method: PaymentMethod;
  url: string;
  displayName: string;
  isEnabled: boolean;
  instructions: string;
}

// Payment link validation requirements
export interface PaymentLinkRequirements {
  urlRequired: boolean;
  urlFormat: string;
  displayNameMaxLength: number;
  instructionsMaxLength: number;
}

export const PAYMENT_LINK_REQUIREMENTS: PaymentLinkRequirements = {
  urlRequired: true,
  urlFormat: 'Must be a valid URL (https://...)',
  displayNameMaxLength: 50,
  instructionsMaxLength: 200
};

// Helper type for payment link display in invoice
export interface PaymentLinkDisplay {
  method: PaymentMethod;
  displayName: string;
  url: string;
  instructions?: string;
}

// Default payment link configurations for quick setup
export const DEFAULT_PAYMENT_CONFIGS: Record<PaymentMethod, Partial<PaymentLinkConfig>> = {
  [PaymentMethod.STRIPE]: {
    method: PaymentMethod.STRIPE,
    displayName: PAYMENT_METHOD_DISPLAY_TEXTS[PaymentMethod.STRIPE],
    isEnabled: false,
    instructions: 'Secure payment processing via Stripe'
  },
  [PaymentMethod.PAYPAL]: {
    method: PaymentMethod.PAYPAL,
    displayName: PAYMENT_METHOD_DISPLAY_TEXTS[PaymentMethod.PAYPAL],
    isEnabled: false,
    instructions: 'Pay securely with your PayPal account'
  },
  [PaymentMethod.SQUARE]: {
    method: PaymentMethod.SQUARE,
    displayName: PAYMENT_METHOD_DISPLAY_TEXTS[PaymentMethod.SQUARE],
    isEnabled: false,
    instructions: 'Quick and secure payment via Square'
  },
  [PaymentMethod.CUSTOM]: {
    method: PaymentMethod.CUSTOM,
    displayName: PAYMENT_METHOD_DISPLAY_TEXTS[PaymentMethod.CUSTOM],
    isEnabled: false,
    instructions: 'Click to complete your payment online'
  }
};