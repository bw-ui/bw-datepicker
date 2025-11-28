# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-11-28

### 🎉 Initial Release - Plugin Architecture

A lightweight, zero-dependency datepicker with modular plugin architecture.

### 📦 Packages

| Package                           | Description                    | Size         |
| --------------------------------- | ------------------------------ | ------------ |
| `@bw-ui/datepicker`               | Core datepicker                | ~8KB gzipped |
| `@bw-ui/datepicker-theming`       | Dark mode, CSS variables       | ~4KB         |
| `@bw-ui/datepicker-accessibility` | Keyboard nav, ARIA, focus trap | ~5KB         |
| `@bw-ui/datepicker-positioning`   | Auto-flip, collision detection | ~3KB         |
| `@bw-ui/datepicker-mobile`        | Touch, swipe gestures          | ~2KB         |
| `@bw-ui/datepicker-input-handler` | Input masking, validation      | ~4KB         |
| `@bw-ui/datepicker-date-utils`    | Advanced date parsing          | ~5KB         |

### ✨ Core Features

- Date selection with min/max constraints
- Three display modes: popup, modal, inline
- Month/year navigation
- Today & Clear buttons
- Plugin system for extensibility
- Event-driven architecture
- Zero dependencies

### 🎨 Theming Plugin

- Light/dark mode toggle
- CSS variables for customization
- Auto theme detection (prefers-color-scheme)
- Persistent theme preference

### ♿ Accessibility Plugin

- Full keyboard navigation
  - Arrow keys: Navigate days
  - Enter/Space: Select date
  - Escape: Close picker
  - Tab: Navigate elements
  - PageUp/Down: Navigate months
  - Shift+PageUp/Down: Navigate years
- Focus trap when open
- ARIA labels and roles
- Screen reader announcements
- High contrast mode support

### 📍 Positioning Plugin

- Auto-flip when near viewport edges
- Collision detection
- Configurable placement and alignment
- Viewport constraints

### 📱 Mobile Plugin

- Touch event handling
- Swipe gestures (left/right for month navigation)
- Orientation change handling
- Touch feedback

### ⌨️ Input Handler Plugin

- Date input masking (DD/MM/YYYY, etc.)
- Manual date entry
- Validation on blur
- Error messages

### 📅 Date Utils Plugin

- Smart date parsing ("25 Dec 2025", "2025-12-25")
- Date formatting
- Date calculations
- Validation utilities

### 🔧 Usage

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(AccessibilityPlugin);

picker.on('date:changed', ({ date, dateISO }) => {
  console.log('Selected:', dateISO);
});
```
