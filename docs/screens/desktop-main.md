# Desktop Main Screen - Invoice Generator

## Overview
The primary desktop interface featuring a two-column layout with form input on the left and real-time invoice preview on the right. This layout maximizes screen real estate and provides immediate visual feedback.

## ASCII Layout

```
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  📄 Invoice Generator                                                               [Clear]    [📄 PDF]     │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐       ┌─────────────────────────────────────────────────────────────┐
│                                     │       │                                                             │
│            📝 INPUT FORM            │       │                   📄 INVOICE PREVIEW                       │
│                                     │       │                                                             │
├─────────────────────────────────────┤       ├─────────────────────────────────────────────────────────────┤
│                                     │       │                                                             │
│  🏢 Business Information            │       │   INVOICE #INV-20250925-001                                │
│                                     │       │                                                             │
│  ┌─────────────────────────────────┐│       │   ┌─────────────────────────────────────────────────────┐   │
│  │ Company Name *                  ││       │   │  ABC Company                                        │   │
│  └─────────────────────────────────┘│       │   │  123 Business Street                               │   │
│                                     │       │   │  Business City, ST 12345                          │   │
│  ┌─────────────────────────────────┐│       │   │  (555) 123-4567 • contact@abc.com                 │   │
│  │ Business Address                ││       │   └─────────────────────────────────────────────────────┘   │
│  └─────────────────────────────────┘│       │                                                             │
│                                     │       │   ┌─────────────────────────────────────────────────────┐   │
│  ┌─────────────────┐ ┌─────────────┐│       │   │  BILL TO:                                           │   │
│  │ Phone Number    │ │ Email       ││       │   │  John Smith                                         │   │
│  └─────────────────┘ └─────────────┘│       │   │  Customer Address Line 1                           │   │
│                                     │       │   │  Customer City, ST 12345                           │   │
│  ────────────────────────────────── │       │   └─────────────────────────────────────────────────────┘   │
│                                     │       │                                                             │
│  📋 Invoice Details                 │       │   Issue Date: September 25, 2025                           │
│                                     │       │   Due Date: October 25, 2025                               │
│  ┌─────────────────────────────────┐│       │   Payment Terms: Net 30 Days                               │
│  │ Customer Name *                 ││       │                                                             │
│  └─────────────────────────────────┘│       │   ┌─────────────────────────────────────────────────────┐   │
│                                     │       │   │ DESCRIPTION           QTY    RATE      AMOUNT       │   │
│  ┌─────────────────┐ ┌─────────────┐│       │   ├─────────────────────────────────────────────────────┤   │
│  │ Issue Date      │ │ Due Date *  ││       │   │ Website Design         1    $500.00    $500.00      │   │
│  └─────────────────┘ └─────────────┘│       │   │ Consulting Services    2    $150.00    $300.00      │   │
│                                     │       │   │ Additional Development 1    $200.00    $200.00      │   │
│  ┌─────────────────────────────────┐│       │   └─────────────────────────────────────────────────────┘   │
│  │ Payment Terms                   ││       │                                                             │
│  └─────────────────────────────────┘│       │                                          SUBTOTAL: $1000.00│
│                                     │       │                                          TAX (8%):   $80.00│
│  ────────────────────────────────── │       │                                          TOTAL:    $1080.00│
│                                     │       │                                                             │
│  📝 Line Items                      │       │   ┌─────────────────────────────────────────────────────┐   │
│                                     │       │   │ PAYMENT INSTRUCTIONS                                │   │
│  ┌─────────────────────────────────┐│       │   │                                                     │   │
│  │ Item Description *              ││       │   │ Bank Transfer: First National Bank                  │   │
│  └─────────────────────────────────┘│       │   │ Account Number: 123456789                          │   │
│                                     │       │   │ Routing Number: 987654321                          │   │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐│       │   │                                                     │   │
│  │ Qty     │ │ Rate    │ │ Amount  ││       │   │ Payment is due within 30 days of invoice date     │   │
│  └─────────┘ └─────────┘ └─────────┘│       │   └─────────────────────────────────────────────────────┘   │
│                                     │       │                                                             │
│         [➕ Add New Item]            │       └─────────────────────────────────────────────────────────────┘
│                                     │
│  ────────────────────────────────── │
│                                     │
│  🧮 Tax & Totals                    │
│                                     │
│  ┌─────────┐                        │
│  │ Tax %   │   Subtotal: $1000.00   │
│  └─────────┘   Tax (8%):   $80.00   │
│              Total: $1080.00        │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│        [📄 Download PDF]            │
│                                     │
└─────────────────────────────────────┘
```

