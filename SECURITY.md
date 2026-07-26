# Security Testing Reference

Full penetration testing was conducted against the BankSecure backend API.
See https://github.com/srijal0/security_backend/blob/main/SECURITY.md
for the complete testing methodology, areas covered, and key findings
(race condition, RBAC middleware fault, stored XSS, IDOR on static files).

Frontend-specific note: user-supplied fields (fullName, transaction
descriptions) rely on React's default JSX escaping to prevent XSS on
render. No frontend-side sanitization library is currently in use.
