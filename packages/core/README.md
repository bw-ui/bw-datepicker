# @bw-ui/datepicker

Lightweight, zero-dependency datepicker with plugin architecture.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker)

## ✨ Features

- 🪶 **~27.3KB gzipped** - Tiny footprint
- 🚀 **Zero dependencies** - No bloat
- 🔌 **Plugin system** - Extend as needed
- 📅 **3 modes** - Popup, modal, inline
- 🎯 **Event-driven** - Full control

## 📦 Install

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
const picker = new BWDatePicker('#date', {
  mode: 'popup', // 'popup' | 'modal' | 'inline'
  format: 'DD/MM/YYYY', // Display format
  minDate: new Date(), // Min selectable date
  maxDate: null, // Max selectable date
  disabledDates: [], // Array of disabled dates
  firstDayOfWeek: 0, // 0 = Sunday, 1 = Monday
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
```

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
picker.today(); // Select today
picker.refresh(); // Re-render
```

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

| Plugin                                                                                           | Description              |
| ------------------------------------------------------------------------------------------------ | ------------------------ |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode, CSS variables |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav, ARIA       |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto-flip, collision     |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch, swipe             |
| [@bw-ui/datepicker-input-handler](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) | Input masking            |
| [@bw-ui/datepicker-date-utils](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)       | Date parsing             |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)
