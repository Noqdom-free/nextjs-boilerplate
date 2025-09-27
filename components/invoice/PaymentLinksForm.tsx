"use client";

import { Control, FieldErrors, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CreditCard, Globe, Info, ToggleLeft, ToggleRight, Plus, Trash } from "@phosphor-icons/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PaymentMethod,
  PAYMENT_METHOD_NAMES,
  PAYMENT_METHOD_DISPLAY_TEXTS,
  DEFAULT_PAYMENT_CONFIGS,
  PaymentLinkConfig,
  PaymentLinksData
} from "@/types/payment";
// Removed validatePaymentURL import - no longer validating URLs

interface PaymentLinksFormProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  control: Control<any>;
  watch: UseFormWatch<any>;
}

export function PaymentLinksForm({
  register,
  errors,
  setValue,
  watch
}: PaymentLinksFormProps) {
  const paymentLinksData = watch('paymentLinks') as PaymentLinksData | undefined;
  const links = paymentLinksData?.links || [];
  const paymentLinksError = errors.paymentLinks as any;

  // Helper function to get link by method
  const getLinkByMethod = (method: PaymentMethod): PaymentLinkConfig | undefined => {
    return links.find(link => link.method === method);
  };

  // Helper function to generate unique ID for new links
  const generateLinkId = (): string => {
    return `payment-link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Add a new payment method
  const addPaymentMethod = (method: PaymentMethod) => {
    const existingLink = getLinkByMethod(method);
    if (existingLink) return; // Already exists

    const newLink: PaymentLinkConfig = {
      id: generateLinkId(),
      method,
      url: '',
      displayName: DEFAULT_PAYMENT_CONFIGS[method].displayName || PAYMENT_METHOD_DISPLAY_TEXTS[method],
      isEnabled: false,
      instructions: DEFAULT_PAYMENT_CONFIGS[method].instructions || ''
    };

    const updatedLinks = [...links, newLink];
    setValue('paymentLinks.links', updatedLinks);
  };

  // Remove a payment method
  const removePaymentMethod = (method: PaymentMethod) => {
    const updatedLinks = links.filter(link => link.method !== method);
    setValue('paymentLinks.links', updatedLinks);
  };

  // Toggle payment method enabled state
  const togglePaymentMethod = (method: PaymentMethod) => {
    const link = getLinkByMethod(method);
    if (!link) return;

    const updatedLinks = links.map(l =>
      l.method === method
        ? { ...l, isEnabled: !l.isEnabled }
        : l
    );
    setValue('paymentLinks.links', updatedLinks);
  };

  // Update payment method field
  const updatePaymentField = (method: PaymentMethod, field: keyof PaymentLinkConfig, value: any) => {
    const updatedLinks = links.map(link =>
      link.method === method
        ? { ...link, [field]: value }
        : link
    );
    setValue('paymentLinks.links', updatedLinks);
  };

  // Get payment methods that haven't been added yet
  const availablePaymentMethods = Object.values(PaymentMethod).filter(
    method => !getLinkByMethod(method)
  );

  const renderPaymentMethodCard = (link: PaymentLinkConfig) => {
    const isEnabled = link.isEnabled;
    const urlError = paymentLinksError?.links?.find((l: any) => l?.method === link.method)?.url;
    const displayNameError = paymentLinksError?.links?.find((l: any) => l?.method === link.method)?.displayName;
    const instructionsError = paymentLinksError?.links?.find((l: any) => l?.method === link.method)?.instructions;

    return (
      <div key={link.method} className="border rounded-lg p-4 space-y-4">
        {/* Header with method name and toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            <h4 className="font-medium text-sm sm:text-base">
              {PAYMENT_METHOD_NAMES[link.method]}
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => togglePaymentMethod(link.method)}
              className="p-1 h-auto"
            >
              {isEnabled ? (
                <ToggleRight className="w-6 h-6 text-green-600" />
              ) : (
                <ToggleLeft className="w-6 h-6 text-gray-400" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePaymentMethod(link.method)}
              className="p-1 h-auto text-destructive hover:text-destructive"
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Payment method configuration */}
        {isEnabled && (
          <div className="space-y-4 pl-7">
            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor={`payment-url-${link.method}`} className="text-sm sm:text-base">
                Payment URL *
              </Label>
              <Input
                id={`payment-url-${link.method}`}
                type="url"
                value={link.url}
                onChange={(e) => updatePaymentField(link.method, 'url', e.target.value)}
                placeholder={getUrlPlaceholder(link.method)}
                className="text-sm sm:text-base"
              />
              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{getUrlHelpText(link.method)}</span>
              </div>
              {urlError && (
                <p className="text-sm text-destructive">
                  {(urlError as any)?.message}
                </p>
              )}
            </div>

            {/* Display Name Input */}
            <div className="space-y-2">
              <Label htmlFor={`payment-name-${link.method}`} className="text-sm sm:text-base">
                Display Name
              </Label>
              <Input
                id={`payment-name-${link.method}`}
                value={link.displayName || ''}
                onChange={(e) => updatePaymentField(link.method, 'displayName', e.target.value)}
                placeholder={PAYMENT_METHOD_DISPLAY_TEXTS[link.method]}
                className="text-sm sm:text-base"
              />
              <div className="text-xs text-muted-foreground">
                How this payment option will appear on your invoice
              </div>
              {displayNameError && (
                <p className="text-sm text-destructive">
                  {(displayNameError as any)?.message}
                </p>
              )}
            </div>

            {/* Instructions Input */}
            <div className="space-y-2">
              <Label htmlFor={`payment-instructions-${link.method}`} className="text-sm sm:text-base">
                Instructions (Optional)
              </Label>
              <Input
                id={`payment-instructions-${link.method}`}
                value={link.instructions || ''}
                onChange={(e) => updatePaymentField(link.method, 'instructions', e.target.value)}
                placeholder="Additional instructions for this payment method"
                className="text-sm sm:text-base"
              />
              <div className="text-xs text-muted-foreground">
                Optional instructions that will appear with this payment option
              </div>
              {instructionsError && (
                <p className="text-sm text-destructive">
                  {(instructionsError as any)?.message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Online Payment Options
        </CardTitle>
        <CardDescription>
          Configure online payment links that will appear on your invoices
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        {/* Existing Payment Methods */}
        {links.length > 0 && (
          <div className="space-y-4">
            {links.map(link => renderPaymentMethodCard(link))}
          </div>
        )}

        {/* Add Payment Method Buttons */}
        {availablePaymentMethods.length > 0 && (
          <>
            {links.length > 0 && <Separator />}
            <div className="space-y-3">
              <Label className="text-sm sm:text-base font-medium">
                Add Payment Methods
              </Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {availablePaymentMethods.map(method => (
                  <Button
                    key={method}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addPaymentMethod(method)}
                    className="flex items-center gap-2 text-xs sm:text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    {PAYMENT_METHOD_NAMES[method]}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Global Instructions */}
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="payment-global-instructions" className="text-sm sm:text-base">
            General Payment Instructions (Optional)
          </Label>
          <Input
            id="payment-global-instructions"
            value={paymentLinksData?.globalInstructions || ''}
            onChange={(e) => setValue('paymentLinks.globalInstructions', e.target.value)}
            placeholder="General instructions for all payment methods"
            className="text-sm sm:text-base"
          />
          <div className="text-xs text-muted-foreground">
            These instructions will appear above all payment options on your invoice
          </div>
          {paymentLinksError?.globalInstructions && (
            <p className="text-sm text-destructive">
              {(paymentLinksError.globalInstructions as any)?.message}
            </p>
          )}
        </div>

        {/* No payment methods message */}
        {links.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Globe className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No payment methods configured</p>
              <p className="text-xs">Add payment methods above to get started</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to get URL placeholder based on payment method
function getUrlPlaceholder(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.STRIPE:
      return 'https://checkout.stripe.com/pay/cs_test_...';
    case PaymentMethod.PAYPAL:
      return 'https://paypal.me/yourusername/amount';
    case PaymentMethod.SQUARE:
      return 'https://squareup.com/checkout/...';
    case PaymentMethod.CUSTOM:
      return 'https://your-payment-portal.com/pay';
    default:
      return 'https://your-payment-url.com';
  }
}

// Helper function to get URL help text based on payment method
function getUrlHelpText(method: PaymentMethod): string {
  switch (method) {
    case PaymentMethod.STRIPE:
      return 'Enter your Stripe payment link or checkout session URL';
    case PaymentMethod.PAYPAL:
      return 'Enter your PayPal.me link or invoice URL';
    case PaymentMethod.SQUARE:
      return 'Enter your Square payment link or checkout URL';
    case PaymentMethod.CUSTOM:
      return 'Enter any custom payment URL or portal link';
    default:
      return 'Enter a valid HTTPS URL for online payment';
  }
}