# ADHD-Friendly Design System Documentation

## Overview

This design system is specifically built for users with ADHD, prioritizing clarity, reduced cognitive load, and encouraging feedback through gentle, predictable interactions.

## Color Palette

### Semantic Color Assignments

```typescript
// Primary Action - Use for main buttons, important CTAs
primary: celadon-600 (#60913b)
primary-light: celadon-50 (#f2f8ed)

// Success Feedback - Use for positive outcomes, completion
success: celadon-500 (#78b54a)

// Accent/Highlights - Use for important info, badges
accent: lime-cream-500 (#c1d52a)

// Neutral/Text - Use for body text, borders, shadows
neutral: muted-teal-700 (#396051)
neutral-light: muted-teal-50 (#eff5f3)

// Secondary/Supporting - Use for secondary actions
secondary: dry-sage-600 (#6a9354)

// Background - Light, calming base
background: lime-cream-50 (#f9fbea)
card-bg: #ffffff (with subtle muted-teal tint)
```

### Complete Color Families

#### Lime Cream (50-950)

- Warm, energetic accent color
- Good for highlights and emphasis
- Use lime-cream-500 for main accent (on dark backgrounds)
- Use lime-cream-100 for tinted backgrounds

```css
--lime-cream-50: #f9fbea;
--lime-cream-100: #f3f7d5;
--lime-cream-200: #ebf0b0;
--lime-cream-300: #dfe586;
--lime-cream-400: #d1d65c;
--lime-cream-500: #c1d52a;
--lime-cream-600: #a3b817;
--lime-cream-700: #7f8f15;
--lime-cream-800: #636f15;
--lime-cream-900: #4d5612;
--lime-cream-950: #1b1e06;
```

#### Muted Teal (50-950)

- Calming, neutral color for text and borders
- Foundation for ADHD-friendly UI
- Use muted-teal-700 for body text
- Use muted-teal-50 for subtle backgrounds

```css
--muted-teal-50: #eff5f3;
--muted-teal-100: #d9e8e2;
--muted-teal-200: #bdd9d0;
--muted-teal-300: #9cc8bb;
--muted-teal-400: #7ab3a4;
--muted-teal-500: #5a9b8a;
--muted-teal-600: #4a8277;
--muted-teal-700: #396051;
--muted-teal-800: #2d4a3f;
--muted-teal-900: #234032;
--muted-teal-950: #0d1613;
```

#### Dry Sage (50-950)

- Soft, earthy secondary color
- Use for secondary buttons and metadata
- Provides alternative to primary celadon

```css
--dry-sage-50: #f3f5ef;
--dry-sage-100: #e3e8d9;
--dry-sage-200: #d0dcc4;
--dry-sage-300: #b9ceab;
--dry-sage-400: #9bbe89;
--dry-sage-500: #82ac6b;
--dry-sage-600: #6a9354;
--dry-sage-700: #557543;
--dry-sage-800: #435a35;
--dry-sage-900: #364a2a;
--dry-sage-950: #12160e;
```

#### Celadon (50-950)

- Primary action color
- Nature-inspired green for trust and calm
- Use celadon-600 for main CTAs
- Use celadon-500 for success states

```css
--celadon-50: #f2f8ed;
--celadon-100: #e1f0d8;
--celadon-200: #c7e5b5;
--celadon-300: #a4d689;
--celadon-400: #8acb66;
--celadon-500: #78b54a;
--celadon-600: #60913b;
--celadon-700: #4d7330;
--celadon-800: #3f5a28;
--celadon-900: #344824;
--celadon-950: #11190a;
```

## Typography

### Font Stack

```css
-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif
```

### Font Sizes (Base: 18px)

```
xs:    14px (0.75rem)
sm:    16px (0.875rem)
base:  18px (1rem) - Most body text
lg:    20px (1.125rem)
xl:    24px (1.375rem)
2xl:   30px (1.75rem)
3xl:   36px (2.25rem)
4xl:   44px (2.75rem)
```

### Line Heights

- Body text: 1.6 (comfortable reading for ADHD)
- Headings: 1.3 (tight but readable)

### Usage Examples

```jsx
// Heading
<h1 className="text-4xl font-bold text-celadon-700">Page Title</h1>

// Body Text
<p className="text-base text-muted-teal-700">
  Regular body text with comfortable line height.
</p>

// Small Text / Metadata
<small className="text-sm text-muted-teal-600">Last updated: Today</small>
```

## Spacing Scale

### Base Spacing

Tailwind's default spacing, enhanced with custom values:

```
0 (0px)
1 (4px)
2 (8px)
3 (12px)
4 (16px)
6 (24px)
8 (32px)
12 (48px) - Touch target height
18 (72px) - Custom
22 (88px) - Custom
26 (104px) - Custom
```

### ADHD-Friendly Spacing Principles

