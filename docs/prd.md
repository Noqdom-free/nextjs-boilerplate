# Invoice Generator - Product Requirements Document

## Overview
A simple, one-page web application for generating professional invoices. Users can input business and transaction details to create, preview, and export invoices for payment requests without requiring login or registration.

## Project Goals
- **Simplicity**: Single-page application with all functionality on one screen
- **No Authentication**: No user accounts or sign-up required
- **Professional Output**: Generate clean, printable invoices
- **Instant Use**: Ready to use immediately upon loading

## File Structure

```
nextjs-boilerplate/
├── docs/
│   └── prd.md                          # Product Requirements Document
├── app/
│   ├── page.tsx                        # Main invoice generator page
│   ├── layout.tsx                      # Root layout (existing)
│   ├── globals.css                     # Global styles (existing)
│   └── favicon.ico                     # App icon (existing)
├── components/
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx                  # Button component
│   │   ├── input.tsx                   # Input component
│   │   ├── card.tsx                    # Card component
│   │   ├── label.tsx                   # Label component
│   │   ├── table.tsx                   # Table component
│   │   ├── separator.tsx               # Separator component
│   │   └── form.tsx                    # Form components
│   ├── invoice/
│   │   ├── InvoiceForm.tsx            # Form for invoice input
│   │   ├── InvoicePreview.tsx         # Invoice preview component
│   │   ├── ItemManager.tsx            # Add/remove items component
│   │   └── ExportButtons.tsx          # PDF export buttons
│   └── layout/
│       └── Header.tsx                  # App header (optional)
├── lib/
│   ├── utils.ts                        # Utility functions (shadcn utils)
│   ├── calculations.ts                 # Invoice calculation logic
│   ├── pdf-generator.ts               # PDF generation functions
│   └── validation.ts                  # Form validation schemas
├── types/
│   └── invoice.ts                      # TypeScript interfaces
├── styles/
│   └── print.css                       # Print-specific CSS
├── public/                             # Static assets (existing)
├── package.json                        # Dependencies (existing)
├── tailwind.config.js                  # Tailwind config (existing)
├── tsconfig.json                       # TypeScript config (existing)
└── components.json                     # shadcn/ui config (to be created)
```

## MVP Features (Must-Have)

### 1. Business Information Input
- **Business/Company name** (required)
- **Business address** (optional)
- **Phone number** (optional)
- **Email** (optional)

### 2. Invoice Details
- **Invoice number** (auto-generated with timestamp)
- **Issue date** (auto-populated, editable)
- **Due date** (required - payment deadline)
- **Payment terms** (Net 30, Due on receipt, etc.)
- **Customer name** (required for billing)

### 3. Item Management
- Add single line item with:
  - **Item description** (required)
  - **Quantity** (default: 1)
  - **Unit price** (required)
- Basic calculation: Quantity × Price = Line Total

### 4. Simple Calculations
- **Subtotal calculation** (sum of all line items)
- **Final total display**
- **Currency formatting** (USD by default)

### 5. Invoice Preview
- **Real-time preview** of invoice
- **Clean, professional format**
- **Essential invoice elements including due date**

### 6. Basic Actions
- **Clear all form data**
- **Basic form validation**
- **Payment instructions display**

## Secondary Features (V1.1)

### 7. Multiple Items
- Add/remove multiple line items
- Dynamic item list with add/delete buttons

### 8. Tax Handling
- Optional tax rate input (percentage)
- Tax calculation and display
- Tax-inclusive total

### 9. Enhanced Export
- Download invoice as PDF
- Save invoice data locally (localStorage)

### 10. Invoice-Specific Features
- **Invoice status tracking** (Draft, Sent, Paid, Overdue)
- **Payment method instructions** (bank details, card acceptance)
- **Terms & conditions section**
- **Bill to / Ship to addresses**
- Better error messages and mobile responsiveness

## Technical Requirements

### Tech Stack
- **Framework**: Next.js 15 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Phosphor Icons (@phosphor-icons/react)
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns
- **Form Management**: React Hook Form (with shadcn forms)

