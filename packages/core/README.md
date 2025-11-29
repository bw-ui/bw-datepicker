# @bw-ui/datepicker

Lightweight, zero-dependency datepicker with plugin architecture.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 🪶 **~27KB gzipped** - Tiny footprint
- 🚀 **Zero dependencies** - No bloat
- 🔌 **Plugin system** - Extend as needed
- 📅 **3 modes** - Popup, modal, inline
- 🎯 **Event-driven** - Full control
- 🌍 **Localization** - Custom month/day names

## 📦 Installation

```bash
npm install @bw-ui/datepicker
```

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import '@bw-ui/datepicker/css';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
  format: 'YYYY-MM-DD',
});

picker.on('date:changed', ({ date, dateISO }) => {
  console.log('Selected:', dateISO);
});
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>
<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input');
</script>
```

## ⚙️ Options

```javascript
new BWDatePicker('#date', {
  mode: 'popup',
  format: 'YYYY-MM-DD',
  firstDayOfWeek: 0,
  showWeekdays: true,
  showFooter: true,
  closeOnSelect: true,
  allowDeselect: true,
  selectOtherMonths: true,
  minDate: null,
  maxDate: null,
  disabledDates: [],
  defaultDate: null,
  monthNames: null,
  dayNames: null,
});
```

### Options Reference

| Option              | Type          | Default        | Description                                    |
| ------------------- | ------------- | -------------- | ---------------------------------------------- |
| `mode`              | `string`      | `'popup'`      | Display mode: `'popup'`, `'modal'`, `'inline'` |
| `format`            | `string`      | `'YYYY-MM-DD'` | Date format for input display                  |
| `firstDayOfWeek`    | `number`      | `0`            | First day of week: `0` (Sun) - `6` (Sat)       |
| `showWeekdays`      | `boolean`     | `true`         | Show weekday headers                           |
| `showFooter`        | `boolean`     | `true`         | Show footer with Today/Clear buttons           |
| `closeOnSelect`     | `boolean`     | `true`         | Close picker after selecting date              |
| `allowDeselect`     | `boolean`     | `true`         | Allow clicking selected date to deselect       |
| `selectOtherMonths` | `boolean`     | `true`         | Allow selecting days from adjacent months      |
| `minDate`           | `Date\|null`  | `null`         | Minimum selectable date                        |
| `maxDate`           | `Date\|null`  | `null`         | Maximum selectable date                        |
| `disabledDates`     | `array`       | `[]`           | Array of disabled `Date` objects               |
| `defaultDate`       | `Date\|null`  | `null`         | Initial selected date                          |
| `monthNames`        | `array\|null` | `null`         | Custom month names (12 items)                  |
| `dayNames`          | `array\|null` | `null`         | Custom day names (7 items, starting Sunday)    |

## 📖 Display Modes

### Popup (Default)

Opens below the input field.

```javascript
new BWDatePicker('#date', { mode: 'popup' });
```

### Modal

Opens as centered overlay.

```javascript
new BWDatePicker('#date', { mode: 'modal' });
```

### Inline

Always visible, embedded in page.

```javascript
new BWDatePicker('#date', { mode: 'inline' });
```

## 🌍 Localization

### Spanish Example

```javascript
new BWDatePicker('#date', {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  dayNames: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  firstDayOfWeek: 1, // Monday
});
```

### French Example

```javascript
new BWDatePicker('#date', {
  monthNames: [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ],
  dayNames: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  firstDayOfWeek: 1,
});
```

### German Example

```javascript
new BWDatePicker('#date', {
  monthNames: [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ],
  dayNames: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  firstDayOfWeek: 1,
});
```

## 📅 Date Constraints

### Min/Max Dates

```javascript
new BWDatePicker('#date', {
  minDate: new Date('2025-01-01'),
  maxDate: new Date('2025-12-31'),
});
```

### Disabled Dates

```javascript
new BWDatePicker('#date', {
  disabledDates: [
    new Date('2025-12-25'), // Christmas
    new Date('2025-01-01'), // New Year
  ],
});
```

### Default Date

```javascript
new BWDatePicker('#date', {
  defaultDate: new Date('2025-06-15'),
});
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

### Events Reference

| Event              | Payload                      | Description              |
| ------------------ | ---------------------------- | ------------------------ |
| `date:changed`     | `{ date, dateISO, oldDate }` | Date value changed       |
| `date:selected`    | `{ date, dateISO }`          | User selected a date     |
| `date:cleared`     | -                            | Date cleared             |
| `picker:opened`    | -                            | Picker opened            |
| `picker:closed`    | -                            | Picker closed            |
| `nav:monthChanged` | `{ month, year }`            | Month navigation changed |
| `nav:yearChanged`  | `{ year }`                   | Year navigation changed  |

## 🛠️ Methods

```javascript
picker.open(); // Open picker
picker.close(); // Close picker
picker.setDate(date); // Set date
picker.getDate(); // Get date
picker.clear(); // Clear selection
picker.destroy(); // Destroy instance

picker.prevMonth(); // Previous month
picker.nextMonth(); // Next month
picker.prevYear(); // Previous year
picker.nextYear(); // Next year
picker.today(); // Select today
picker.refresh(); // Re-render
```

### Methods Reference

| Method          | Parameters | Returns      | Description          |
| --------------- | ---------- | ------------ | -------------------- |
| `open()`        | -          | `this`       | Open the picker      |
| `close()`       | -          | `this`       | Close the picker     |
| `setDate(date)` | `Date`     | `this`       | Set selected date    |
| `getDate()`     | -          | `Date\|null` | Get selected date    |
| `clear()`       | -          | `this`       | Clear selection      |
| `destroy()`     | -          | `void`       | Destroy instance     |
| `prevMonth()`   | -          | `this`       | Go to previous month |
| `nextMonth()`   | -          | `this`       | Go to next month     |
| `prevYear()`    | -          | `this`       | Go to previous year  |
| `nextYear()`    | -          | `this`       | Go to next year      |
| `today()`       | -          | `this`       | Select today         |
| `refresh()`     | -          | `this`       | Re-render picker     |

## 🔌 Plugins

Extend functionality with official plugins:

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

const picker = new BWDatePicker('#date')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(AccessibilityPlugin);
```

### Available Plugins

| Plugin                            | Description              | Links                                                                |
| --------------------------------- | ------------------------ | -------------------------------------------------------------------- |
| `@bw-ui/datepicker-theming`       | Dark mode, CSS variables | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-theming)       |
| `@bw-ui/datepicker-accessibility` | Keyboard nav, ARIA       | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) |
| `@bw-ui/datepicker-positioning`   | Auto-flip, collision     | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)   |
| `@bw-ui/datepicker-mobile`        | Touch, swipe             | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)        |
| `@bw-ui/datepicker-input-handler` | Input masking            | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) |
| `@bw-ui/datepicker-date-utils`    | Date utilities           | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)    |

## 📁 What's Included

```
dist/
├── bw-datepicker.min.js      # IIFE build (for <script>)
├── bw-datepicker.esm.min.js  # ESM build (for import)
└── bw-datepicker.min.css     # Styles
```

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