## Key Features

### Form Section (Left Column)
- **Business Information**: Company name, address, phone, email
- **Invoice Details**: Auto-generated invoice number, dates, payment terms, customer name
- **Item Management**: Description, quantity, unit price with add/remove functionality
- **Calculations**: Tax rate input with real-time calculations
- **Actions**: Clear form and PDF download buttons

### Preview Section (Right Column)
- **Real-time Updates**: Immediately reflects form changes
- **Professional Layout**: Clean, printable invoice format
- **Complete Information**: All business and customer details
- **Itemized Breakdown**: Table format with calculations
- **Payment Information**: Terms and instructions clearly displayed

## Technical Specifications

### Layout Specifications
- **Container Width**: 1400px maximum for optimal readability
- **Column Proportions**: 35% form, 5% gap, 60% preview
- **Minimum Width**: 1024px for desktop layout
- **Visual Separation**: Clear 80px gap between columns
- **Card Design**: Elevated containers with subtle shadows
- **Breakpoint**: Below 1024px switches to mobile stacked layout

### Form Validation
- **Required Fields**: Marked with asterisk (*)
- **Real-time Validation**: Immediate feedback on input errors
- **Number Formatting**: Auto-format currency and quantities

### Export Functionality
- **PDF Generation**: Uses jsPDF library
- **No Print Option**: Only PDF download available
- **Professional Styling**: Maintains invoice formatting in PDF

## User Experience

### Workflow
1. User fills in business information
2. Enters customer and invoice details
3. Adds line items with quantities and prices
4. Reviews real-time preview
5. Downloads PDF when complete

### Accessibility
- **Keyboard Navigation**: Full tab order support
- **Screen Reader**: Proper ARIA labels and structure
- **Color Contrast**: WCAG 2.1 AA compliant
- **Focus Indicators**: Clear visual focus states

## Design Improvements Made

### Visual Enhancements
- **Separated Header**: Dedicated top navigation bar with clear branding
- **Card-Based Layout**: Both form and preview are contained in distinct cards
- **Professional Spacing**: Generous whitespace and proper section dividers
- **Clear Visual Hierarchy**: Section headers with icons and horizontal dividers
- **Enhanced Invoice Format**: Professional invoice layout with proper formatting

### Spacing & Layout
- **Wide Container**: Increased overall width for better proportions
- **Column Gap**: Prominent 7-character gap between form and preview
- **Internal Padding**: Generous padding within each section
- **Section Separation**: Clear dividers between form sections
- **Breathing Room**: Adequate spacing around all UI elements

### Professional Polish
- **Business Card Style**: Invoice preview styled as professional document
- **Consistent Typography**: Clear heading hierarchy and text formatting
- **Structured Information**: Organized business and billing information blocks
- **Payment Details**: Dedicated payment instructions section
- **Action Placement**: Clear action buttons with appropriate spacing

## Implementation Notes
- Uses shadcn/ui Card components for elevated design
- Phosphor icons for visual elements and section identification
- React Hook Form for form management with improved validation
- Real-time calculations with debounced updates
- Professional grid system with consistent spacing
- PDF generation entirely client-side with enhanced formatting
- CSS Grid or Flexbox for precise column control with gaps