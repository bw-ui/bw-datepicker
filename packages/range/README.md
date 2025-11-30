# @bw-ui/datepicker-range

Range plugin for BW DatePicker - Date range selection with presets and validation.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-range)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-range)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-range)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-range) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 📅 **Range Selection** - Select start and end dates
- ⚡ **Presets** - Today, Last 7 days, This month, custom presets
- 📍 **Flexible Position** - Top, bottom, left, right, dropdown
- ✅ **Validation** - Min/max range constraints
- 🎨 **Theming** - CSS variables, dark mode support
- 🔗 **Input Sync** - Sync with check-in/check-out inputs
- 📆 **View Mode Support** - Works in calendar and week views

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-range
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { RangePlugin } from '@bw-ui/datepicker-range';
import '@bw-ui/datepicker/css';
import '@bw-ui/datepicker-range/css';

const picker = new BWDatePicker('#date-input').use(RangePlugin, {
  presets: ['today', 'last7days', 'thisMonth'],
  presetsPosition: 'left',
});
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker-range/dist/bw-range.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-range/dist/bw-range.min.js"></script>

<script>
  const picker = new BWDatePicker('#date-input').use(BWRange.RangePlugin, {
    presets: ['today', 'last7days', 'thisMonth'],
    presetsPosition: 'left',
  });
