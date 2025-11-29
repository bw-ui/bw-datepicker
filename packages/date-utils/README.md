# @bw-ui/datepicker-date-utils

Date utilities plugin for BW DatePicker - Parsing, formatting, validation, and date manipulation.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-date-utils)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-date-utils)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-date-utils)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 📅 **Date Parsing** - Parse various date formats
- 🔄 **Date Formatting** - Format dates to strings
- ✅ **Validation** - Validate date inputs
- ➕ **Manipulation** - Add/subtract days, months, years
- 📊 **Comparison** - Compare dates easily
- 📆 **Calendar Generation** - Generate month grids

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-date-utils
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { DateUtilsPlugin } from '@bw-ui/datepicker-date-utils';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
}).use(DateUtilsPlugin);

// Access utilities
const utils = picker.getPlugin('date-utils');
const formatted = utils.formatter.formatDate(new Date(), 'DD/MM/YYYY');
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-date-utils/dist/bw-date-utils.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input').use(
    BWDateUtils.DateUtilsPlugin
  );

  const utils = picker.getPlugin('date-utils');
</script>
```

## 📖 Usage

```javascript
const utils = picker.getPlugin('date-utils');

// Access modules
utils.formatter; // Formatting functions
utils.parser; // Parsing functions
utils.validator; // Validation functions
utils.calculator; // Date math functions
utils.comparator; // Comparison functions
utils.generator; // Calendar generation
```

## 🔄 Formatter

```javascript
const { formatter } = picker.getPlugin('date-utils');

// Format with tokens
formatter.formatDate(new Date(), 'DD/MM/YYYY'); // "25/12/2025"
formatter.formatDate(new Date(), 'YYYY-MM-DD'); // "2025-12-25"
formatter.formatDate(new Date(), 'MMMM D, YYYY'); // "December 25, 2025"

// Preset formats
formatter.toISO(new Date()); // "2025-12-25"
formatter.toUS(new Date()); // "12/25/2025"
formatter.toEU(new Date()); // "25/12/2025"
formatter.toLong(new Date()); // "December 25, 2025"
formatter.toShort(new Date()); // "Dec 25, 2025"
formatter.toRelative(new Date()); // "Today"
formatter.toOrdinal(new Date()); // "December 25th, 2025"

// Date range
formatter.toRange(startDate, endDate); // "Dec 25 - 31, 2025"
```

### Format Tokens

| Token  | Output     | Description      |
| ------ | ---------- | ---------------- |
| `YYYY` | `2025`     | 4-digit year     |
| `YY`   | `25`       | 2-digit year     |
| `MMMM` | `December` | Full month name  |
| `MMM`  | `Dec`      | Short month name |
| `MM`   | `12`       | 2-digit month    |
| `M`    | `12`       | Month number     |
| `DD`   | `25`       | 2-digit day      |
| `D`    | `25`       | Day number       |
| `dddd` | `Thursday` | Full day name    |
| `ddd`  | `Thu`      | Short day name   |
| `HH`   | `14`       | 2-digit hours    |
| `mm`   | `30`       | 2-digit minutes  |
| `ss`   | `45`       | 2-digit seconds  |

## 📝 Parser

```javascript
const { parser } = picker.getPlugin('date-utils');

// Smart parse various formats
parser.smartParse('25/12/2025'); // Date object
parser.smartParse('2025-12-25'); // Date object
parser.smartParse('December 25, 2025'); // Date object
```

## ✅ Validator

```javascript
const { validator } = picker.getPlugin('date-utils');

// Validate dates
validator.isValidDate(new Date()); // true
validator.isValidDate('invalid'); // false
validator.isValidDate(new Date('invalid')); // false
```

## ➕ Calculator

```javascript
const { calculator } = picker.getPlugin('date-utils');
const today = new Date();

