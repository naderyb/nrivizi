# UI Improvements & Feature Ideas

## Authentication & Onboarding

- Replace bare "full name" login with:
  - Email + password form (with client-side validation).
  - Clear labels, placeholders, and inline error messages.
  - "Remember me" checkbox and "Forgot password" link.
- Add a branded login screen:
  - App logo/name, short tagline.
  - Light/dark background with subtle illustration or gradient.
- Add feedback states:
  - Disable button + spinner on submit.
  - Toast on login failure ("Nom d'utilisateur ou mot de passe incorrect").

## Layout & Navigation

- Implement an application shell:
  - Top navbar with logo, current page title, user avatar + dropdown (Profile, Settings, Logout).
  - Left sidebar with main sections (e.g., Dashboard, Users, Reports, Settings).
- Make layout fully responsive:
  - Collapsible sidebar on mobile (hamburger menu).
  - Use a consistent spacing system and font scale.

## Dashboard

- Add a main dashboard home:
  - Key metrics cards (e.g., number of users, recent activity count).
  - Recent items table/list with quick actions.
  - "Getting started" section for new users.
- Allow quick filters (date range, status).

## Tables & Detail Views

- For any list pages:
  - Search bar, sortable columns, column visibility toggle.
  - Pagination or infinite scroll with clear page size.
- Detail view improvements:
  - Clear section titles, grouped fields (info, security, activity).
  - Inline editing or "Edit" button that opens a focused form.

## Forms & Password Management

- Standardize form styling:
  - Consistent input sizes, labels above inputs, helper text.
  - Error messages under fields with red highlights.
- For password reset:
  - "Reset MDP" opens modal with:
    - New password + confirm password fields.
    - Strength indicator and requirements checklist.
  - Show success/failure toast; never display existing password, only allow setting a new one.

## Visual Design & Theming

- Pick a design system (e.g., Tailwind, Material UI, or custom variables):
  - Primary/secondary colors, accent color, neutral grays.
  - Border radius, shadow levels, button variants (primary, secondary, ghost).
- Add light/dark mode toggle with persisted preference.
- Use icons for navigation and actions (edit, delete, view).

## Feedback, Errors & Empty States

- Global toast system for success/error/info messages.
- Skeleton loaders for tables/cards while data loads.
- Nice empty states:
  - Short explanation + "Add first X" button.
- 404 / 500 error pages with link back to dashboard.

## User Features

- User profile page:
  - Avatar upload, name, email, language, theme preference.
- Role-aware UI:
  - Admin-only sections hidden/disabled for non-admins.
- Activity log view:
  - Recent actions by the logged-in user; filters by date/action type.

## Next Steps

- Prioritize:
  - 1. Auth UX (login + password reset).
  - 2. Main layout & navigation.
  - 3. Dashboard with a few key widgets.
- Implement iteratively and refine based on feedback.
