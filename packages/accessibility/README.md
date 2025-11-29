# @bw-ui/datepicker-accessibility

Accessibility plugin for BW DatePicker - Full keyboard navigation, ARIA support, focus trap, and screen reader announcements.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-accessibility)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-accessibility)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-accessibility)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- ⌨️ **Full Keyboard Navigation** - Navigate with arrow keys, shortcuts
- 🔒 **Focus Trap** - Keep focus inside picker when open
- 📢 **Screen Reader Announcements** - ARIA live regions
- 🏷️ **ARIA Labels** - Proper roles and labels
- 🎯 **High Contrast Mode** - Support for high contrast themes
- 🔄 **Auto Focus** - Smart initial focus on open

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-accessibility
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
}).use(AccessibilityPlugin);
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker-accessibility/dist/bw-accessibility.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-accessibility/dist/bw-accessibility.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input').use(
    BWAccessibility.AccessibilityPlugin
  );
</script>
```

## ⚙️ Options

```javascript
.use(BWAccessibility.AccessibilityPlugin, {
  // Keyboard Navigation
  enableKeyboard: true,       // Enable keyboard navigation

  // Focus Management
  enableFocusTrap: true,      // Trap focus inside picker
  autoFocus: true,            // Auto focus on open
  returnFocus: true,          // Return focus to input on close

  // Screen Reader
  enableAnnouncer: true,      // Enable screen reader announcements
  announcerDelay: 100,        // Delay before announcements (ms)

  // ARIA
  enableAria: true,           // Add ARIA attributes

  // High Contrast
  enableHighContrast: true,   // Support high contrast mode
})
```

### Options Reference

| Option               | Type      | Default | Description                               |
| -------------------- | --------- | ------- | ----------------------------------------- |
| `enableKeyboard`     | `boolean` | `true`  | Enable/disable keyboard navigation        |
| `enableFocusTrap`    | `boolean` | `true`  | Trap focus inside picker when open        |
| `autoFocus`          | `boolean` | `true`  | Automatically focus first element on open |
| `returnFocus`        | `boolean` | `true`  | Return focus to trigger element on close  |
| `enableAnnouncer`    | `boolean` | `true`  | Enable screen reader announcements        |
| `announcerDelay`     | `number`  | `100`   | Milliseconds delay before announcement    |
| `enableAria`         | `boolean` | `true`  | Add ARIA roles and attributes             |
| `enableHighContrast` | `boolean` | `true`  | Support high contrast mode                |

### Examples

**Minimal (keyboard only):**

```javascript
.use(BWAccessibility.AccessibilityPlugin, {
  enableFocusTrap: false,
  enableAnnouncer: false,
})
```

**Full accessibility (default):**

```javascript
.use(BWAccessibility.AccessibilityPlugin)
// All options enabled by default
```

**Custom announcer delay:**

```javascript
.use(BWAccessibility.AccessibilityPlugin, {
  announcerDelay: 200,  // Slower announcements
})
```

**Disable auto focus:**

```javascript
.use(BWAccessibility.AccessibilityPlugin, {
  autoFocus: false,  // Don't auto focus on open
})
```

## ⌨️ Keyboard Shortcuts

### Day Navigation

| Key    | Action                   |
| ------ | ------------------------ |
| `←`    | Previous day             |
| `→`    | Next day                 |
| `↑`    | Previous week (same day) |
| `↓`    | Next week (same day)     |
| `Home` | First day of month       |
| `End`  | Last day of month        |

### Month/Year Navigation

| Key                | Action         |
| ------------------ | -------------- |
| `PageUp`           | Previous month |
| `PageDown`         | Next month     |
| `Shift + PageUp`   | Previous year  |
| `Shift + PageDown` | Next year      |

### Selection & Control

| Key           | Action                    |
| ------------- | ------------------------- |
| `Enter`       | Select focused date       |
| `Space`       | Select focused date       |
| `Escape`      | Close picker              |
| `Tab`         | Navigate between elements |
| `Shift + Tab` | Navigate backwards        |

## 🔧 What It Does

### 1. Keyboard Navigation (`enableKeyboard`)

Enables full keyboard control of the datepicker:

```javascript
// User can navigate entirely with keyboard
// Arrow keys move between days
// PageUp/Down changes months
// Enter selects, Escape closes
```

### 2. Focus Trap (`enableFocusTrap`)

Keeps focus inside the picker when open:

```javascript
// When picker opens:
// - Focus moves to selected date (or today, or first day)
// - Tab cycles through picker elements only
// - Focus doesn't escape to page behind
```

### 3. Auto Focus (`autoFocus`)

Smart initial focus when picker opens:

```
Priority order:
1. Previously selected date
2. Today's date
3. First available day
```

### 4. Return Focus (`returnFocus`)

Returns focus to input when picker closes:

```javascript
// User presses Escape or selects date
// Focus returns to the input field
```

### 5. Screen Reader Announcements (`enableAnnouncer`)

Announces changes to screen readers:

```javascript
// Announces:
// - "Calendar opened"
// - "Calendar closed"
// - "December 2025" (on month change)
// - Date labels when navigating
```

### 6. ARIA Attributes (`enableAria`)

Adds proper ARIA roles and labels:

```html
<!-- Grid structure -->
<div role="grid" aria-label="December 2025">
  <div role="row">
    <button
      role="gridcell"
      aria-label="Sunday, December 25, 2025"
      aria-selected="true"
      tabindex="0"
    >
      25
    </button>
  </div>