### Dependencies to Install
```json
{
  "@phosphor-icons/react": "^2.0.0",
  "jspdf": "^2.5.0",
  "date-fns": "^2.30.0",
  "react-hook-form": "^7.0.0"
}
```

### Icon Usage Plan

#### Form Actions
- `Plus` - Add new item
- `Trash` - Remove item
- `X` - Clear form/close dialogs
- `FloppyDisk` - Save functionality

#### Export
- `DownloadSimple` - Download PDF

#### Business & Invoice
- `FileText` - Main app icon/branding
- `Buildings` - Business information section
- `User` - Customer details
- `Calendar` - Issue date selection
- `CalendarBlank` - Due date selection
- `Hash` - Invoice number
- `Clock` - Payment terms

#### Financial
- `CurrencyDollar` - Price/money fields
- `Calculator` - Calculations section
- `Percent` - Tax percentage
- `Equals` - Total amount
- `CreditCard` - Payment methods accepted
- `Bank` - Bank transfer information

## Security Considerations

### Input Security
- **XSS Prevention**: Sanitize all user inputs (React handles by default)
- **Input Validation**: Validate numbers, dates, and text fields
- **Character Limits**: Set reasonable limits on all text inputs
- **Number Validation**: Ensure only valid numbers for prices and quantities

### Data Privacy
- **No Data Persistence**: All data stays in browser memory only
- **No Network Requests**: Everything runs client-side
- **Clear Data**: Provide clear all functionality
- **Local Storage**: Optional local storage for convenience only

### Client-Side Security
- **Content Security Policy**: Set proper CSP headers
- **HTTPS Only**: Deploy with HTTPS
- **No Sensitive Data**: App doesn't handle payment processing beyond invoice generation

## User Experience Requirements

### Layout
- **Two-column layout**: Form on left, preview on right
- **Responsive design**: Stack vertically on mobile
- **Clean interface**: Minimal, professional appearance
- **Clear typography**: Easy to read forms and invoice

### Form UX
- **Auto-focus**: First field focused on load
- **Tab navigation**: Proper tab order through form
- **Real-time validation**: Immediate feedback on errors
- **Smart defaults**: Current date, due dates, auto-generated invoice numbers

### Invoice Preview
- **Live updates**: Changes reflect immediately
- **Professional styling**: Clean, business-appropriate design
- **Print-ready**: Optimized for standard paper printing
- **Clear formatting**: Easy to read amounts, due dates, and payment terms

## Performance Requirements
- **Fast loading**: Under 3 seconds on standard connections
- **Responsive UI**: Form updates under 100ms
- **Small bundle**: Minimize JavaScript size
- **No external APIs**: All processing client-side

## Browser Support
- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions

## Future Enhancements (V2.0+)
- Invoice templates with different styles
- Business logo upload capability
- Invoice history and management
- Payment tracking and status updates
- Recurring invoice generation
- Multiple currency support
- Custom tax rates by location
- Export to different formats (CSV, Excel)
- Integration with payment processors

## Success Metrics
- **Time to first invoice**: Under 2 minutes from page load
- **Error rate**: Less than 5% form submission errors
- **Mobile usability**: 90%+ mobile satisfaction
- **PDF download success rate**: 95%+ successful downloads
- **Invoice completion rate**: 90%+ include payment terms and due dates

## Design Guidelines
- **Minimalist**: Clean, uncluttered interface
- **Professional**: Business-appropriate styling
- **Accessible**: WCAG 2.1 AA compliance
- **Intuitive**: Self-explanatory functionality

## Development Phases

### Phase 1: MVP Core
1. Setup shadcn/ui and dependencies
2. Create basic form structure
3. Implement single item input
4. Build invoice preview with due dates
5. Add print functionality

### Phase 2: Enhanced Features
1. Multiple item management
2. Tax calculations
3. Payment terms and instructions
4. PDF export with invoice formatting
5. Mobile responsiveness and error handling

### Phase 3: Polish
1. Invoice status management
2. Advanced validation for payment terms
3. Local storage for invoice data
4. Performance optimization
5. Accessibility improvements and cross-browser testing