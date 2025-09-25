# Mobile Preview Screen - Invoice Generator

## Overview
Full-screen mobile preview of the generated invoice, optimized for reviewing and sharing. Provides a clean, professional invoice display with easy navigation back to the form and direct PDF download functionality.

## ASCII Layout

```
┌─────────────────────────┐
│ ← Back to Form    [📄]  │
├─────────────────────────┤
│                         │
│    INVOICE PREVIEW      │
│                         │
│ #INV-20250925-001       │
│                         │
│ ABC Company             │
│ 123 Business St         │
│ City, ST 12345          │
│ phone@email.com         │
│                         │
│ Bill To:                │
│ John Smith              │
│                         │
│ Issue: 2025-09-25       │
│ Due: 2025-10-25         │
│ Terms: Net 30           │
│                         │
│ ┌─────────────────────┐ │
│ │ Description    Total│ │
│ ├─────────────────────┤ │
│ │ Web Design   $500.00│ │
│ │ Consulting   $300.00│ │
│ └─────────────────────┘ │
│                         │
│ Subtotal:     $800.00   │
│ Tax (8%):      $64.00   │
│ TOTAL:        $864.00   │
│                         │
│ Payment Instructions:   │
│ Bank Transfer           │
│ ACC# 123456789          │
│ Due within 30 days      │
│                         │
│   [📄 Download PDF]     │
│                         │
└─────────────────────────┘
```

## Key Features

### Navigation Header
- **Back Button**: Returns to mobile form with arrow icon
- **PDF Action**: Quick access to download functionality
- **Minimal Design**: Clean header without clutter

### Invoice Display

#### Header Information
- **Invoice Number**: Auto-generated with timestamp format
- **Business Details**: Company name, address, contact information
- **Professional Layout**: Clean typography and spacing

#### Billing Information
- **Customer Details**: Clear "Bill To" section
- **Date Information**: Issue date and due date prominence
- **Payment Terms**: Clear payment expectations

#### Line Items
- **Condensed Table**: Mobile-optimized item display
- **Essential Columns**: Description and total for clarity
- **Quantity/Price**: Simplified for mobile viewing
- **Scrollable**: Handles multiple items efficiently

#### Financial Summary
- **Hierarchical Display**: Subtotal, tax, and total
- **Prominent Total**: Highlighted final amount
- **Currency Formatting**: Consistent monetary display

#### Payment Information
- **Clear Instructions**: Payment method details
- **Contact Information**: Bank account or payment details
- **Terms Reminder**: Due date and payment expectations

### Action Area
- **Single Action**: PDF download button
- **Prominent Placement**: Bottom of screen for easy access
- **Touch Optimized**: Large tap target

## Technical Specifications

### Display Optimization
- **Mobile First**: Designed specifically for mobile viewing
- **Portrait Orientation**: Optimized for standard phone usage
- **Readable Fonts**: Appropriate sizing for mobile screens
- **High Contrast**: Clear text visibility

### Responsive Behavior
- **Scrollable Content**: Handles long invoices gracefully
- **Fixed Header**: Navigation always accessible
- **Flexible Layout**: Adapts to different mobile screen sizes
- **Safe Areas**: Respects device-specific layouts

### Performance
- **Fast Rendering**: Optimized for quick display
- **Minimal Data**: Only essential invoice information
- **Cached Content**: Maintains preview during navigation
- **Smooth Transitions**: Native-feeling animations

## User Experience

### Navigation Flow
1. User accesses from mobile form "Preview" button
2. Reviews complete invoice in full-screen view
3. Can return to form for edits using back button
4. Downloads PDF directly from preview screen

### Interaction Design
- **Touch Scrolling**: Natural mobile scroll behavior
- **Pinch to Zoom**: Native zoom support for detail viewing
- **Swipe Gestures**: Potential swipe-back to form
- **Quick Actions**: Single-tap PDF download

### Accessibility
- **Screen Reader**: Proper invoice structure and headings
- **High Contrast**: Clear visual distinction
- **Focus Management**: Proper focus handling on navigation
- **Text Scaling**: Respects user text size preferences

## Implementation Notes

### Technical Stack
- **React Component**: Dedicated preview component
- **State Management**: Receives invoice data from form
- **PDF Generation**: Same jsPDF integration as desktop
- **Responsive CSS**: Mobile-specific styling

### Data Flow
- **Form to Preview**: Invoice data passed via props or state
- **Real-time Updates**: Reflects latest form changes
- **Local State**: Maintains preview during session
- **No Network**: Entirely client-side functionality

### Mobile Optimizations
- **Touch Targets**: Minimum 44px for buttons
- **Viewport Meta**: Prevents unwanted zoom
- **iOS Safe Areas**: Handles notch and home indicator
- **Android Navigation**: Respects system navigation

### PDF Generation
- **Mobile PDF**: Optimized PDF layout for mobile generation
- **Download Handling**: Mobile-friendly download behavior
- **File Naming**: Descriptive filename with invoice number
- **Format Consistency**: Matches desktop PDF output

## Design Specifications

### Typography
- **Hierarchy**: Clear heading and body text distinction
- **Readability**: Optimized line height and spacing
- **Professional Fonts**: Business-appropriate typefaces
- **Consistent Sizing**: Standardized text scales

### Layout
- **Single Column**: Vertical information flow
- **White Space**: Adequate breathing room
- **Visual Groups**: Clear section separation
- **Alignment**: Consistent left-aligned content

### Color Scheme
- **Professional Colors**: Business-appropriate palette
- **High Contrast**: WCAG AA compliance
- **Brand Neutral**: Works with any business branding
- **Print Ready**: Translates well to PDF format

## Future Enhancements
- **Share Functionality**: Native mobile sharing options
- **Email Integration**: Direct email sending capability
- **Status Indicators**: Draft, sent, paid status display
- **Offline Support**: Full offline preview capability