</div>
```

### 7. High Contrast Support (`enableHighContrast`)

Respects user's high contrast preferences:

```css
@media (prefers-contrast: high) {
  /* Enhanced borders and focus indicators */
}
```

## 📡 Events

The plugin emits no additional events but responds to core events:

```javascript
// Plugin listens to:
picker.on('picker:opened', () => {
  // Activates keyboard nav, focus trap, announces "Calendar opened"
});

picker.on('picker:closed', () => {
  // Deactivates focus trap, announces "Calendar closed"
});

picker.on('nav:monthChanged', ({ month, year }) => {
  // Announces new month/year to screen readers
});
```

## 🎯 Accessibility Compliance

This plugin helps achieve:

- ✅ **WCAG 2.1 Level AA** compliance
- ✅ **Section 508** compliance
- ✅ **WAI-ARIA 1.2** design patterns

### Checklist

| Requirement           | Status |
| --------------------- | ------ |
| Keyboard accessible   | ✅     |
| Focus visible         | ✅     |
| Focus trapped         | ✅     |
| Screen reader support | ✅     |
| ARIA labels           | ✅     |
| High contrast support | ✅     |
| No keyboard traps     | ✅     |

## 🔌 Combining with Other Plugins

Works great with other BW DatePicker plugins:

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';
import { PositioningPlugin } from '@bw-ui/datepicker-positioning';

const picker = new BWDatePicker('#date-input')
  .use(BWTheming.ThemingPlugin, { theme: 'dark' })
  .use(BWAccessibility.AccessibilityPlugin) // Add accessibility
  .use(BWPositioning.PositioningPlugin);
```

### Recommended Plugin Order

```javascript
.use(BWTheming.ThemingPlugin)        // 1. Theming first
.use(BWAccessibility.AccessibilityPlugin)  // 2. Accessibility second
.use(BWPositioning.PositioningPlugin)    // 3. Positioning last
```

## 🧪 Testing Accessibility

### Manual Testing

1. **Keyboard Only:** Unplug mouse, navigate with keyboard only
2. **Screen Reader:** Test with NVDA, VoiceOver, or JAWS
3. **High Contrast:** Enable Windows High Contrast mode

### Automated Testing

```bash
# Using axe-core
npm install axe-core

# In your tests
import axe from 'axe-core';

axe.run(document.querySelector('.bw-datepicker'))
  .then(results => {
    console.log(results.violations); // Should be empty
  });
```

## 📁 What's Included

```
dist/
├── bw-accessibility.min.js      # IIFE build (for <script>)
├── bw-accessibility.esm.min.js  # ESM build (for import)
└── bw-accessibility.min.css     # Styles (focus indicators, etc.)
```

## 🔗 Related Packages

| Package                                                                                          | Description      |
| ------------------------------------------------------------------------------------------------ | ---------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required)  |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode        |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto-positioning |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch support    |
| [@bw-ui/datepicker-input-handler](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) | Input masking    |
| [@bw-ui/datepicker-date-utils](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)       | Date utilities   |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
