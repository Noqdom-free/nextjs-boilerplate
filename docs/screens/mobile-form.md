# Mobile Form Screen - Invoice Generator

## Overview
The mobile-optimized form interface featuring a single-column stacked layout with collapsible sections. Designed for touch interaction and small screens while maintaining full functionality.

## ASCII Layout

```
┌─────────────────────────┐
│ 📄 Invoice Generator    │
│              [≡] [Clear]│
├─────────────────────────┤
│                         │
│ 🏢 Business Info        │
│ ┌─────────────────────┐ │
│ │ Company Name*       │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Address             │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Phone               │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Email               │ │
│ └─────────────────────┘ │
│                         │
│ 📋 Invoice Details      │
│ ┌─────────────────────┐ │
│ │ Customer Name*      │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Issue Date          │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Due Date*           │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ Payment Terms       │ │
│ └─────────────────────┘ │
│                         │
│ 📝 Items                │
│ ┌─────────────────────┐ │
│ │ Description*        │ │
│ └─────────────────────┘ │
│ ┌─────┐ ┌─────────────┐ │
│ │ Qty │ │ Price*      │ │
│ └─────┘ └─────────────┘ │
│        [➕ Add Item]     │
│                         │
│ 🧮 Tax Rate             │
│ ┌─────┐                 │
│ │ 8%  │ $64.00          │
│ └─────┘                 │
│                         │
│ Total: $864.00          │
│                         │
│    [👁️ Preview]          │
│   [📄 Download PDF]     │
│                         │
└─────────────────────────┘
```

## Key Features

### Header
- **App Title**: Clear branding with file icon
- **Menu Toggle**: Hamburger menu for additional options
- **Clear Button**: Quick form reset functionality

### Form Sections

#### Business Information
- **Company Name**: Required field for invoicing entity
- **Address**: Optional business address
- **Contact Info**: Phone and email fields
- **Visual Grouping**: Icon-based section identification

#### Invoice Details
- **Customer Name**: Required billing recipient
- **Date Fields**: Issue date (auto-populated) and due date
- **Payment Terms**: Dropdown or text input for terms
- **Auto-generation**: Invoice numbers with timestamp

#### Item Management
- **Single Item View**: One item displayed at a time on mobile
- **Essential Fields**: Description, quantity, unit price
- **Add Functionality**: Plus button to add additional items
- **Touch-friendly**: Large tap targets for mobile interaction

#### Calculations
- **Tax Input**: Percentage field with real-time calculation
- **Running Total**: Prominent display of current invoice total
- **Currency Formatting**: Consistent monetary display

### Action Buttons
- **Preview Button**: Navigate to full-screen invoice preview
- **PDF Download**: Direct PDF generation and download
- **Fixed Position**: Bottom-anchored for easy access

## Technical Specifications

### Responsive Design
- **Viewport**: Optimized for 320px to 768px width
- **Touch Targets**: Minimum 44px for accessibility
- **Typography**: Scaled for mobile readability
- **Spacing**: Adequate padding for touch interaction

### Form Behavior
- **Auto-save**: Form state preserved during navigation
- **Validation**: Inline error messages below fields
- **Progressive Enhancement**: Works without JavaScript
- **Input Types**: Optimized keyboards (numeric, email, etc.)

### Navigation
- **Single Page**: No page refreshes or complex routing
- **Modal Patterns**: Overlays for additional options
- **Back Gestures**: Native browser navigation support
- **Focus Management**: Proper tab order and focus traps

## User Experience

### Workflow
1. User fills business information section
2. Completes invoice details and customer info
3. Adds line items using simplified interface
4. Sets tax rate and reviews calculations
5. Previews invoice or downloads PDF directly

### Accessibility
- **Screen Reader**: Semantic HTML structure
- **High Contrast**: Clear visual hierarchy
- **Motor Accessibility**: Large touch targets
- **Keyboard Support**: Full keyboard navigation

### Performance
- **Fast Loading**: Optimized for mobile connections
- **Smooth Scrolling**: Native scroll behavior
- **Minimal JavaScript**: Core functionality only
- **Offline Ready**: Works without network connection

## Implementation Notes

### Technical Stack
- **Responsive Framework**: Tailwind CSS mobile-first approach
- **Touch Events**: Optimized for mobile gestures
- **Form Library**: React Hook Form with mobile validation
- **Icon System**: Phosphor icons with appropriate sizing

### Mobile-Specific Features
- **Virtual Keyboard**: Input types trigger correct keyboards
- **Zoom Prevention**: Meta viewport prevents unwanted zoom
- **Safe Areas**: Respects device safe areas (notches, etc.)
- **Orientation**: Supports both portrait and landscape

### Data Management
- **Local Storage**: Form data persistence
- **State Management**: React state for form interactions
- **Validation**: Real-time client-side validation
- **Error Handling**: User-friendly error messages

## Interaction Patterns
- **Tap to Edit**: Direct field interaction
- **Swipe Actions**: For item management
- **Pull to Refresh**: Clear form gesture
- **Long Press**: Context menus for advanced options