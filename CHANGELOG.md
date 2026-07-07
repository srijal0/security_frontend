# Changelog

All notable changes to this project are documented here.

## [1.0.0] - Development Summary

### Added
- Login and registration pages with MFA/OTP verification flow
- Fund transfer page with two-step confirmation (review before sending)
- Transaction history page with sender/receiver-aware direction display
- Profile page: editable details, profile picture upload, change password
- Admin panel: user management, all-transactions view, activity logs
- Docker support for containerized deployment
- GitHub Actions CI pipeline with dependency scanning and build verification

### Fixed
- Accessibility: added visible keyboard focus indicators across all forms (WCAG 2.4.7)
- Accessibility: associated all form labels with their inputs via `htmlFor`/`id` (WCAG 1.3.1)
- Accessibility: added table header scope attributes for screen reader navigation
- Accidental exposure of `.env.example` blocked by an overly broad `.gitignore` rule

### Security
- Client never sends sender identity in transfer requests — resolved server-side from JWT
- Client-side validation treated as UX-only; all enforcement verified server-side