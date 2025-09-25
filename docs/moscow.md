# MoSCoW Prioritization Framework

| Priority    | Feature                        | Description                                           |
|-------------|--------------------------------|-------------------------------------------------------|
| MUST HAVE   | Business Information Input     | Business name (required), address, phone, email      |
| MUST HAVE   | Invoice Details                | Invoice number, issue date, due date, payment terms, customer name |
| MUST HAVE   | Single Item Management         | Add item with description, quantity, unit price       |
| MUST HAVE   | Basic Calculations             | Subtotal, final total, currency formatting (USD)     |
| MUST HAVE   | Invoice Preview                | Real-time preview, professional format               |
| MUST HAVE   | Basic Actions                  | Clear form data, form validation, payment instructions |
| SHOULD HAVE | Multiple Items                 | Add/remove multiple line items dynamically           |
| SHOULD HAVE | Tax Handling                   | Optional tax rate input, tax calculation             |
| SHOULD HAVE | Enhanced Export                | PDF download, localStorage saving                     |
| SHOULD HAVE | Payment Instructions           | Bank details, card acceptance methods                 |
| SHOULD HAVE | Terms & Conditions             | Legal terms section                                   |
| SHOULD HAVE | Billing Addresses              | Bill to / Ship to addresses                           |
| SHOULD HAVE | Mobile Responsiveness          | Responsive design, mobile optimization                |
| COULD HAVE  | Multiple Currency Support      | Support for different currencies                      |
| WON'T HAVE  | Invoice Status Tracking        | Draft, Sent, Paid, Overdue - requires data persistence |
| WON'T HAVE  | Invoice Templates              | Different styling options - violates simplicity      |
| WON'T HAVE  | Business Logo Upload           | Logo integration - requires file storage             |
| WON'T HAVE  | Invoice History                | History and management - violates no-persistence     |
| WON'T HAVE  | Payment Tracking               | Status updates and tracking - requires persistence   |
| WON'T HAVE  | Recurring Invoices             | Automated recurring generation - too complex          |
| WON'T HAVE  | Custom Tax Rates               | Location-based tax calculations - unnecessary complexity |
| WON'T HAVE  | Multi-format Export            | CSV, Excel export options - violates simplicity      |
| WON'T HAVE  | Payment Processing Integration | Direct payment processor integration - out of scope  |

## Priority Summary

- **MUST HAVE (6 features)**: Core MVP functionality for basic invoice generation
- **SHOULD HAVE (7 features)**: Important enhancements that improve user experience
- **COULD HAVE (1 feature)**: Nice-to-have feature for future consideration
- **WON'T HAVE (9 features)**: Features excluded to maintain app simplicity and core principles

## Core Principles Maintained

- **No Authentication**: No user accounts or sign-up required
- **Simplicity**: Single-page application with focused functionality
- **No Data Persistence**: All data stays in browser memory only (except optional localStorage for convenience)
- **Instant Use**: Ready to use immediately upon loading