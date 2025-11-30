# @bw-ui/datepicker-theming

Theming plugin for BW DatePicker - Dark mode, light mode, and CSS variable customization.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-theming)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-theming)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-theming)

[Live Demo](https://bw-ui.github.io/bw-datepicker) â€¢ [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-theming) â€¢ [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## âœ¨ Features

- ðŸŒ™ **Dark Mode** - Built-in dark theme
- â˜€ï¸ **Light Mode** - Clean light theme
- ðŸŽ¨ **CSS Variables** - Full customization
- ðŸ”„ **Runtime Switching** - Change themes dynamically
- ðŸ–¥ï¸ **System Detection** - Auto-detect OS preference
- ðŸ’¾ **Persistence** - Remember theme choice

## ðŸ“¦ Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-theming
```

> âš ï¸ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## ðŸš€ Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
}).use(ThemingPlugin, {
  theme: 'dark',
});
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-theming/dist/bw-theming.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input').use(
    BWTheming.ThemingPlugin,
    {
      theme: 'dark',
    }
  );
</script>
```

## âš™ï¸ Options

```javascript
.use(BWTheming.ThemingPlugin, {
  theme: 'light',
  autoDetect: false,
  customVars: {},
  persist: true,
  storageKey: 'bw-datepicker-theme',
})
```

### Options Reference

| Option       | Type      | Default                 | Values                        | Description                      |
| ------------ | --------- | ----------------------- | ----------------------------- | -------------------------------- |
| `theme`      | `string`  | `'light'`               | `'light'`, `'dark'`, `'auto'` | Theme to apply                   |
| `autoDetect` | `boolean` | `false`                 | `true`, `false`               | Auto-detect OS theme preference  |
| `customVars` | `object`  | `{}`                    | CSS variable overrides        | Custom CSS variables             |
| `persist`    | `boolean` | `false`                 | `true`, `false`               | Persist theme to localStorage    |
| `storageKey` | `string`  | `'bw-datepicker-theme'` | Any string                    | localStorage key for persistence |

## ðŸ“– Examples

### Light Theme (Default)

```javascript
.use(BWTheming.ThemingPlugin, {
  theme: 'light'
})
```

### Dark Theme

```javascript
.use(BWTheming.ThemingPlugin, {
  theme: 'dark'
})
```

### Auto-detect System Theme

```javascript
.use(BWTheming.ThemingPlugin, {
  autoDetect: true
})
// Uses OS preference (dark/light mode)
```

### Disable Persistence

```javascript
.use(BWTheming.ThemingPlugin, {
  theme: 'dark',
  persist: false
})
// Theme resets on page reload
```

### Custom Storage Key

```javascript
.use(BWTheming.ThemingPlugin, {
  theme: 'dark',
  storageKey: 'my-app-theme'
})
```

### Custom Colors

```javascript
.use(BWTheming.ThemingPlugin, {
  theme: 'light',
  customVars: {
    '--bw-picker-bg': '#faf5ff',
    '--bw-day-selected-bg': '#8b5cf6',
    '--bw-day-today-border': '#8b5cf6',
  }
})
```

## ðŸŽ¨ CSS Variables

### Picker Container

| Variable             | Default                       | Description          |
| -------------------- | ----------------------------- | -------------------- |
| `--bw-picker-bg`     | `#ffffff`                     | Picker background    |
| `--bw-picker-border` | `#e0e0e0`                     | Picker border color  |
| `--bw-picker-shadow` | `0 4px 12px rgba(0,0,0,0.15)` | Picker shadow        |
| `--bw-picker-radius` | `8px`                         | Picker border radius |
| `--bw-picker-font`   | `-apple-system, ...`          | Font family          |

### Text Colors

| Variable              | Default   | Description    |
| --------------------- | --------- | -------------- |
| `--bw-text-primary`   | `#1a1a1a` | Primary text   |
| `--bw-text-secondary` | `#666666` | Secondary text |
| `--bw-text-disabled`  | `#cccccc` | Disabled text  |

### Day Cells

| Variable                 | Default   | Description             |
| ------------------------ | --------- | ----------------------- |
| `--bw-day-size`          | `36px`    | Day cell size           |
| `--bw-day-radius`        | `50%`     | Day cell border radius  |
| `--bw-day-hover-bg`      | `#f5f5f5` | Day hover background    |
| `--bw-day-selected-bg`   | `#1a1a1a` | Selected day background |
| `--bw-day-selected-text` | `#ffffff` | Selected day text       |
| `--bw-day-today-border`  | `#1a1a1a` | Today border color      |

### Buttons

| Variable            | Default    | Description             |
| ------------------- | ---------- | ----------------------- |
| `--bw-btn-padding`  | `8px 16px` | Button padding          |
| `--bw-btn-radius`   | `4px`      | Button border radius    |
| `--bw-btn-hover-bg` | `#f0f0f0`  | Button hover background |

## ðŸ”„ Runtime Theme Switching

```javascript
const picker = new BWDatePicker('#date-input').use(BWTheming.ThemingPlugin, {
  theme: 'light',
});

// Get theming plugin instance
const theming = picker.getPlugin('theming');

// Switch to dark
theming.setTheme('dark');

// Switch to light
theming.setTheme('light');

// Toggle theme
theming.toggle();

// Get current theme
const current = theming.getTheme(); // 'dark' or 'light'

// Check if dark
const isDark = theming.isDark(); // true or false
```

## ðŸ–¥ï¸ System Theme Detection

When `autoDetect: true`, the plugin uses OS theme and listens for changes:

```javascript
.use(BWTheming.ThemingPlugin, {
  autoDetect: true
})
// Automatically switches when user changes OS dark/light mode
```

## ðŸŽ¨ Full Custom Theme Example

```javascript
.use(BWTheming.ThemingPlugin, {
  theme: 'light',
  customVars: {
    // Purple theme
    '--bw-day-selected-bg': '#8b5cf6',
    '--bw-day-today-border': '#8b5cf6',

    // Custom background
    '--bw-picker-bg': '#faf5ff',
    '--bw-day-hover-bg': '#ede9fe',

    // Rounded corners
    '--bw-picker-radius': '12px',
    '--bw-day-radius': '8px',
  }
})
```

## ðŸ”Œ Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(AccessibilityPlugin);
```

## ðŸ“ What's Included

```
dist/
â”œâ”€â”€ bw-theming.min.js      # IIFE build (for <script>)
â”œâ”€â”€ bw-theming.esm.min.js  # ESM build (for import)
â””â”€â”€ bw-theming.min.css     # Theme styles
```

## ðŸ”— Related Packages

| Package                                                                                          | Description      |
| ------------------------------------------------------------------------------------------------ | ---------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required)  |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav     |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto-positioning |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch support    |
| [@bw-ui/datepicker-input-handler](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) | Input masking    |
| [@bw-ui/datepicker-date-utils](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)       | Date utilities   |

## ðŸ“„ License

MIT Â© [BW UI](https://github.com/bw-ui)

## ðŸ› Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
