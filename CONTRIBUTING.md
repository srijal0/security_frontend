# Contributing Guidelines

This is an academic coursework project, but the following conventions were followed throughout development.

## Commit Message Style
Commits follow a descriptive, imperative style (e.g. "Fix accessibility: add visible focus outline...", "Add profile page with photo upload and password change") to keep history readable and traceable to specific security or feature changes.

## Branching
- `main` — stable, working code

## Code Review Process
As a solo project, self-review was conducted before each commit, with particular attention to:
- No sender/user identity ever sent from client-side state (server always derives identity from the JWT)
- Accessibility checks (visible focus states, associated form labels) on every new page
- No secrets committed to version control (see `.env.example`)