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

## Session Handling
Authentication uses JWT tokens with a fixed expiry rather than server-side cookie sessions, since frontend and backend run on separate origins.

## Future Improvements
Passwordless authentication (WebAuthn), distributed rate limiting (Redis), and server-side input sanitization for stored fields are planned enhancements.

1. Clone the repository
2. Copy `.env.example` to `.env.local` and set your backend API URL:
---
© 2026 Shreejal Shrestha. Academic coursework project (ST6005CEM).