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
- 📆 **4 view modes** - Calendar, month, year, week
- 🎯 **Event-driven** - Full control
- 🌍 **Localization** - Custom month/day names
- 🎨 **Slot-based architecture** - Plugins can intercept rendering

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
  // Display
  mode: 'popup',
  format: 'YYYY-MM-DD',

  // Calendar
  firstDayOfWeek: 0,
  showWeekdays: true,
  showFooter: true,
  showOtherMonths: true,
  selectOtherMonths: true,

  // Date constraints
  minDate: null,
  maxDate: null,
  disabledDates: [],
  defaultDate: null,

  // Behavior
  closeOnSelect: true,
  allowDeselect: true,

  // Localization
  monthNames: null,
  dayNames: null,

  // View modes
  defaultViewMode: 'calendar',
  showMonthPicker: true,
  showYearPicker: true,
  showYearNavigation: true,
  showMonthNavigation: true,
  showWeekNavigation: true,
  resetViewOnClose: true,
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
| `showOtherMonths`   | `boolean`     | `true`         | Show days from adjacent months                 |
| `selectOtherMonths` | `boolean`     | `true`         | Allow selecting days from adjacent months      |
| `minDate`           | `Date\|null`  | `null`         | Minimum selectable date                        |
| `maxDate`           | `Date\|null`  | `null`         | Maximum selectable date                        |
| `disabledDates`     | `array`       | `[]`           | Array of disabled `Date` objects               |
| `defaultDate`       | `Date\|null`  | `null`         | Initial selected date                          |
| `monthNames`        | `array\|null` | `null`         | Custom month names (12 items)                  |
| `dayNames`          | `array\|null` | `null`         | Custom day names (7 items, starting Sunday)    |

### View Mode Options

| Option                | Type      | Default      | Description                                               |
| --------------------- | --------- | ------------ | --------------------------------------------------------- |
| `defaultViewMode`     | `string`  | `'calendar'` | Initial view: `'calendar'`, `'month'`, `'year'`, `'week'` |
| `showMonthPicker`     | `boolean` | `true`       | Enable clicking month to show month picker                |
| `showYearPicker`      | `boolean` | `true`       | Enable clicking year to show year picker                  |
| `showYearNavigation`  | `boolean` | `true`       | Show « » year navigation buttons                          |
| `showMonthNavigation` | `boolean` | `true`       | Show ‹ › month navigation buttons                         |
| `showWeekNavigation`  | `boolean` | `true`       | Show ← → week navigation buttons (week view)              |
| `resetViewOnClose`    | `boolean` | `true`       | Reset to defaultViewMode when picker closes               |

## 📆 View Modes

### Calendar View (Default)

Standard month calendar with days grid.

```javascript
new BWDatePicker('#date', { defaultViewMode: 'calendar' });
```

### Month View

4x3 grid of months for quick month selection.

```javascript
new BWDatePicker('#date', { defaultViewMode: 'month' });

// Or switch programmatically
picker.setViewMode('month');
```

### Year View

4x3 grid of years (12 years at a time).

```javascript
new BWDatePicker('#date', { defaultViewMode: 'year' });

// Or switch programmatically
picker.setViewMode('year');
```

### Week View

Single week display with week-by-week navigation.

```javascript
new BWDatePicker('#date', { defaultViewMode: 'week' });

// Navigate weeks
picker.changeWeek(1); // Next week
picker.changeWeek(-1); // Previous week
```

### Minimal Navigation Example

```javascript
// Only week navigation, no pickers
new BWDatePicker('#date', {
  defaultViewMode: 'week',
  showMonthPicker: false,
  showYearPicker: false,
  showYearNavigation: false,
  showMonthNavigation: false,
  // showWeekNavigation: true (default)
});
```

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
picker.on('nav:weekChanged', ({ date }) => {});
picker.on('view:changed', ({ viewMode }) => {});
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
| `nav:weekChanged`  | `{ date }`                   | Week navigation changed  |
| `view:changed`     | `{ viewMode }`               | View mode changed        |

### Render Events (for Plugins)

