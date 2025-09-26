# Payment Features Development Plan

## Sequential Development Plan: Country-Specific Payment Methods & Clickable Links

### **Phase 1: Type Definitions & Data Structure**
**Complete Foundation Layer**

**What Gets Built:**
- Complete country enum and country-specific banking interfaces
- Full payment link configuration types
- Updated InvoiceData interface with all new optional fields
- Country-specific validation schemas
- Banking format constants and helper types

**Deliverable:** Complete type system ready for all payment features - no further type changes needed

---

### **Phase 2: Privacy Notice & Security UI Component**
**Complete Privacy Assurance System**

**What Gets Built:**
- Complete privacy notice component with security messaging
- Visual security indicators (lock icon, styling)
- Proper positioning and prominence in UI
- Complete local storage explanation messaging
- Responsive design for privacy notice

**Privacy Message:**
```
🔒 Your Information Stays Private
All banking and payment details are stored only on your device (local storage).
Nothing is sent to our servers or stored in any database. Your sensitive
information never leaves your computer, ensuring complete privacy and security.
```

**Deliverable:** Fully functional privacy assurance system that builds user trust

---

### **Phase 3: Country Selection System**
**Complete Country-Aware Infrastructure**

**What Gets Built:**
- Complete country dropdown component with all 5 countries:
  - United States
  - European Union
  - United Kingdom
  - Canada
  - Australia
- Country selection state management
- Complete country-specific field mapping logic
- Country change handling and form reset functionality
- Complete validation rules per country

**Deliverable:** Fully functional country selection that dynamically controls all banking fields

---

### **Phase 4: Dynamic Banking Forms**
**Complete Country-Specific Banking Input System**

**What Gets Built:**

#### **United States Banking Fields:**
- Bank Name
- Routing Number (9 digits)
- Account Number
- Account Holder Name
- Bank Address (optional)

#### **European Union Banking Fields:**
- Bank Name
- IBAN (International Bank Account Number)
- BIC/SWIFT Code
- Account Holder Name
- Bank Address (optional)

#### **United Kingdom Banking Fields:**
- Bank Name
- Sort Code (6 digits)
- Account Number
- Account Holder Name
- Bank Address (optional)

#### **Canada Banking Fields:**
- Bank Name
- Institution Number (3 digits)
- Transit Number (5 digits)
- Account Number
- Account Holder Name

#### **Australia Banking Fields:**
- Bank Name
- BSB Number (6 digits)
- Account Number
- Account Holder Name
- Bank Address (optional)

**Additional Features:**
- Full field validation for each country's banking format
- Complete helper text and tooltips for each field type
- Real-time validation feedback
- Complete form state management for banking data
- Proper field formatting (routing numbers, IBAN, etc.)

**Deliverable:** Fully functional banking information capture system for all supported countries

---

### **Phase 5: Payment Links Management**
**Complete Online Payment System**

**What Gets Built:**
- Complete payment method selector:
  - Stripe
  - PayPal
  - Square
  - Custom
- Full URL validation and input handling
- Display name configuration for payment methods
- Complete payment link state management
- Instructions text handling
- Payment method enable/disable toggles

**Deliverable:** Fully functional online payment link configuration system

---

### **Phase 6: Invoice Preview Integration**
**Complete Preview Display System**

**What Gets Built:**
- Complete banking information display in invoice preview
- Professional formatting for all country-specific banking details
- Complete payment links display with proper styling
- Conditional rendering for empty vs populated fields
- Real-time synchronization with form changes
- Complete responsive design for preview

**Preview Integration Details:**
- Banking info shows in "Payment Information" section
- Country-specific formatting (e.g., "IBAN: DE89370400440532013000")
- Online payment links show as "Online Payment Options"
- Clickable text styling for payment methods
- Section collapses when no payment info provided

**Deliverable:** Fully functional invoice preview showing all payment information

---

### **Phase 7: PDF Export with Clickable Links**
**Complete PDF Generation System**

**What Gets Built:**
- Complete PDF generation with clickable payment links using jsPDF
- Proper link implementation and cross-platform testing
- Professional PDF formatting for banking details
- Complete country-specific banking information in PDF
- Link styling and visual indicators in PDF
- Cross-platform PDF viewer compatibility testing

