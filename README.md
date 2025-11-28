# BW DatePicker

A lightweight, zero-dependency datepicker with a modular plugin architecture.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Size](https://img.shields.io/badge/core%20size-~27.3KB%20gzipped-brightgreen)

[Live Demo](https://bw-ui.github.io/bw-datepicker)

## ✨ Features

- 🪶 **Lightweight** - Core is only ~27.3KB gzipped
- 🔌 **Modular** - Use only what you need with plugins
- 🎨 **Themeable** - Dark mode, CSS variables, custom themes
- ♿ **Accessible** - Full keyboard navigation, ARIA support
- 📱 **Mobile Ready** - Touch & swipe gestures
- 🚀 **Zero Dependencies** - No external libraries required
- 📦 **Multiple Formats** - ESM and IIFE builds

## 📦 Packages

| Package                           | Description              | Size    |
| --------------------------------- | ------------------------ | ------- |
| `@bw-ui/datepicker`               | Core datepicker          | ~27.3KB |
| `@bw-ui/datepicker-theming`       | Dark mode, CSS variables | ~11.5KB |
| `@bw-ui/datepicker-accessibility` | Keyboard nav, ARIA       | ~18.8KB |
| `@bw-ui/datepicker-positioning`   | Auto-flip, collision     | ~11.2KB |
| `@bw-ui/datepicker-mobile`        | Touch, swipe gestures    | ~7.49KB |
| `@bw-ui/datepicker-input-handler` | Input masking            | ~12.2KB |
| `@bw-ui/datepicker-date-utils`    | Date parsing             | ~19KB   |

## 🚀 Installation

```bash
# Core only
npm install @bw-ui/datepicker

# With plugins
npm install @bw-ui/datepicker @bw-ui/datepicker-theming @bw-ui/datepicker-accessibility
```

## 📖 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
  format: 'YYYY-MM-DD',
})
  .use(ThemingPlugin, { theme: 'dark' })
  .use(AccessibilityPlugin);

// Listen to events
picker.on('date:changed', ({ date, dateISO }) => {
  console.log('Selected:', dateISO);
});
```

### Browser (Script Tag)

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker-theming/dist/bw-theming.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-theming/dist/bw-theming.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input').use(
    BWTheming.ThemingPlugin,
    { theme: 'dark' }
  );
</script>
```

## ⚙️ Options

```javascript
const picker = new BWDatePicker('#date', {
  // Display mode: 'popup' | 'modal' | 'inline'
  mode: 'popup',

  // Date format for display
  format: 'DD/MM/YYYY',

  // Minimum selectable date
  minDate: new Date(),

  // Maximum selectable date
  maxDate: new Date('2025-12-31'),

  // Disabled dates
  disabledDates: [new Date('2025-12-25')],
});
```

## 🔌 Plugin Options

### Theming

```javascript
.use(ThemingPlugin, {
  theme: 'dark',        // 'light' | 'dark' | 'auto'
  persist: true,        // Save preference to localStorage
  storageKey: 'theme'   // localStorage key
})
```

### Accessibility

```javascript
.use(AccessibilityPlugin)
// Keyboard shortcuts:
// - Arrow keys: Navigate days
// - Enter/Space: Select date
// - Escape: Close picker
// - Tab: Navigate elements
// - PageUp/Down: Navigate months
// - Shift+PageUp/Down: Navigate years
```

### Positioning

```javascript
.use(PositioningPlugin, {
  placement: 'bottom',  // 'top' | 'bottom' | 'left' | 'right'
  alignment: 'left',    // 'left' | 'center' | 'right'
  autoFlip: true,       // Flip when near edges
  offset: { x: 0, y: 8 }
})
```

### Mobile

```javascript
.use(MobilePlugin, {
  touchFeedback: true   // Visual feedback on touch
})
// Swipe left: Next month
// Swipe right: Previous month
```

### Input Handler

```javascript
.use(InputHandlerPlugin, {
  format: 'DD/MM/YYYY',
  allowManualInput: true,
  validateOnBlur: true,
  showErrors: true
})
```

### Date Utils

```javascript
.use(DateUtilsPlugin)

// Then use:
picker.parseDate('25 Dec 2025');  // Returns Date object
picker.formatDate(new Date());    // Returns formatted string
```

## 📡 Events

```javascript
picker.on('date:changed', ({ date, dateISO, oldDate }) => {});
picker.on('date:selected', ({ date, dateISO }) => {});
picker.on('date:cleared', () => {});

picker.on('picker:opened', () => {});
picker.on('picker:closed', () => {});

picker.on('nav:monthChanged', ({ month, year }) => {});
picker.on('nav:yearChanged', ({ year }) => {});
```

## 🛠️ API Methods

```javascript
picker.open(); // Open the picker
picker.close(); // Close the picker
picker.setDate(date); // Set selected date
picker.getDate(); // Get selected date
picker.clear(); // Clear selection
picker.destroy(); // Destroy instance

picker.prevMonth(); // Go to previous month
picker.nextMonth(); // Go to next month
picker.prevYear(); // Go to previous year
picker.nextYear(); // Go to next year
picker.today(); // Select today

picker.refresh(); // Re-render the picker
```

## 🏗️ Development

```bash
# Clone the repo
git clone https://github.com/AnsKaz-dev/bw-ui-datepicker.git
cd bw-ui-datepicker

# Install dependencies
npm install

# Build all packages
npm run build

# Build specific package
npm run build:core
npm run build:theming
```

## 📄 License

MIT