- **Card Padding**: p-6 or p-8 (24-32px) for breathing room
- **Section Gaps**: gap-6 or gap-8 between sections
- **Button Height**: min-h-12 (48px) minimum for touch targets
- **Vertical Rhythm**: Use multiples of 4px/8px for consistent flow

### Examples

```jsx
// Generous spacing in cards
<div className="bg-white rounded-lg p-8 shadow-md">
  <h2 className="text-2xl font-bold mb-6">Section</h2>
  <p className="text-base text-muted-teal-700">Content with breathing room</p>
</div>

// Grid with good spacing
<div className="grid grid-cols-2 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Border Radius

```
DEFAULT: 12px - Cards, containers
sm:      8px  - Buttons, small elements
md:      10px - Medium components
lg:      16px - Large cards, modals
xl:      20px - Extra large elements
2xl:     24px - Full-width containers
```

### Usage

```jsx
// Default (12px)
<div className="rounded-lg p-6">Card</div>

// Buttons (8px)
<button className="rounded-sm px-4 py-2">Click</button>

// Large container (16px)
<div className="rounded-lg p-8">Large section</div>
```

## Shadows

### Shadow Definitions

```css
/* Subtle - Cards at rest */
shadow-sm: 0 1px 3px rgba(57, 96, 81, 0.08),
           0 1px 2px rgba(57, 96, 81, 0.06)

/* Standard - Default card shadow */
shadow-md: 0 4px 6px rgba(57, 96, 81, 0.1),
           0 2px 4px rgba(57, 96, 81, 0.06)

/* Hover - Elevated on interaction */
shadow-lg: 0 10px 15px rgba(57, 96, 81, 0.15),
           0 4px 6px rgba(57, 96, 81, 0.1)

/* Modal/Overlay - Maximum elevation */
shadow-xl: 0 20px 25px rgba(57, 96, 81, 0.15),
           0 10px 10px rgba(57, 96, 81, 0.1)
```

### Shadow Usage

```jsx
// Default card
<div className="bg-white rounded-lg shadow-md">Content</div>

// Hover effect
<div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  Interactive card
</div>

// Modal/Overlay
<div className="fixed inset-0 bg-black/20 shadow-xl">
  Modal content
</div>
```

## Focus States

All interactive elements automatically get:

- 3px celadon-500 outline
- 2px offset for clarity
- Rounded outline following element shape

```jsx
// Automatic on focus-visible
<button className="px-4 py-2 rounded-lg bg-celadon-600">
  Click me (focus visible gets outline automatically)
</button>

// For custom focus styling
<style>
  button:focus-visible {
    box-shadow: 0 0 0 3px var(--celadon-500),
                0 0 0 5px rgba(96, 145, 59, 0.1);
    outline: none;
  }
</style>
```

## Component Styling

### Buttons

```jsx
// Primary button
<button className="px-6 py-3 rounded-lg bg-celadon-600 text-white font-semibold
                   hover:bg-celadon-700 active:scale-95
                   transition-all duration-150">
  Primary Action
</button>

// Secondary button
<button className="px-6 py-3 rounded-lg bg-dry-sage-600 text-white font-semibold
                   hover:bg-dry-sage-700 active:scale-95
                   transition-all duration-150">
  Secondary Action
</button>

// Ghost button (outline)
<button className="px-6 py-3 rounded-lg border-2 border-celadon-600 text-celadon-600
                   font-semibold hover:bg-celadon-50
                   transition-all duration-150">
  Outline
</button>
```

### Cards

```jsx
<div
  className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg 
                border border-muted-teal-100 transition-all duration-200
                hover:translate-y-[-4px]"
>
  <h3 className="text-xl font-bold text-celadon-700 mb-3">Card Title</h3>
  <p className="text-muted-teal-700">Card content goes here.</p>
</div>
```

### Form Inputs

```jsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full px-4 py-3 rounded-lg border-2 border-muted-teal-200
             text-muted-teal-900 placeholder-muted-teal-400
             focus:border-celadon-500 focus:ring-2 focus:ring-celadon-100
             transition-colors duration-150 min-h-12"
/>

<textarea
  placeholder="Enter longer text..."
  className="w-full px-4 py-3 rounded-lg border-2 border-muted-teal-200
             text-muted-teal-900 placeholder-muted-teal-400
             focus:border-celadon-500 focus:ring-2 focus:ring-celadon-100
             transition-colors duration-150 resize-none"