// Add time
calculator.addDays(today, 5); // Date + 5 days
calculator.addWeeks(today, 2); // Date + 2 weeks
calculator.addMonths(today, 3); // Date + 3 months
calculator.addYears(today, 1); // Date + 1 year

// Subtract time
calculator.subtractDays(today, 5); // Date - 5 days
calculator.subtractMonths(today, 2); // Date - 2 months
calculator.subtractYears(today, 1); // Date - 1 year

// Get boundaries
calculator.startOfDay(today); // 00:00:00.000
calculator.endOfDay(today); // 23:59:59.999
calculator.startOfMonth(today); // First day of month
calculator.endOfMonth(today); // Last day of month
calculator.startOfYear(today); // Jan 1
calculator.endOfYear(today); // Dec 31
calculator.startOfWeek(today); // Sunday (or Monday with param)
calculator.endOfWeek(today); // Saturday

// Get info
calculator.getDaysInMonth(today); // 28-31
calculator.getDaysInYear(today); // 365 or 366
calculator.isLeapYear(2024); // true

// Calculate differences
calculator.diffInDays(date1, date2); // Number of days
calculator.diffInWeeks(date1, date2); // Number of weeks
calculator.diffInMonths(date1, date2); // Number of months
calculator.diffInYears(date1, date2); // Number of years
```

## 📊 Comparator

```javascript
const { comparator } = picker.getPlugin('date-utils');

// Same checks
comparator.isSameDay(date1, date2); // true/false
comparator.isSameMonth(date1, date2); // true/false
comparator.isSameYear(date1, date2); // true/false
comparator.isSameWeek(date1, date2); // true/false

// Order checks
comparator.isBefore(date1, date2); // true/false
comparator.isAfter(date1, date2); // true/false
comparator.isBetween(date, start, end); // true/false

// Compare
comparator.compare(date1, date2); // -1, 0, or 1

// Array operations
comparator.min([date1, date2, date3]); // Earliest date
comparator.max([date1, date2, date3]); // Latest date
comparator.sort([date1, date2, date3]); // Sorted array
comparator.closest(target, dates); // Nearest date to target
```

## 📆 Generator

```javascript
const { generator } = picker.getPlugin('date-utils');

// Generate calendar month grid
generator.generateMonth(2025, 11); // December 2025
// Returns array of weeks, each containing 7 dates
```

## 📖 Examples

### Calculate Age

```javascript
const { calculator } = picker.getPlugin('date-utils');
const birthDate = new Date('1990-06-15');
const today = new Date();

const age = calculator.diffInYears(birthDate, today);
console.log(`Age: ${age} years`);
```

### Format Date Range

```javascript
const { formatter } = picker.getPlugin('date-utils');
const start = new Date('2025-12-25');
const end = new Date('2025-12-31');

console.log(formatter.toRange(start, end));
// "Dec 25 - 31, 2025"
```

### Get Next Business Day

```javascript
const { calculator, comparator } = picker.getPlugin('date-utils');

function nextBusinessDay(date) {
  let next = calculator.addDays(date, 1);
  while (next.getDay() === 0 || next.getDay() === 6) {
    next = calculator.addDays(next, 1);
  }
  return next;
}
```

### Check if Date is Weekend

```javascript
const { calculator } = picker.getPlugin('date-utils');

function isWeekend(date) {
  const day = date.getDay();
  return day === 0 || day === 6;
}
```

## 🔌 Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { DateUtilsPlugin } from '@bw-ui/datepicker-date-utils';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(DateUtilsPlugin);
```

## 📁 What's Included

```
dist/
├── bw-date-utils.min.js      # IIFE build (for <script>)
└── bw-date-utils.esm.min.js  # ESM build (for import)
```

## 🔗 Related Packages

| Package                                                                                          | Description      |
| ------------------------------------------------------------------------------------------------ | ---------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required)  |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode        |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav     |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto-positioning |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch support    |
| [@bw-ui/datepicker-input-handler](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) | Input masking    |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