| Event             | Payload                    | Description                  |
| ----------------- | -------------------------- | ---------------------------- |
| `render:before`   | `{ data, slots }`          | Before render, modify data   |
| `render:header`   | `{ data, slot }`           | Intercept header rendering   |
| `render:calendar` | `{ data, slot, viewMode }` | Intercept calendar rendering |
| `render:footer`   | `{ data, slot }`           | Intercept footer rendering   |
| `render:after`    | `{ data, slots, element }` | After render, add classes    |
| `render:day`      | `{ dayData, html }`        | Customize day cell           |
| `render:weekdays` | `{ dayNames, html }`       | Customize weekday headers    |

## 🛠️ Methods

```javascript
// Open/Close
picker.open();
picker.close();

// Date manipulation
picker.setDate(date);
picker.getDate();
picker.clear();

// Navigation
picker.changeMonth(-1); // Previous month
picker.changeMonth(1); // Next month
picker.changeYear(-1); // Previous year
picker.changeYear(1); // Next year
picker.changeWeek(-1); // Previous week
picker.changeWeek(1); // Next week
picker.goToDate(date); // Navigate to date without selecting
picker.goToToday(); // Navigate to today

// View modes
picker.setViewMode('calendar'); // Switch to calendar view
picker.setViewMode('month'); // Switch to month picker
picker.setViewMode('year'); // Switch to year picker
picker.setViewMode('week'); // Switch to week view
picker.getViewMode(); // Get current view mode

// Utility
picker.refresh(); // Force re-render
picker.destroy(); // Destroy instance
```

### Methods Reference

| Method                | Parameters | Returns      | Description                |
| --------------------- | ---------- | ------------ | -------------------------- |
| `open()`              | -          | `this`       | Open the picker            |
| `close()`             | -          | `this`       | Close the picker           |
| `setDate(date)`       | `Date`     | `this`       | Set selected date          |
| `getDate()`           | -          | `Date\|null` | Get selected date          |
| `clear()`             | -          | `this`       | Clear selection            |
| `changeMonth(offset)` | `number`   | `this`       | Navigate months            |
| `changeYear(offset)`  | `number`   | `this`       | Navigate years             |
| `changeWeek(offset)`  | `number`   | `this`       | Navigate weeks             |
| `goToDate(date)`      | `Date`     | `this`       | Navigate without selecting |
| `goToToday()`         | -          | `this`       | Navigate to today          |
| `setViewMode(mode)`   | `string`   | `this`       | Set view mode              |
| `getViewMode()`       | -          | `string`     | Get current view mode      |
| `refresh()`           | -          | `this`       | Re-render picker           |
| `destroy()`           | -          | `void`       | Destroy instance           |

## 🔌 Plugins

Extend functionality with official plugins:

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { RangePlugin } from '@bw-ui/datepicker-range';

const picker = new BWDatePicker('#date')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(RangePlugin);
```

### Plugin Architecture

Plugins can intercept rendering using the slot-based event system:

```javascript
// Example: Custom day rendering
eventBus.on('render:day', (eventData) => {
  const { dayData } = eventData;
  if (isHoliday(dayData.date)) {
    eventData.html = `<span class="holiday">${dayData.day}</span>`;
  }
});

// Example: Replace entire calendar slot
eventBus.on('render:calendar', ({ slot, data }) => {
  slot.innerHTML = renderDualCalendar(data);
  return true; // Intercept - skip default rendering
});
```

### Available Plugins

| Plugin                            | Description                | Links                                                                |
| --------------------------------- | -------------------------- | -------------------------------------------------------------------- |
| `@bw-ui/datepicker-theming`       | Dark mode, CSS variables   | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-theming)       |
| `@bw-ui/datepicker-accessibility` | Keyboard nav, ARIA         | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) |
| `@bw-ui/datepicker-positioning`   | Auto-flip, collision       | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)   |
| `@bw-ui/datepicker-mobile`        | Touch, swipe               | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)        |
| `@bw-ui/datepicker-range`         | Date range selection       | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-range)         |
| `@bw-ui/datepicker-dual-calendar` | Two calendars side by side | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-dual-calendar) |

## 🎨 CSS Classes

### View Mode Classes

The picker element gets a class based on current view mode:

```css
.bw-datepicker--view-calendar {
}
.bw-datepicker--view-month {
}
.bw-datepicker--view-year {
}
.bw-datepicker--view-week {
}
```

### Slot Classes

```css
.bw-datepicker__slot--header {
}
.bw-datepicker__slot--calendar {
}
.bw-datepicker__slot--footer {
}
```

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
