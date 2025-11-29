# @bw-ui/datepicker-input-handler

Input handler plugin for BW DatePicker - Date masking, manual input, validation, and error messages.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-input-handler)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-input-handler)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-input-handler)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- ⌨️ **Manual Input** - Type dates directly
- 🎭 **Input Masking** - Auto-format as you type (DD/MM/YYYY)
- ✅ **Validation** - Validate on blur with error messages
- 🔄 **Auto Sync** - Syncs input with picker
- 📅 **Multiple Formats** - Support various date formats

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-input-handler
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { InputHandlerPlugin } from '@bw-ui/datepicker-input-handler';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
}).use(BWInputHandler.InputHandlerPlugin, {
  format: 'DD/MM/YYYY',
  allowManualInput: true,
});
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-input-handler/dist/bw-input-handler.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input').use(
    BWInputHandler.InputHandlerPlugin,
    {
      format: 'DD/MM/YYYY',
    }
  );
</script>
```

## ⚙️ Options

```javascript
.use(BWInputHandler.InputHandlerPlugin, {
  format: 'DD/MM/YYYY',
  allowManualInput: true,
  autoCorrect: true,
  validateOnBlur: true,
  showErrors: true,
})
```

### Options Reference

| Option             | Type      | Default        | Values                                                                         | Description                                      |
| ------------------ | --------- | -------------- | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| `format`           | `string`  | `'DD/MM/YYYY'` | `'DD/MM/YYYY'`, `'MM/DD/YYYY'`, `'YYYY-MM-DD'`, `'DD-MM-YYYY'`, `'DD.MM.YYYY'` | Date format for input/display                    |
| `allowManualInput` | `boolean` | `true`         | `true`, `false`                                                                | Allow typing in input field                      |
| `autoCorrect`      | `boolean` | `true`         | `true`, `false`                                                                | Auto-correct invalid dates (e.g., 32/01 → 31/01) |
| `validateOnBlur`   | `boolean` | `true`         | `true`, `false`                                                                | Validate when input loses focus                  |
| `showErrors`       | `boolean` | `true`         | `true`, `false`                                                                | Show error messages below input                  |

## 📅 Supported Formats

| Format       | Example    | Delimiter |
| ------------ | ---------- | --------- |
| `DD/MM/YYYY` | 25/12/2025 | `/`       |
| `MM/DD/YYYY` | 12/25/2025 | `/`       |
| `YYYY-MM-DD` | 2025-12-25 | `-`       |
| `DD-MM-YYYY` | 25-12-2025 | `-`       |
| `DD.MM.YYYY` | 25.12.2025 | `.`       |

## 🔧 How It Works

### 1. Input Masking

As you type, the input auto-formats:

```
User types: 2512202
Display:    25/12/202

User types: 25122025
Display:    25/12/2025
```

### 2. Validation

On blur, validates the date:

```javascript
// Valid date
"25/12/2025" → ✅ Accepted

// Invalid date
"32/13/2025" → ❌ "Invalid date"

// Incomplete date
"25/12" → ❌ "Incomplete date"
```

### 3. Auto Sync

When valid date is entered, picker updates:

```javascript
// User types "25/12/2025"
// Picker automatically navigates to December 2025
// Day 25 is selected
```

## 📖 Examples

### Basic Usage

```javascript
.use(BWInputHandler.InputHandlerPlugin)
// Uses defaults: DD/MM/YYYY format, all features enabled
```

### US Date Format

```javascript
.use(BWInputHandler.InputHandlerPlugin, {
  format: 'MM/DD/YYYY'
})
// User types: 12252025
// Display: 12/25/2025
```

### ISO Format

```javascript
.use(BWInputHandler.InputHandlerPlugin, {
  format: 'YYYY-MM-DD'
})
// User types: 20251225
// Display: 2025-12-25
```

### Disable Validation Errors

```javascript
.use(BWInputHandler.InputHandlerPlugin, {
  showErrors: false,
  validateOnBlur: false
})
// No error messages shown
```

### Read-only (No Manual Input)

```javascript
.use(BWInputHandler.InputHandlerPlugin, {
  allowManualInput: false
})
// User can only select from picker, not type
```

### Strict Validation (No Auto-correct)

```javascript
.use(BWInputHandler.InputHandlerPlugin, {
  autoCorrect: false
})
// Invalid dates are rejected, not corrected
```

## 🎨 Styling Errors

The plugin adds CSS classes for error states:

```css
/* Input with error */
.bw-datepicker-input--error {
  border-color: #e53e3e;
}

/* Error message */
.bw-datepicker-input__error {
  color: #e53e3e;
  font-size: 12px;
  margin-top: 4px;
}
```

### Custom Error Styling

```css
/* Override error colors */
.bw-datepicker-input--error {
  border-color: #ff0000;
  box-shadow: 0 0 0 2px rgba(255, 0, 0, 0.2);
}

.bw-datepicker-input__error {
  color: #ff0000;
  font-weight: bold;
}
```

## 🔌 Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { InputHandlerPlugin } from '@bw-ui/datepicker-input-handler';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

const picker = new BWDatePicker('#date-input')
  .use(BWTheming.ThemingPlugin, { theme: 'dark' })
  .use(BWInputHandler.InputHandlerPlugin, { format: 'DD/MM/YYYY' })
  .use(BWAccessibility.AccessibilityPlugin);
```

## 📁 What's Included

```
dist/
├── bw-input-handler.min.js      # IIFE build (for <script>)
└── bw-input-handler.esm.min.js  # ESM build (for import)
```

## 🔗 Related Packages

| Package                                                                                          | Description      |
| ------------------------------------------------------------------------------------------------ | ---------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required)  |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode        |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav     |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto-positioning |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch support    |
| [@bw-ui/datepicker-date-utils](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)       | Date utilities   |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