**Technical Requirements:**
- Clickable URLs that open in browser/app
- Proper PDF link formatting
- Visual indicators for clickable elements
- Professional layout maintaining invoice integrity

**Deliverable:** Fully functional PDF export with working clickable payment links

---

## Invoice Preview System Architecture

### **Real-Time Data Flow**
```
User Input → Form State Update → Preview Re-render → PDF Generation
```

### **Current Input → Preview Mapping**

#### **Business Information Section**
- **Business Name Input** → Shows as invoice header company name
- **Business Address** → Displays under company name in header
- **Phone/Email** → Shows in business contact section of invoice

#### **Customer Information Section**
- **Customer Name** → Appears as "Bill To:" section
- **Customer Address** → Shows under customer name
- **Customer Phone/Email** → Displays in customer contact details

#### **Invoice Details Section**
- **Invoice Number** → Shows as "Invoice #" in header
- **Issue Date** → Displays as "Date:"
- **Due Date** → Shows as "Due Date:" (important for payment)
- **Payment Terms** → Appears as "Payment Terms: Net 30" etc.
- **Notes** → Shows in bottom section if populated

#### **Line Items Section**
- **Item Description** → Shows in itemized table
- **Quantity** → Displays in "Qty" column
- **Unit Price** → Shows in "Rate" column
- **Line Total** → Auto-calculated, shows in "Amount" column

#### **Tax & Calculations**
- **Tax Rate** → Shows percentage and calculated amount
- **Subtotal** → Auto-calculated from all line items
- **Final Total** → Shows prominent total amount

### **New Payment Features → Preview Integration**

#### **Banking Information (Country-Specific)**
**Preview Behavior:** Shows in dedicated "Payment Information" section
- **Country Selection** → Determines which banking fields display format
- **US Banking** → Shows "Wire Transfer: Bank Name, Routing: XXX, Account: XXX"
- **EU Banking** → Shows "Wire Transfer: Bank Name, IBAN: XXX, BIC: XXX"
- **UK Banking** → Shows "Wire Transfer: Bank Name, Sort Code: XXX, Account: XXX"
- **Conditional Display** → Only shows if banking info is entered

#### **Online Payment Links**
**Preview Behavior:** Shows in "Online Payment Options" section
- **Payment Method Name** → Shows as clickable text (e.g., "Pay with Stripe")
- **URL Display** → Shows formatted as "Click here to pay online"
- **Multiple Links** → Lists all configured payment methods
- **Empty State** → Section hidden if no links configured

#### **Privacy Notice**
**Preview Behavior:** Does NOT show in preview
- Privacy notice is form-only UI element
- Not part of generated invoice
- Only visible during data entry

### **Technical Implementation Details**

#### **State Management Flow**
- **Form State Management**: All form inputs managed by React Hook Form
- **Live Synchronization**: Preview component watches form data using React state/context
- **Instant Updates**: Any input change immediately triggers preview re-render
- **Conditional Rendering**: Preview shows/hides sections based on whether data exists

#### **Real-Time Update Behavior**
- **Immediate**: Text inputs update preview on every keystroke
- **Calculated Fields**: Quantities/prices update totals instantly
- **Dropdown Changes**: Country selection immediately changes banking field display
- **Toggle Effects**: Enabling/disabling payment methods shows/hides sections

#### **Conditional Rendering Logic**
- Each preview section checks if data exists before rendering
- Empty fields don't show empty labels
- Sections collapse if no data provided
- Professional formatting maintained regardless of what's filled

---

## Key Development Principles

### **Phase Independence**
- Each phase builds on previous phases but is complete in itself
- No partial implementations across phases
- Each phase can be tested and demonstrated independently

### **Sequential Dependencies**
- Phase N+1 requires Phase N to be complete
- No need to build Phase VI before Phase III
- Everything builds in logical sequence

### **No Backtracking**
- No need to revisit previous phases once complete
- Each phase delivers 100% of its scope
- Complete functionality at each stage

### **Testing Strategy**
- Each phase maintains application in fully functional state
- Progressive enhancement approach
- Real-time validation and user feedback

This plan ensures each phase delivers a complete, working feature that enhances the invoice generator without leaving any incomplete functionality, while maintaining the app's core principles of privacy, simplicity, and professional output.