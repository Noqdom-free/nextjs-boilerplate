# React useMemo Dependency Array Fix: Live Preview Update Issue

## Overview

This document details a critical fix implemented to resolve a live preview update issue in the invoice form component, where form field changes (like business name, customer details) were not triggering preview updates in real-time, while tax rate changes worked correctly.

## The Problem

### Symptoms
- Live preview only updated when `taxRate` field was modified
- Changes to business name, customer details, invoice details, or other form fields did not trigger preview updates
- Users had to modify the tax rate to see their other form changes reflected in the preview

### Affected Component
- **File**: `components/invoice/InvoiceForm.tsx`
- **Lines**: 105-124 (useMemo hook and useEffect)

## Root Cause Analysis

### The Issue: React's Shallow Dependency Comparison

The problem was located in the `useMemo` hook's dependency array at line 119:

**Before (Problematic Code):**
```typescript
const invoiceData = useMemo(() => ({
  business: formData.business,
  customer: formData.customer,
  details: formData.details,
  items: calculations.items,
  tax: {
    rate: taxRate,
    amount: calculations.taxAmount
  },
  calculations: {
    subtotal: calculations.subtotal,
    taxAmount: calculations.taxAmount,
    total: calculations.total
  }
}), [formData.business, formData.customer, formData.details, calculations.items, calculations.subtotal, calculations.taxAmount, calculations.total, taxRate]);
```

### Why This Didn't Work

1. **Object Reference Comparison**: React's `useMemo` uses shallow comparison for dependencies
2. **Stable Object References**: When form fields like `business.name` changed, `formData.business` remained the same object reference with modified properties
3. **No Re-computation**: Since the object reference didn't change, `useMemo` didn't re-run, preventing preview updates
4. **Tax Rate Exception**: `taxRate` worked because it's a primitive value that changes by value, not reference

### Why Tax Rate Worked

```typescript
const taxRate = formData.tax?.rate || 0; // Line 77
```

The `taxRate` is extracted as a primitive number, so when it changed, the dependency array detected the change and triggered re-computation.

## The Solution

### Implementation

**After (Fixed Code):**
```typescript
const invoiceData = useMemo(() => ({
  business: formData.business,
  customer: formData.customer,
  details: formData.details,
  items: calculations.items,
  tax: {
    rate: taxRate,
    amount: calculations.taxAmount
  },
  calculations: {
    subtotal: calculations.subtotal,
    taxAmount: calculations.taxAmount,
    total: calculations.total
  }
}), [
  // Individual primitive values instead of object references
  formData.business?.name, formData.business?.email, formData.business?.address, formData.business?.phone,
  formData.customer?.name, formData.customer?.email, formData.customer?.address, formData.customer?.phone,
  formData.details?.invoiceNumber, formData.details?.issueDate, formData.details?.dueDate, formData.details?.paymentTerms, formData.details?.notes,
  calculations.items, calculations.subtotal, calculations.taxAmount, calculations.total, taxRate
]);
```

### What Changed

1. **Primitive Dependencies**: Replaced object references with individual primitive field values
2. **Granular Tracking**: Each form field is now individually tracked in the dependency array
3. **Immediate Updates**: Any field change triggers `useMemo` re-computation
4. **Preview Sync**: The `useEffect` at line 122-124 immediately sends updated data to preview

### Technical Flow

1. **User Input** → Form field changes (e.g., business name)
2. **Form Watch** → `form.watch()` detects change (line 75)
3. **Dependency Check** → `useMemo` detects primitive value change
4. **Re-computation** → `invoiceData` object is recreated
5. **Effect Trigger** → `useEffect` runs due to `invoiceData` change
6. **Preview Update** → `onDataChange(invoiceData)` sends data to preview

## Best Practices Learned

### 1. useMemo Dependency Array Guidelines

```typescript
// ❌ Don't: Use object references
useMemo(() => computation, [objectRef])

// ✅ Do: Use primitive values or stable references
useMemo(() => computation, [objectRef.field1, objectRef.field2])
```

### 2. When to Extract Primitives

- **Complex Objects**: When depending on form data or nested objects
- **Selective Updates**: When only specific properties matter
- **Performance Critical**: When re-computation is expensive

### 3. Alternative Solutions

#### Option 1: Deep Dependency Comparison (Not Recommended)
```typescript
// Requires additional libraries like use-deep-compare-effect
const invoiceData = useDeepCompareMemo(() => ({...}), [formData]);
```

#### Option 2: Manual Dependency Extraction
```typescript
// Extract dependencies explicitly
const businessDeps = Object.values(formData.business || {});
const customerDeps = Object.values(formData.customer || {});
useMemo(() => computation, [...businessDeps, ...customerDeps]);
```

#### Option 3: Separate useMemo Hooks
```typescript
const businessData = useMemo(() => formData.business, [
  formData.business?.name, formData.business?.email
]);
```

## Code References

### Files Modified
- `components/invoice/InvoiceForm.tsx` (Line 119-124)

### Related Components
- `components/invoice/InvoicePreview.tsx` (Receives updated data)
- `lib/validation.ts` (Form schema definitions)

### Key Lines
- **Line 75**: `const formData = form.watch()` - Form data watching
- **Line 119-124**: `useMemo` dependency array - The fix location
- **Line 122-124**: `useEffect` - Preview update trigger

## Testing the Fix

### Before Fix
1. Change business name → No preview update
2. Change tax rate → Preview updates
3. Change business name again → Still no update

### After Fix
1. Change business name → Preview updates immediately
2. Change any form field → Preview updates immediately
3. All form changes are reflected in real-time

## Performance Considerations

### Positive Impact
- **Immediate Updates**: Better user experience with real-time preview
- **Predictable Behavior**: All form fields behave consistently

### Potential Concerns
- **More Dependencies**: Larger dependency array
- **Frequent Re-renders**: More triggers for useMemo re-computation

### Mitigation
The performance impact is minimal because:
1. The computation inside `useMemo` is lightweight (object creation)
2. Form changes are user-initiated (low frequency)
3. Alternative approaches (like deep comparison) would be more expensive

## Lessons Learned

1. **React's Shallow Comparison**: Understanding how React compares dependencies
2. **Object vs Primitive Dependencies**: When to use each approach
3. **Debugging useMemo Issues**: How to identify dependency-related problems
4. **Form State Management**: Best practices for reactive form updates

## Future Considerations

1. **Form Library Optimization**: Consider libraries that handle deep watching
2. **State Management**: Evaluate if external state management could simplify this
3. **Component Architecture**: Consider separating concerns for better maintainability

## Conclusion

This fix demonstrates the importance of understanding React's dependency comparison mechanism in `useMemo` hooks. By converting object references to primitive values in the dependency array, we achieved consistent, real-time preview updates across all form fields.

The solution is production-ready, performant, and follows React best practices while maintaining code readability and maintainability.