</script>
```

## ⚙️ Options

```javascript
.use(RangePlugin, {
  // Range Constraints
  minRange: 1,              // Minimum days (default: 1)
  maxRange: 30,             // Maximum days (default: null)

  // Presets
  presets: [],              // Array of preset keys or custom presets
  presetsPosition: 'left',  // 'left' | 'right' | 'top' | 'bottom' | 'dropdown' | 'none'

  // Display
  highlightRange: true,     // Highlight days between start/end

  // Input Sync
  startInput: '#checkin',   // Start date input selector
  endInput: '#checkout',    // End date input selector
  format: 'YYYY-MM-DD',     // Date format for inputs

  // Labels
  startLabel: 'Check-in',   // Placeholder for start input
  endLabel: 'Check-out',    // Placeholder for end input

  // Behavior
  closeOnSelect: false,     // Close picker after range complete
})
```

### Options Reference

| Option            | Type              | Default        | Description                   |
| ----------------- | ----------------- | -------------- | ----------------------------- |
| `minRange`        | `number`          | `1`            | Minimum days required         |
| `maxRange`        | `number\|null`    | `null`         | Maximum days allowed          |
| `presets`         | `array`           | `[]`           | Preset keys or custom presets |
| `presetsPosition` | `string`          | `'left'`       | Position of presets panel     |
| `highlightRange`  | `boolean`         | `true`         | Highlight range between dates |
| `startInput`      | `string\|Element` | `null`         | Start date input              |
| `endInput`        | `string\|Element` | `null`         | End date input                |
| `format`          | `string`          | `'YYYY-MM-DD'` | Date format for inputs        |
| `closeOnSelect`   | `boolean`         | `false`        | Close after range complete    |

## 📅 Built-in Presets

| Key           | Label        | Range                 |
| ------------- | ------------ | --------------------- |
| `today`       | Today        | Today → Today         |
| `yesterday`   | Yesterday    | Yesterday → Yesterday |
| `last7days`   | Last 7 days  | -6 days → Today       |
| `last30days`  | Last 30 days | -29 days → Today      |
| `thisWeek`    | This week    | Sunday → Saturday     |
| `lastWeek`    | Last week    | Last Sun → Last Sat   |
| `thisMonth`   | This month   | 1st → Last day        |
| `lastMonth`   | Last month   | 1st → Last day        |
| `thisQuarter` | This quarter | Q start → Q end       |
| `lastQuarter` | Last quarter | Q start → Q end       |
| `thisYear`    | This year    | Jan 1 → Dec 31        |
| `lastYear`    | Last year    | Jan 1 → Dec 31        |

## 📖 Examples

### Basic Range Selection

```javascript
.use(RangePlugin, {
  highlightRange: true,
})
```

### With Presets (Left Panel)

```javascript
.use(RangePlugin, {
  presets: ['today', 'last7days', 'last30days', 'thisMonth'],
  presetsPosition: 'left',
})
```

### Presets Dropdown

```javascript
.use(RangePlugin, {
  presets: ['today', 'last7days', 'thisWeek', 'thisMonth', 'thisQuarter'],
  presetsPosition: 'dropdown',
})
```

### Hotel Booking (Min/Max Nights)

```javascript
.use(RangePlugin, {
  minRange: 1,           // Minimum 1 night
  maxRange: 30,          // Maximum 30 nights
  startInput: '#checkin',
  endInput: '#checkout',
  startLabel: 'Check-in',
  endLabel: 'Check-out',
  presets: ['thisWeek', 'thisMonth'],
  presetsPosition: 'bottom',
})
```

### Analytics Date Filter

```javascript
.use(RangePlugin, {
  presets: [
    'today',
    'yesterday',
    'last7days',
    'last30days',
    'thisMonth',
    'lastMonth',
    'thisQuarter',
  ],
  presetsPosition: 'left',
})
```

### Custom Presets

```javascript
.use(RangePlugin, {
  presets: [
    'today',
    'last7days',
    // Custom preset
    {
      label: 'Next Weekend',
      key: 'nextWeekend',
      getValue: () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
        const saturday = new Date(today);
        saturday.setDate(today.getDate() + daysUntilSat);
        const sunday = new Date(saturday);
        sunday.setDate(saturday.getDate() + 1);
        return [saturday, sunday];
      }
    },
    {
      label: 'This Pay Period',
      getValue: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth(), 15);
        return [start, end];
      }
    }
  ],
  presetsPosition: 'left',
})
```

## 📍 Presets Position

```
┌─────────────────────────────────────────────────────────┐
│                    presetsPosition: 'top'               │
│  [Today] [Last 7 days] [This Month] [This Quarter] →    │
├─────────────┬───────────────────────────────────────────┤
│             │                                           │
│  presets    │              Calendar                     │
│  Position:  │                                           │
│  'left'     │         December 2025                     │
│             │   Su Mo Tu We Th Fr Sa                    │
│ [Today    ] │       1  2  3  4  5  6                    │
│ [Last 7d  ] │    7  8  9 10 11 12 13                    │
│ [This Mon ] │   14 15 16 17 18 19 20                    │
│ [This Qtr ] │   21 22 23 24 25 26 27                    │
│             │   28 29 30 31                             │
│             │                                           │
├─────────────┴───────────────────────────────────────────┤
│                 presetsPosition: 'bottom'               │
│  [Today] [Last 7 days] [This Month] [This Quarter] →    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  presetsPosition: 'dropdown'                            │
│  ┌──────────────────┐                                   │
│  │ This Month     ▼ │  ← Shows selected preset          │
│  └──────────────────┘                                   │
│           │                                             │
│           ▼ (on click)                                  │
│  ┌──────────────────┐                                   │
│  │ Today            │                                   │
│  │ Last 7 days      │                                   │
│  │ This Month    ✓  │                                   │
│  │ This Quarter     │                                   │
│  └──────────────────┘                                   │
└─────────────────────────────────────────────────────────┘
```

## 🔌 API Methods

Access via `picker.getPlugin('range')`:

```javascript
const range = picker.getPlugin('range');

// Get current range
const { startDate, endDate } = range.getRange();

// Set range programmatically
range.setRange(new Date('2025-12-01'), new Date('2025-12-07'));

// Get days/nights count
range.getDays(); // 7
range.getNights(); // 6

// Apply preset
range.applyPreset('thisMonth');

// Get available presets
range.getPresets();

// Check selection state
range.isSelecting(); // 'start' or 'end'

// Reset selection
range.reset();
```

## 📡 Events

```javascript
const picker = new BWDatePicker('#date-input')
  .use(RangePlugin, { ... });