/>
```

## Dark Mode

Dark mode is enabled via `class` strategy:

```jsx
// Enable dark mode on html element
<html className="dark">{/* Dark mode colors automatically apply */}</html>
```

### Dark Mode Colors

```css
:root.dark {
  --background: var(--dry-sage-900); /* Dark background */
  --card-bg: var(--dry-sage-800); /* Dark card */
  --text-primary: var(--lime-cream-50); /* Light text */
  --text-secondary: var(--dry-sage-100); /* Secondary text */
  --border: rgba(57, 96, 81, 0.3); /* Subtle borders */
}
```

### Dark Mode Usage

```jsx
import { useState } from 'react';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <html className={darkMode ? 'dark' : ''}>{/* App content */}</html>
    </div>
  );
}
```

## Animations & Transitions

### Smooth Transitions

```jsx
// Hover effect with smooth transition
<div className="transition-all duration-150 hover:shadow-lg hover:-translate-y-1">
  Hover me
</div>

// Longer transition for more dramatic effect
<div className="transition-all duration-300 hover:bg-celadon-50">
  Smooth change
</div>
```

### Framer Motion Example

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="bg-white rounded-lg p-6"
>
  Animated entrance
</motion.div>;
```

## Accessibility Features

- **High Contrast**: WCAG AA+ contrast ratios for all text
- **Focus Indicators**: Always visible 3px outline
- **Touch Targets**: 44-48px minimum for mobile
- **Readable Fonts**: 18px base size with 1.6 line-height
- **Color Contrast**:
  - Body text on background: 7:1+ contrast
  - Buttons and CTAs: 4.5:1+ contrast
  - Decorative elements: 3:1+ contrast

## Design Principles in Practice

### 1. Generous Spacing

```jsx
// ✅ GOOD - Breathing room
<div className="p-8 space-y-6">
  <h2>Title</h2>
  <p>Content</p>
</div>

// ❌ AVOID - Cramped
<div className="p-2">
  <h2>Title</h2>
  <p>Content</p>
</div>
```

### 2. Clear Visual Hierarchy

```jsx
// ✅ GOOD - Different sizes indicate importance
<h1 className="text-4xl font-bold text-celadon-700">Most Important</h1>
<h2 className="text-2xl font-bold text-celadon-600">Secondary</h2>
<p className="text-base text-muted-teal-700">Supporting</p>

// ❌ AVOID - Everything the same size
<div>Title</div>
<div>Subtitle</div>
<div>Content</div>
```

### 3. Subtle, Encouraging Feedback

```jsx
// ✅ GOOD - Gentle success feedback
<motion.div
  animate={{ scale: 1.05 }}
  transition={{ duration: 0.4 }}
  className="bg-celadon-50 border-2 border-celadon-400 rounded-lg p-6"
>
  ✅ Great job! You logged an urge.
</motion.div>

// ❌ AVOID - Jarring or negative tone
<div className="bg-red-500 text-white animate-bounce">
  ERROR: INVALID INPUT!!!
</div>
```

### 4. Reduce Cognitive Load

```jsx
// ✅ GOOD - One action per card
<Card>
  <h3>Log Your Progress</h3>
  <button className="w-full">Start Now</button>
</Card>

// ❌ AVOID - Too many options
<Card>
  <div className="space-y-2">
    <button>Option 1</button>
    <button>Option 2</button>
    <button>Option 3</button>
    <button>Option 4</button>
    <button>Option 5</button>
  </div>
</Card>
```

## Quick Reference

### Most Common Classes

```jsx
// Semantic colors
className = 'text-celadon-600'; // Primary text
className = 'bg-celadon-50'; // Primary light background
className = 'text-muted-teal-700'; // Body text
className = 'bg-lime-cream-100'; // Accent background
className = 'text-dry-sage-600'; // Secondary text

// Spacing (ADHD-friendly)
className = 'p-6 lg:p-8'; // Content padding
className = 'gap-6'; // Grid gaps
className = 'space-y-6'; // Vertical spacing
className = 'mb-6'; // Bottom margin

// Interactive
className = 'rounded-lg'; // Default 12px radius
className = 'shadow-md'; // Default shadow
className = 'hover:shadow-lg'; // Hover elevation
className = 'transition-all duration-150'; // Smooth hover

// Focus
className = 'focus:border-celadon-500'; // Custom focus
// (Auto applied via base CSS)

// Responsive
className = 'text-2xl lg:text-3xl'; // Text scaling
className = 'grid grid-cols-1 lg:grid-cols-2'; // Layout
className = 'hidden lg:block'; // Visibility toggle
```

## Troubleshooting

### Colors Not Applying?

1. Check if class name is spelled correctly
2. Verify it's using Tailwind syntax (e.g., `text-celadon-600` not `text-celadon-600px`)
3. Check if styles are being purged in tailwind.config.js (they shouldn't be)

### Focus Outline Not Visible?

- The base CSS provides automatic `:focus-visible` styling
- If not appearing, ensure `outline: none` isn't being applied elsewhere

### Dark Mode Not Working?

- Check that `<html>` or root element has `className="dark"`
- Verify tailwind.config.js has `darkMode: ['class']`

## Further Reading

- [Tailwind CSS Documentation](https://tailwindcss.com)
- [ADHD Web Design Best Practices](https://www.nngroup.com/articles/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
