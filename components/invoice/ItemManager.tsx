"use client";

import { useFieldArray, Control, FieldErrors } from "react-hook-form";
import { Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, generateId } from "@/lib/utils";
import type { InvoiceFormData } from "@/lib/validation";

interface ItemManagerProps {
  control: Control<InvoiceFormData>;
  errors: FieldErrors<InvoiceFormData>;
  items: InvoiceFormData['items'];
  setValue: (name: keyof InvoiceFormData | `items.${number}.description` | `items.${number}.quantity` | `items.${number}.unitPrice`, value: any) => void;
}

export function ItemManager({ control, errors, items, setValue }: ItemManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  const addItem = () => {
    append({
      id: generateId(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const calculateLineTotal = (quantity: number, unitPrice: number) => {
    return (quantity || 0) * (unitPrice || 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Line Items
        </CardTitle>
        <CardDescription>
          Add items or services to your invoice
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        {fields.map((field, index) => {
          const item = items[index] || field;
          const lineTotal = calculateLineTotal(item.quantity, item.unitPrice);

          return (
            <div key={field.id} className="space-y-3 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Item {index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`items.${index}.description`} className="text-sm">Description *</Label>
                <Input
                  id={`items.${index}.description`}
                  value={item.description || ""}
                  onChange={(e) => {
                    setValue(`items.${index}.description`, e.target.value);
                  }}
                  placeholder="Description of item or service"
                  className="text-sm"
                />
                {errors.items?.[index]?.description && (
                  <p className="text-sm text-destructive">
                    {errors.items[index].description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.quantity`} className="text-sm">Quantity *</Label>
                  <Input
                    id={`items.${index}.quantity`}
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={item.quantity || 1}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 1 : parseFloat(e.target.value) || 1;
                      setValue(`items.${index}.quantity`, value);
                    }}
                    className="text-sm"
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-sm text-destructive">
                      {errors.items[index].quantity.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`items.${index}.unitPrice`} className="text-sm">Unit Price *</Label>
                  <Input
                    id={`items.${index}.unitPrice`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.unitPrice || 0}
                    onChange={(e) => {
                      const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                      setValue(`items.${index}.unitPrice`, value);
                    }}
                    className="text-sm"
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="text-sm text-destructive">
                      {errors.items[index].unitPrice.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label className="text-sm">Line Total</Label>
                  <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm items-center">
                    {formatCurrency(lineTotal)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {errors.items && (
          <p className="text-sm text-destructive">
            {errors.items.message}
          </p>
        )}
        
        {/* Add Item Button - Below the items list */}
        <div className="flex justify-center pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}