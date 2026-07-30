# BankSecure — Frontend

Next.js frontend for the BankSecure digital banking application.

## Features
- MFA-protected login and registration flows
- Fund transfer with two-step confirmation
- Profile management with photo upload
- Admin panel for user and transaction oversight
- Accessibility-conscious forms (visible focus states, associated labels)

## Prerequisites
- Node.js 20+
- A running instance of the BankSecure backend (see backend README)

## Security Testing
This frontend was tested alongside the BankSecure backend across authentication, RBAC, IDOR, input validation, mass assignment, business logic, and XSS scenarios. See the backend
 repository's SECURITY.md and the project report for full findings and evidence.

## Accessibility
Icons and images include descriptive alt text. Form inputs use visible focus outlines and linked labels (see SECURITY.md for details).
## Setup

## Empty States
The Transactions page displays a clear message when no transactions exist yet, rather than a blank table.

## Environment Setup
Copy `.env.example` to `.env` and fill in real values before running locally. Never commit `.env` directly.

## Browser Support
Tested on latest Chrome and Edge. Uses modern JavaScript features (fetch, async/await).

1. Clone the repository
2. Copy `.env.example` to `.env.local` and set your backend API URL: