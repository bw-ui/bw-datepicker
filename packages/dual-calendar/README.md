# @bw-ui/datepicker-dual-calendar

Dual Calendar plugin for BW DatePicker - Two months side by side.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-dual-calendar)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-dual-calendar)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-dual-calendar)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-dual-calendar) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 📅 **Multiple Months** - 2-4 months side by side
- 🔗 **Linked Navigation** - All calendars move together
- 🎯 **Independent Mode** - Navigate each calendar separately
- 🌍 **Locale Support** - Works with locale plugin
- 🎨 **Theming** - CSS variables, dark mode support
- 📱 **Responsive** - Stacks on mobile
- 🔌 **Plugin Compatible** - Emits render:day events for Data plugin support

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-dual-calendar
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { DualCalendarPlugin } from '@bw-ui/datepicker-dual-calendar';
import '@bw-ui/datepicker/css';
import '@bw-ui/datepicker-dual-calendar/css';

const picker = new BWDatePicker('#date-input').use(DualCalendarPlugin);
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker-dual-calendar/dist/bw-dual-calendar.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-dual-calendar/dist/bw-dual-calendar.min.js"></script>

<script>
  const picker = new BWDatePicker('#date-input').use(
    BWDualCalendar.DualCalendarPlugin
  );
</script>
```

## ⚙️ Options

```javascript
.use(DualCalendarPlugin, {
  // Navigation
  linked: true,              // Navigate all calendars together (default: true)
  months: 2,                 // Number of months to show: 2-4 (default: 2)
  gap: 1,                    // Months gap between calendars (default: 1)

  // Starting position
  leftMonth: null,           // Starting month 0-11 (default: current)
  leftYear: null,            // Starting year (default: current)

  // Display
  showNavigation: 'outside', // Navigation button position
})
```

### Options Reference

| Option           | Type      | Default     | Description                                              |
| ---------------- | --------- | ----------- | -------------------------------------------------------- |
| `linked`         | `boolean` | `true`      | Navigate all calendars together                          |
| `months`         | `number`  | `2`         | Number of months to display (2-4)                        |
| `gap`            | `number`  | `1`         | Months gap between calendars (1 = consecutive)           |
| `leftMonth`      | `number`  | `null`      | Starting month (0-11), null = current month              |
| `leftYear`       | `number`  | `null`      | Starting year, null = current year                       |
| `showNavigation` | `string`  | `'outside'` | Navigation position: `'outside'` \| `'both'` \| `'left'` |

## 📖 Examples

### Basic Dual Calendar

```javascript
new BWDatePicker('#date-input').use(DualCalendarPlugin);
```

```
┌─────────────────────────────────────────────────────────┐
│  ◄                December 2025    January 2026       ► │
├────────────────────────────┬────────────────────────────┤
│  Su Mo Tu We Th Fr Sa      │  Su Mo Tu We Th Fr Sa      │
│      1  2  3  4  5  6      │            1  2  3         │
│   7  8  9 10 11 12 13      │   4  5  6  7  8  9 10      │
│  14 15 16 17 18 19 20      │  11 12 13 14 15 16 17      │
│  21 22 23 24 25 26 27      │  18 19 20 21 22 23 24      │
│  28 29 30 31               │  25 26 27 28 29 30 31      │
└────────────────────────────┴────────────────────────────┘
```

### Hotel Booking (with Range Plugin)

```javascript
import { RangePlugin } from '@bw-ui/datepicker-range';
import { DualCalendarPlugin } from '@bw-ui/datepicker-dual-calendar';

new BWDatePicker('#booking-date')
  .use(DualCalendarPlugin, {
    linked: true,
    gap: 1,
  })
  .use(RangePlugin, {
    minRange: 1,
    maxRange: 30,
  });
```

### Monday First

```javascript
.use(DualCalendarPlugin, {
  firstDayOfWeek: 1, // Monday
})
```

### Two Month Gap (Compare)

```javascript
.use(DualCalendarPlugin, {
  linked: true,
  gap: 6, // Show 6 months apart (e.g., Jan + July)
})
```

### Independent Navigation

```javascript
.use(DualCalendarPlugin, {
  linked: false, // Each calendar navigates separately
})
```

### Custom Locale

```javascript
.use(DualCalendarPlugin, {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
               'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  dayNames: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
  firstDayOfWeek: 1,
})
```

### With Locale Plugin

```javascript
import { LocalePlugin } from '@bw-ui/datepicker-locale';
import { DualCalendarPlugin } from '@bw-ui/datepicker-dual-calendar';

new BWDatePicker('#date-input')
  .use(LocalePlugin, { locale: 'de-DE' })
  .use(DualCalendarPlugin);
// Month/day names automatically use German locale
```

## 🔌 API Methods

Access via `picker.getPlugin('dual-calendar')`:

```javascript
const dual = picker.getPlugin('dual-calendar');

// Get calendar states
dual.getLeft(); // { month: 11, year: 2025 }
dual.getRight(); // { month: 0, year: 2026 }

// Navigation
dual.prevMonth(); // Go to previous month
dual.nextMonth(); // Go to next month
dual.prevYear(); // Go to previous year
dual.nextYear(); // Go to next year

// Go to specific date
dual.goToDate(new Date('2025-06-15'));

// Go to today
dual.goToToday();

// Linked mode
dual.setLinked(false); // Disable linked navigation
dual.isLinked(); // Check if linked

// Refresh
dual.refresh();
```

## 📡 Events

```javascript
const picker = new BWDatePicker('#date-input').use(DualCalendarPlugin);

// Navigation event
picker.on('dual:navigate', ({ left, right }) => {
  console.log('Left calendar:', left.month, left.year);
  console.log('Right calendar:', right.month, right.year);
});
```

## 🎨 Theming

### CSS Variables

```css
.bw-datepicker--dual {
  /* Gap between calendars */
  --bw-dual-gap: 16px;

  /* Navigation */
  --bw-dual-border: #e5e7eb;
  --bw-dual-btn-bg: #fff;
  --bw-dual-btn-color: #374151;
  --bw-dual-btn-hover-bg: #f3f4f6;
  --bw-dual-btn-hover-border: #d1d5db;
  --bw-dual-btn-active-bg: #e5e7eb;

  /* Title */
  --bw-dual-title-color: #111827;

  /* Weekdays */
  --bw-dual-weekday-color: #6b7280;

  /* Days */
  --bw-dual-day-color: #111827;
  --bw-dual-day-bg: transparent;
  --bw-dual-day-hover-bg: #f3f4f6;
  --bw-dual-day-other-color: #d1d5db;
  --bw-dual-today-color: #3b82f6;
  --bw-dual-selected-bg: #3b82f6;
}
```

### Custom Theme Example

```css
.bw-datepicker--dual {
  --bw-dual-gap: 24px;
  --bw-dual-selected-bg: #10b981;
  --bw-dual-today-color: #10b981;
}
```

### With Theming Plugin

```javascript
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { DualCalendarPlugin } from '@bw-ui/datepicker-dual-calendar';

new BWDatePicker('#date-input')
  .use(ThemingPlugin, {
    theme: 'dark',
    customVars: {
      '--bw-dual-selected-bg': '#10b981',
      '--bw-dual-today-color': '#34d399',
    },
  })
  .use(DualCalendarPlugin);
```

### Dark Mode

Dark mode is automatically supported via:

- `[data-bw-theme="dark"]` attribute (Theming plugin)
- `.bw-datepicker--dark` class (manual)

## 🔌 Combining with Other Plugins

### Full Hotel Booking Setup

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { DualCalendarPlugin } from '@bw-ui/datepicker-dual-calendar';
import { RangePlugin } from '@bw-ui/datepicker-range';
import { DataPlugin } from '@bw-ui/datepicker-data';

const picker = new BWDatePicker('#booking')
  .use(ThemingPlugin, { theme: 'light' })
  .use(DualCalendarPlugin, { linked: true })
  .use(DataPlugin, {
    data: {
      '2025-12-24': { price: 199, status: 'available' },
      '2025-12-25': { price: 299, status: 'limited' },
      '2025-12-31': { price: 499, status: 'sold-out' },
    },
    renderDay: (date, data) => (data ? `$${data.price}` : ''),
  })
  .use(RangePlugin, {
    minRange: 1,
    maxRange: 14,
    presets: ['thisWeek', 'thisMonth'],
    presetsPosition: 'left',
  });
```

## 📁 What's Included

```
dist/
├── bw-dual-calendar.min.js       # IIFE build (for <script>)
├── bw-dual-calendar.esm.min.js   # ESM build (for import)
└── bw-dual-calendar.min.css      # Styles
```

## 📱 Responsive Behavior

On screens smaller than 600px:

- Calendars stack vertically
- Month titles stack
- Full width days

```css
@media (max-width: 600px) {
  .bw-dual-calendars {
    flex-direction: column;
  }
}
```

## 🔗 Related Packages

| Package                                                                              | Description           |
| ------------------------------------------------------------------------------------ | --------------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                 | Core (required)       |
| [@bw-ui/datepicker-range](https://www.npmjs.com/package/@bw-ui/datepicker-range)     | Date range selection  |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming) | Dark mode & themes    |
| [@bw-ui/datepicker-data](https://www.npmjs.com/package/@bw-ui/datepicker-data)       | Prices & availability |
| [@bw-ui/datepicker-locale](https://www.npmjs.com/package/@bw-ui/datepicker-locale)   | Internationalization  |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
