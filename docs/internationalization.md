# Internationalization (i18n) Documentation

# User Language Preference

Users can select their preferred language from a dropdown in their profile page. This selection is saved to their user account in the database.

After logging in, the application automatically detects the user's saved language and redirects them to the dashboard in that language. This ensures a consistent experience for users across sessions, regardless of their browser or device settings.

**How it works:**

- The language dropdown is available in the user profile form.
- When the user saves their profile, their language preference is stored.
- On login, the app checks the user's saved language and redirects to the appropriate locale dashboard (e.g., `/es/dashboard` for Spanish).

This feature allows users to personalize their language experience and guarantees that their chosen language is used for navigation and UI after authentication.

This document describes how internationalization is implemented in the LCM Next.js Boilerplate using react-intl.

## Overview

The internationalization setup supports:

- Multiple languages (English and Spanish by default)
- Automatic locale detection from browser preferences
- URL-based locale routing
- Server-side and client-side translation support
- Date and time formatting according to locale

## Supported Locales

Currently supported locales:

- `en` (English) - Default locale
- `es` (Spanish)

## Architecture

### Configuration

- **Location**: `src/i18n/config.ts`
- Defines available locales, default locale, and locale names
- Provides utility functions for locale validation

### Translation Messages

- **Location**: `src/i18n/messages/`
- JSON files for each locale (e.g., `en.json`, `es.json`)
- Organized in nested structure for better organization

### Provider Setup

- **Location**: `src/i18n/provider.tsx`
- Wraps the app with React Intl provider
- Flattens nested message structure for react-intl compatibility

### Middleware

- **Location**: `middleware.ts`
- Automatically detects user's preferred language
- Redirects to appropriate locale URL when needed

## Usage

### In Server Components

```tsx
import { getMessages } from "~/i18n";

export default async function MyComponent() {
  const locale = "en"; // Get from params or headers
  const messages = await getMessages(locale);

  // Use messages directly or pass to client components
  return <div>{messages.common.loading}</div>;
}
```

### In Client Components

```tsx
"use client";

import { FormattedMessage, FormattedDate } from "react-intl";

export function MyComponent() {
  return (
    <div>
      <h1>
        <FormattedMessage id="home.title" values={{ name: "LCM" }} />
      </h1>
      <p>
        <FormattedDate value={new Date()} />
      </p>
    </div>
  );
}
```

### Language Switcher

The `LanguageSwitcher` component is available for users to change languages:

```tsx
import { LanguageSwitcher } from "~/_components/i18n";

<LanguageSwitcher currentLocale="en" />;
```

## Adding New Languages

1. Create a new message file in `src/i18n/messages/[locale].json`
2. Add the locale to the `locales` array in `src/i18n/config.ts`
3. Add the locale name to `localeNames` object

Example for French (`fr`):

```typescript
// src/i18n/config.ts
export const locales = ["en", "es", "fr"] as const;

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};
```

## Adding New Translation Keys

1. Add the key to all locale files in `src/i18n/messages/`
2. Use the key with `FormattedMessage` or `useIntl` hook

Example:

```json
// src/i18n/messages/en.json
{
  "common": {
    "welcome": "Welcome"
  }
}
```

```tsx
// In component
<FormattedMessage id="common.welcome" />
```

## Date and Time Formatting

React Intl provides built-in date and time formatting:

```tsx
import { FormattedDate, FormattedTime, FormattedRelativeTime } from 'react-intl';

<FormattedDate value={new Date()} />
<FormattedTime value={new Date()} />
<FormattedRelativeTime value={-1} unit="day" />
```

## URL Structure

- Default locale (English): `/`, `/posts`, `/about`
- Other locales: `/es`, `/es/posts`, `/es/about`

## Browser Language Detection

The middleware automatically detects the user's preferred language from:

1. URL path (if present)
2. `Accept-Language` header
3. Falls back to default locale (English)

## Best Practices

1. **Organize messages hierarchically** by feature/page
2. **Use descriptive keys** that indicate context
3. **Include context in variable names** for translators
4. **Test with different locales** during development
5. **Use semantic keys** rather than the text content as keys

## Current Implementation Status

✅ **Completed:**

- react-intl package installation and configuration
- Basic locale configuration (English and Spanish)
- IntlProvider setup in root layout
- Message structure with nested JSON files (en.json, es.json)
- Language switcher component with dropdown UI
- Middleware for automatic locale detection from browser headers
- Translation of core UI components:
  - Home page (title, greeting, buttons)
  - Navigation menu (Post, All Posts)
  - Latest posts component
  - PostCard with localized date/time formatting
- FormattedMessage, FormattedDate, and FormattedTime integration
- Type-safe locale utilities and configuration
- Server-side and client-side translation support
- Proper separation of client/server components for Next.js App Router

🔄 **Available for Extension:**

- Additional language support (add new locale JSON files)
- More UI components translation
- Advanced URL-based locale routing with route parameters
- Custom message interpolation and pluralization

📋 **Future Enhancements:**

- RTL language support
- Advanced pluralization handling with ICU message format
- Number and currency formatting
- Dynamic locale loading for larger applications
- Message extraction tooling (babel-plugin-react-intl)
- Translation management workflow
- A/B testing for different translations
