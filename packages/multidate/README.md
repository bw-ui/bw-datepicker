# @bw-ui/datepicker-multidate

Multi-date selection plugin for [@bw-ui/datepicker](https://github.com/bw-ui/bw-datepicker).

Select multiple individual dates with toggle behavior, count limits, and flexible configuration.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-multidate)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-multidate)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-multidate)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [npm](https://www.npmjs.com/package/@bw-ui/datepicker)

## Features

- ✅ Toggle date selection (click to add/remove)
- ✅ Maximum/minimum date limits
- ✅ Sorted date output
- ✅ Count badge display (header or footer)
- ✅ Clear all button
- ✅ Input synchronization
- ✅ Auto-close on max dates
- ✅ Configurable error timeout
- ✅ Dark theme support
- ✅ Works with Dual Calendar plugin
- ✅ Full keyboard accessibility
- ✅ TypeScript support

---

## Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-multidate
```

---

## Quick Start

### ES Modules

```javascript
import { DatePickerCore } from '@bw-ui/datepicker';
import { MultiDatePlugin } from '@bw-ui/datepicker-multidate';

// Import styles
import '@bw-ui/datepicker/css';
import '@bw-ui/datepicker-multidate/css';

// Create picker and add plugin
const picker = new DatePickerCore('#date-input');
picker.use(MultiDatePlugin, {
  maxDates: 5,
});

// Access plugin API
const multidate = picker.getPlugin('multidate');
console.log(multidate.getDates());
```

### Script Tags (CDN)

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker-multidate/dist/bw-multidate.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-multidate"></script>

<script>
  // Create picker and add plugin
  const picker = new BWDatePicker('#date-input');
  picker.use(BWMultiDate.MultiDatePlugin, {
    maxDates: 5,
  });

  // Access plugin API
  const multidate = picker.getPlugin('multidate');
  console.log(multidate.getDates());
</script>
```

---

## Accessing the Plugin API

**Important:** The `.use()` method returns the picker instance (for chaining), NOT the plugin instance. Use `.getPlugin('multidate')` to access the plugin API.

```javascript
// ❌ WRONG - This doesn't work
const multidate = picker.use(MultiDatePlugin, options);
multidate.getDates(); // ERROR: multidate is the picker, not the plugin!

// ✅ CORRECT - Use getPlugin()
picker.use(MultiDatePlugin, options);
const multidate = picker.getPlugin('multidate');
multidate.getDates(); // Works!
```

### Method 1: Separate Statements

```javascript
const picker = new DatePickerCore('#date-input');
picker.use(MultiDatePlugin, { maxDates: 5 });

// Later, access the plugin
const multidate = picker.getPlugin('multidate');
const dates = multidate.getDates();
```

### Method 2: Chaining (still need getPlugin)

```javascript
const picker = new DatePickerCore('#date-input').use(MultiDatePlugin, {
  maxDates: 5,
});

// .use() returns picker, so this works
const multidate = picker.getPlugin('multidate');
```

### Method 3: Use Callbacks (No getPlugin needed)

```javascript
new DatePickerCore('#date-input').use(MultiDatePlugin, {
  maxDates: 5,
  onChange: (allDates) => {
    // Access dates directly in callback
    console.log('Selected dates:', allDates);
  },
  onSelect: (date, allDates) => {
    console.log('Just selected:', date);
    console.log('All dates:', allDates);
  },
});
```

---

## Options

All options are optional. Here are the defaults:

```javascript
picker.use(MultiDatePlugin, {
  // Selection Limits
  maxDates: null, // Maximum dates allowed (null = unlimited)
  minDates: null, // Minimum dates for validation (null = no minimum)

  // Display Format
  format: 'YYYY-MM-DD', // Date format in input field
  separator: ', ', // Separator between dates in input
  maxDisplayDates: 3, // After this, show "X dates selected" instead

  // Behavior
  closeOnSelect: false, // Close picker after EVERY selection
  closeOnMaxDates: true, // Close picker when maxDates is reached
  sortDates: true, // Keep dates sorted chronologically

  // UI Elements
  showCountBadge: true, // Show "X selected" badge
  badgePosition: 'footer', // Badge position: 'footer' | 'header'
  showClearButton: true, // Show "Clear All" button
  clearButtonText: 'Clear All', // Text for clear button
  errorTimeout: 3000, // Error auto-hide timeout in ms (0 = never hide)

  // Callbacks
  onSelect: null, // Called when a date is selected
  onDeselect: null, // Called when a date is deselected
  onChange: null, // Called on any selection change
});
```

### Options Reference Table

| Option            | Type                   | Default        | Description                                                               |
| ----------------- | ---------------------- | -------------- | ------------------------------------------------------------------------- |
| `maxDates`        | `number \| null`       | `null`         | Maximum selectable dates. `null` = unlimited                              |
| `minDates`        | `number \| null`       | `null`         | Minimum dates required for `.validate()`. `null` = no minimum             |
| `format`          | `string`               | `'YYYY-MM-DD'` | Date format for input display. Supports: `YYYY`, `MM`, `DD`, `M`, `D`     |
| `separator`       | `string`               | `', '`         | Separator between dates in input field                                    |
| `maxDisplayDates` | `number`               | `3`            | When more dates selected, shows "X dates selected" instead of listing all |
| `closeOnSelect`   | `boolean`              | `false`        | If `true`, closes picker after every date selection                       |
| `closeOnMaxDates` | `boolean`              | `true`         | If `true`, auto-closes picker when `maxDates` is reached                  |
| `sortDates`       | `boolean`              | `true`         | If `true`, keeps dates sorted chronologically                             |
| `showCountBadge`  | `boolean`              | `true`         | Shows "X selected" badge                                                  |
| `badgePosition`   | `'footer' \| 'header'` | `'footer'`     | Where to show the count badge                                             |
| `showClearButton` | `boolean`              | `true`         | Shows the "Clear All" button                                              |
| `clearButtonText` | `string`               | `'Clear All'`  | Text displayed on clear button                                            |
| `errorTimeout`    | `number`               | `3000`         | How long error messages display (ms). `0` = never auto-hide               |
| `onSelect`        | `function`             | `null`         | Callback: `(date: Date, allDates: Date[]) => void`                        |
| `onDeselect`      | `function`             | `null`         | Callback: `(date: Date, allDates: Date[]) => void`                        |
| `onChange`        | `function`             | `null`         | Callback: `(allDates: Date[]) => void`                                    |

---

## Callbacks

Callbacks let you react to selection changes without needing to call `getPlugin()`.

### onSelect

Called when a date is **added** to selection.

```javascript
picker.use(MultiDatePlugin, {
  onSelect: (date, allDates) => {
    console.log('Selected date:', date); // The date just selected
    console.log('All selected dates:', allDates); // Array of all selected dates
    console.log('Total count:', allDates.length);
  },
});
```

### onDeselect

Called when a date is **removed** from selection (clicked again to toggle off).

```javascript
picker.use(MultiDatePlugin, {
  onDeselect: (date, allDates) => {
    console.log('Deselected date:', date); // The date just removed
    console.log('Remaining dates:', allDates); // Array of remaining dates
  },
});
```

### onChange

Called on **any** selection change (select, deselect, clear, setDates).

```javascript
picker.use(MultiDatePlugin, {
  onChange: (allDates) => {
    console.log('All dates:', allDates);

    // Update UI
    document.getElementById('count').textContent = allDates.length;

    // Enable/disable submit button
    submitBtn.disabled = allDates.length === 0;
  },
});
```

### Using All Callbacks Together

```javascript
picker.use(MultiDatePlugin, {
  maxDates: 5,
  minDates: 2,

  onSelect: (date, allDates) => {
    console.log(`✅ Added: ${date.toDateString()}`);
    console.log(`   Total: ${allDates.length}/5`);
  },

  onDeselect: (date, allDates) => {
    console.log(`❌ Removed: ${date.toDateString()}`);
    console.log(`   Remaining: ${allDates.length}`);
  },

  onChange: (allDates) => {
    // Update your UI here
    updateSelectedDatesDisplay(allDates);

    // Validate for form submission
    const isValid = allDates.length >= 2;
    submitButton.disabled = !isValid;
  },
});
```

---

## Plugin API Methods

Access via `picker.getPlugin('multidate')`:

```javascript
const multidate = picker.getPlugin('multidate');
```

### getDates()

Get all selected dates as an array.

```javascript
const dates = multidate.getDates();
// Returns: [Date, Date, Date, ...]
// Returns empty array [] if nothing selected
```

### getCount()

Get the number of selected dates.

```javascript
const count = multidate.getCount();
// Returns: 3
```

### isSelected(date)

Check if a specific date is selected.

```javascript
const selected = multidate.isSelected(new Date(2025, 0, 15));
// Returns: true or false
```

### addDate(date)

Add a date to selection (if not already selected).

```javascript
const success = multidate.addDate(new Date(2025, 0, 20));
// Returns: true if added, false if already selected or maxDates reached
```

### removeDate(date)

Remove a date from selection.

```javascript
const success = multidate.removeDate(new Date(2025, 0, 15));
// Returns: true if removed, false if wasn't selected
```

### toggleDate(date)

Toggle a date (add if not selected, remove if selected).

```javascript
const result = multidate.toggleDate(new Date(2025, 0, 25));
// Returns: { added: Date | null, removed: Date | null }

if (result.added) {
  console.log('Date was added');
}
if (result.removed) {
  console.log('Date was removed');
}
```

### setDates(dates)

Set dates directly (replaces all current selections).

```javascript
const success = multidate.setDates([
  new Date(2025, 0, 10),
  new Date(2025, 0, 15),
  new Date(2025, 0, 20),
]);
// Returns: true if set, false if exceeds maxDates
```

### clear()

Clear all selections.

```javascript
multidate.clear();
```

### getFirst()

Get the first (earliest) selected date.

```javascript
const first = multidate.getFirst();
// Returns: Date or null if nothing selected
```

### getLast()

Get the last (latest) selected date.

```javascript
const last = multidate.getLast();
// Returns: Date or null if nothing selected
```

### validate()

Validate selection against `minDates` requirement.

```javascript
const { valid, error } = multidate.validate();

if (!valid) {
  console.log(error); // "Minimum 2 dates required"
}
```

### destroy()

Clean up the plugin (called automatically when picker is destroyed).

```javascript
multidate.destroy();
```

---

## Events

Listen for events via the DatePicker's event bus:

```javascript
picker.on('multidate:select', (e) => {
  console.log('Selected:', e.date);
  console.log('All dates:', e.dates);
  console.log('Count:', e.count);
});

picker.on('multidate:deselect', (e) => {
  console.log('Deselected:', e.date);
  console.log('Remaining:', e.dates);
  console.log('Count:', e.count);
});

picker.on('multidate:change', (e) => {
  console.log('Dates:', e.dates);
  console.log('Count:', e.count);
  console.log('Added:', e.added); // Date or null
  console.log('Removed:', e.removed); // Date or null
});

picker.on('multidate:clear', () => {
  console.log('All dates cleared');
});

picker.on('multidate:error', (e) => {
  console.log('Error:', e.error);
});
```

### Events vs Callbacks

Both work similarly. Use whichever fits your code style:

```javascript
// Callback approach (in options)
picker.use(MultiDatePlugin, {
  onChange: (dates) => console.log(dates),
});

// Event approach (after setup)
picker.on('multidate:change', (e) => console.log(e.dates));
```

---

## Examples

### Basic Multi-Date Selection

```javascript
const picker = new DatePickerCore('#dates');
picker.use(MultiDatePlugin);

// Get selected dates
const multidate = picker.getPlugin('multidate');
console.log(multidate.getDates());
```

### Limited Selection (Max 5 Dates)

```javascript
const picker = new DatePickerCore('#dates');
picker.use(MultiDatePlugin, {
  maxDates: 5,
  closeOnMaxDates: true, // Auto-close when 5 dates selected
  onChange: (allDates) => {
    console.log(`Selected ${allDates.length}/5 dates`);
  },
});
```

### Badge in Header

```javascript
picker.use(MultiDatePlugin, {
  showCountBadge: true,
  badgePosition: 'header', // Small badge in top-right of header
});
```

### Form Validation with minDates

```javascript
const picker = new DatePickerCore('#dates');
picker.use(MultiDatePlugin, {
  minDates: 3, // User must select at least 3 dates
});

// On form submit
document.querySelector('form').addEventListener('submit', (e) => {
  const multidate = picker.getPlugin('multidate');
  const { valid, error } = multidate.validate();

  if (!valid) {
    e.preventDefault();
    alert(error); // "Minimum 3 dates required"
    return;
  }

  // Form is valid, proceed with submission
  const selectedDates = multidate.getDates();
  console.log('Submitting dates:', selectedDates);
});
```

### Custom Display Format

```javascript
picker.use(MultiDatePlugin, {
  format: 'DD/MM/YYYY', // European format
  separator: ' | ', // Pipe separator
  maxDisplayDates: 5, // Show up to 5 dates before switching to count
});

// Input will show: "15/01/2025 | 20/01/2025 | 25/01/2025"
// Or if more than 5: "6 dates selected"
```

### Custom Error Timeout

```javascript
picker.use(MultiDatePlugin, {
  maxDates: 5,
  errorTimeout: 5000, // Error shows for 5 seconds
  // errorTimeout: 0,    // Error never auto-hides
});
```

### Pre-selected Dates

```javascript
const picker = new DatePickerCore('#dates');
picker.use(MultiDatePlugin);

// Set initial dates after plugin is registered
const multidate = picker.getPlugin('multidate');
multidate.setDates([
  new Date(2025, 0, 10),
  new Date(2025, 0, 15),
  new Date(2025, 0, 20),
]);
```

### With Dual Calendar Plugin

```javascript
import { DualCalendarPlugin } from '@bw-ui/datepicker-dual';
import { MultiDatePlugin } from '@bw-ui/datepicker-multidate';

const picker = new DatePickerCore('#dates');
picker.use(DualCalendarPlugin); // Add dual calendar first
picker.use(MultiDatePlugin, {
  maxDates: 10,
});
```

### Full Configuration Example

```javascript
const picker = new DatePickerCore('#dates', {
  mode: 'popup',
});

picker.use(MultiDatePlugin, {
  // Limits
  maxDates: 5,
  minDates: 2,

  // Display
  format: 'MM.DD.YYYY',
  separator: ' | ',
  maxDisplayDates: 2,

  // Behavior
  closeOnSelect: false,
  closeOnMaxDates: true,
  sortDates: true,

  // UI
  showCountBadge: true,
  badgePosition: 'footer',
  showClearButton: true,
  clearButtonText: 'Remove All',
  errorTimeout: 3000,

  // Callbacks
  onSelect: (date, allDates) => {
    console.log('Selected:', date.toDateString());
    console.log('Total:', allDates.length);
  },
  onDeselect: (date, allDates) => {
    console.log('Deselected:', date.toDateString());
    console.log('Remaining:', allDates.length);
  },
  onChange: (allDates) => {
    // Update UI
    document.getElementById('selected-count').textContent = allDates.length;

    // Validate
    const multidate = picker.getPlugin('multidate');
    const { valid } = multidate.validate();
    document.getElementById('submit-btn').disabled = !valid;
  },
});

// Access API later
const multidate = picker.getPlugin('multidate');
console.log('Currently selected:', multidate.getDates());
console.log('Count:', multidate.getCount());
console.log('Is valid:', multidate.validate().valid);
```

---

## Styling

### CSS Classes

| Class                         | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `.bw-datepicker--multidate`   | Added to picker container when plugin is active |
| `.bw-multidate-selected`      | Applied to selected day cells                   |
| `.bw-multidate-badge`         | The count badge element                         |
| `.bw-multidate-badge--header` | Badge when positioned in header                 |
| `.bw-multidate-footer`        | Footer container                                |
| `.bw-multidate-clear`         | Clear button                                    |
| `.bw-multidate-error`         | Error message                                   |

### Custom Colors

```css
/* Custom selected date color */
.bw-multidate-selected {
  background-color: #10b981 !important; /* Emerald green */
}

/* Custom footer badge */
.bw-multidate-badge {
  background: #eff6ff;
  color: #3b82f6;
  border-color: #bfdbfe;
}

/* Custom header badge */
.bw-multidate-badge--header {
  background: #10b981;
  color: #fff;
}

/* Custom clear button */
.bw-multidate-clear {
  background: #f3f4f6;
  color: #374151;
}

.bw-multidate-clear:hover {
  background: #fee2e2;
  color: #dc2626;
}
```

### Dark Theme

Dark theme styles are automatically applied when the picker has `.bw-datepicker--dark` class.

```javascript
const picker = new DatePickerCore('#dates', {
  theme: 'dark', // If your core supports this
});
```

Or add the class manually:

```javascript
picker.getPickerElement().classList.add('bw-datepicker--dark');
```

---

## TypeScript

Full TypeScript support included:

```typescript
import { DatePickerCore } from '@bw-ui/datepicker';
import {
  MultiDatePlugin,
  MultiDateInstance,
  MultiDateOptions,
} from '@bw-ui/datepicker-multidate';

// Typed options
const options: MultiDateOptions = {
  maxDates: 5,
  minDates: 2,
  badgePosition: 'header',
  onChange: (dates: Date[]) => {
    console.log(dates);
  },
};

// Create picker
const picker = new DatePickerCore('#date');
picker.use(MultiDatePlugin, options);

// Typed plugin instance
const multidate = picker.getPlugin('multidate') as MultiDateInstance;

// All methods are typed
const dates: Date[] = multidate.getDates();
const count: number = multidate.getCount();
const isSelected: boolean = multidate.isSelected(new Date());
const { valid, error }: { valid: boolean; error: string | null } =
  multidate.validate();
```

---

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

---

## License

MIT © BW UI
