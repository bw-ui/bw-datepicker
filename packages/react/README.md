# @bw-ui/datepicker-react

React bindings for the BW DatePicker library.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-react)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-react)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-react)

[Core Documentation](https://www.npmjs.com/package/@bw-ui/datepicker) • [npm](https://www.npmjs.com/package/@bw-ui/datepicker-react)

## ✨ Features

- 🪶 **Lightweight** - Only ~5KB gzipped
- ⚛️ **React 17+** - Supports React 17, 18, and 19
- 🔌 **Full Plugin Support** - Use all BW DatePicker plugins
- 🎣 **Hooks API** - `useBWDatePicker` for headless usage
- 📘 **TypeScript** - Full type definitions included
- 🔄 **SSR Ready** - Works with Next.js out of the box

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-react
```

## 🚀 Quick Start

### Component

```jsx
import { useState } from 'react';
import { BWDatePicker } from '@bw-ui/datepicker-react';
import '@bw-ui/datepicker/css';

function App() {
  const [date, setDate] = useState(null);

  return (
    <BWDatePicker value={date} onChange={setDate} placeholder="Select a date" />
  );
}
```

### Hook

```jsx
import { useBWDatePicker } from '@bw-ui/datepicker-react';
import '@bw-ui/datepicker/css';

function App() {
  const { ref, date, open, close } = useBWDatePicker({
    onChange: (date) => console.log('Selected:', date),
  });

  return (
    <div>
      <input ref={ref} placeholder="Select date" />
      <button onClick={open}>Open</button>
    </div>
  );
}
```

## 🔌 Using Plugins

All BW DatePicker plugins work with the React wrapper:

```bash
npm install @bw-ui/datepicker-theming @bw-ui/datepicker-locale
```

```jsx
import { BWDatePicker } from '@bw-ui/datepicker-react';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { LocalePlugin } from '@bw-ui/datepicker-locale';
import '@bw-ui/datepicker/css';
import '@bw-ui/datepicker-theming/css';

function App() {
  const [date, setDate] = useState(null);

  return (
    <BWDatePicker
      value={date}
      onChange={setDate}
      plugins={[ThemingPlugin, LocalePlugin]}
      pluginOptions={{
        theming: { theme: 'dark' },
        locale: { locale: 'hi-IN' },
      }}
    />
  );
}
```

### Available Plugins

| Plugin                | Key             | Options                                  |
| --------------------- | --------------- | ---------------------------------------- |
| `ThemingPlugin`       | `theming`       | `{ theme: 'dark' \| 'light' \| 'auto' }` |
| `LocalePlugin`        | `locale`        | `{ locale: 'hi-IN' }`                    |
| `AccessibilityPlugin` | `accessibility` | `{ announceChanges: true }`              |
| `MobilePlugin`        | `mobile`        | `{ enableSwipe: true }`                  |
| `PositioningPlugin`   | `positioning`   | `{ placement: 'bottom' }`                |
| `InputHandlerPlugin`  | `input-handler` | `{ format: 'DD/MM/YYYY' }`               |
| `DateUtilsPlugin`     | `date-utils`    | `{}`                                     |

## ⚙️ Props

### Value & Events

```jsx
<BWDatePicker
  value={date} // Controlled value
  defaultValue={new Date()} // Uncontrolled initial value
  onChange={(date) => {}} // Date changed
  onOpen={() => {}} // Picker opened
  onClose={() => {}} // Picker closed
  onMonthChange={({ month }) => {}} // Month changed
  onYearChange={({ year }) => {}} // Year changed
/>
```

### Core Options

```jsx
<BWDatePicker
  mode="popup" // 'popup' | 'modal' | 'inline'
  format="YYYY-MM-DD" // Date format
  placeholder="Select date" // Input placeholder
  disabled={false} // Disable picker
  readOnly={false} // Read-only input
/>
```

### Date Constraints

```jsx
<BWDatePicker
  minDate={new Date()} // Minimum date
  maxDate={new Date('2025-12-31')} // Maximum date
  disabledDates={[date1, date2]} // Disabled dates array
/>
```

### Display Options

```jsx
<BWDatePicker
  firstDayOfWeek={1} // 0=Sunday, 1=Monday
  showWeekNumbers={false} // Show week numbers
  showOtherMonths={true} // Show adjacent months
  numberOfMonths={1} // Multi-month display
/>
```

### Styling

```jsx
<BWDatePicker
  className="my-container" // Container class
  inputClassName="my-input" // Input class
  style={{ width: 300 }} // Container styles
  inputStyle={{ padding: 10 }} // Input styles
/>
```

## 🛠️ Ref Methods

```jsx
import { useRef } from 'react';

function App() {
  const pickerRef = useRef(null);

  return (
    <>
      <BWDatePicker ref={pickerRef} />
      <button onClick={() => pickerRef.current?.open()}>Open</button>
      <button onClick={() => pickerRef.current?.close()}>Close</button>
      <button onClick={() => pickerRef.current?.clear()}>Clear</button>
      <button onClick={() => pickerRef.current?.today()}>Today</button>
      <button onClick={() => pickerRef.current?.setDate(new Date())}>
        Set
      </button>
    </>
  );
}
```

### All Methods

| Method            | Description         |
| ----------------- | ------------------- |
| `open()`          | Open picker         |
| `close()`         | Close picker        |
| `toggle()`        | Toggle open/close   |
| `clear()`         | Clear selection     |
| `setDate(date)`   | Set date            |
| `getDate()`       | Get current date    |
| `prevMonth()`     | Previous month      |
| `nextMonth()`     | Next month          |
| `prevYear()`      | Previous year       |
| `nextYear()`      | Next year           |
| `today()`         | Go to today         |
| `getPlugin(name)` | Get plugin instance |
| `getInstance()`   | Get core instance   |

## 🎣 Hook API

```jsx
const {
  ref, // Attach to input
  date, // Current date (reactive)
  isOpen, // Open state (reactive)
  open, // Open picker
  close, // Close picker
  toggle, // Toggle picker
  setDate, // Set date
  clear, // Clear date
  prevMonth, // Previous month
  nextMonth, // Next month
  today, // Go to today
  getPlugin, // Get plugin
  getInstance, // Get core instance
} = useBWDatePicker({
  mode: 'popup',
  format: 'YYYY-MM-DD',
  defaultDate: new Date(),
  plugins: [ThemingPlugin],
  pluginOptions: { theming: { theme: 'dark' } },
  onChange: (date) => {},
  onOpen: () => {},
  onClose: () => {},
});
```

## 📘 TypeScript

```tsx
import {
  BWDatePicker,
  BWDatePickerRef,
  DateSelectEvent,
} from '@bw-ui/datepicker-react';

const pickerRef = useRef<BWDatePickerRef>(null);

const handleChange = (date: Date | null, event: DateSelectEvent) => {
  console.log(date, event.source);
};

<BWDatePicker ref={pickerRef} onChange={handleChange} />;
```

## 🔄 SSR / Next.js

Works automatically. The core is dynamically imported on client side.

```jsx
// No special configuration needed
import { BWDatePicker } from '@bw-ui/datepicker-react';
```

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)