// Range changed (start or end selected)
picker.on('range:change', ({ startDate, endDate, selecting }) => {
  console.log('Range changed:', startDate, endDate);
  console.log('Now selecting:', selecting); // 'start' or 'end'
});

// Range complete (both dates selected)
picker.on('range:complete', ({ startDate, endDate, days, nights }) => {
  console.log('Range complete!');
  console.log(`${nights} nights selected`);
});

// Preset applied
picker.on('range:preset', ({ preset, startDate, endDate }) => {
  console.log('Preset applied:', preset);
});

// Validation error
picker.on('range:error', ({ error, preset }) => {
  console.log('Error:', error);
});

// Range reset
picker.on('range:reset', () => {
  console.log('Range cleared');
});
```

## 🎨 Theming

### CSS Variables

```css
.bw-datepicker--range {
  /* Primary color (start/end dates, selected preset) */
  --bw-range-primary: #3b82f6;
  --bw-range-primary-hover: #2563eb;

  /* Range highlight */
  --bw-range-in-bg: rgba(59, 130, 246, 0.15);
  --bw-range-hover-bg: rgba(59, 130, 246, 0.1);

  /* Error message */
  --bw-error-bg: #fee2e2;
  --bw-error-color: #dc2626;
  --bw-error-border: #fecaca;

  /* Presets panel */
  --bw-preset-bg: #f9fafb;
  --bw-preset-border: #e5e7eb;
  --bw-preset-btn-bg: #fff;
  --bw-preset-btn-color: inherit;
  --bw-preset-btn-hover-bg: #eff6ff;
  --bw-preset-btn-hover-color: #3b82f6;
}
```

### With Theming Plugin

```javascript
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { RangePlugin } from '@bw-ui/datepicker-range';

new BWDatePicker('#date-input')
  .use(ThemingPlugin, {
    theme: 'light',
    customVars: {
      '--bw-range-primary': '#10b981', // Green theme
      '--bw-range-in-bg': 'rgba(16, 185, 129, 0.15)',
    },
  })
  .use(RangePlugin, {
    presets: ['today', 'last7days', 'thisMonth'],
  });
```

### Dark Mode

Dark mode is automatically supported via:

- `[data-bw-theme="dark"]` attribute (Theming plugin)
- `.bw-datepicker--dark` class (manual)

## 📆 View Mode Support

The Range Plugin automatically handles different view modes:

| View Mode | Range Display |
|-----------|---------------|
| `calendar` | ✅ Shows range highlighting |
| `week` | ✅ Shows range highlighting |
| `month` | ❌ Presets hidden (month picker) |
| `year` | ❌ Presets hidden (year picker) |

When user switches to month or year picker view, presets are automatically hidden and shown again when returning to calendar/week view.

```javascript
// Works in week view too
const picker = new BWDatePicker('#date-input', {
  defaultViewMode: 'week',
}).use(RangePlugin, {
  presets: ['thisWeek', 'lastWeek'],
  presetsPosition: 'top',
});
```

## 🔌 Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { RangePlugin } from '@bw-ui/datepicker-range';
import { DataPlugin } from '@bw-ui/datepicker-data';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'auto' })
  .use(DataPlugin, {
    data: {
      '2025-12-25': { price: 299, status: 'limited' },
      '2025-12-31': { price: 499, status: 'sold-out' },
    },
    renderDay: (date, data) => (data ? `$${data.price}` : ''),
  })
  .use(RangePlugin, {
    minRange: 2,
    maxRange: 14,
    presets: ['thisWeek', 'thisMonth'],
    presetsPosition: 'left',
  });
```

## 📁 What's Included

```
dist/
├── bw-range.min.js       # IIFE build (for <script>)
├── bw-range.esm.min.js   # ESM build (for import)
└── bw-range.min.css      # Styles
```

## 🔗 Related Packages

| Package                                                                                          | Description           |
| ------------------------------------------------------------------------------------------------ | --------------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required)       |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode & themes    |
| [@bw-ui/datepicker-data](https://www.npmjs.com/package/@bw-ui/datepicker-data)                   | Prices & availability |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto positioning      |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav          |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch support         |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
