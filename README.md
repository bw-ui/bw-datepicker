# BW DatePicker

A lightweight, zero-dependency datepicker with a modular plugin architecture.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [npm](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 🪶 **Lightweight** - Core is only ~27KB gzipped
- 🔌 **Modular** - Use only what you need with plugins
- 🎨 **Themeable** - Dark mode, CSS variables, custom themes
- ♿ **Accessible** - Full keyboard navigation, ARIA support
- 📱 **Mobile Ready** - Touch & swipe gestures
- 🚀 **Zero Dependencies** - No external libraries required
- 📦 **Multiple Formats** - ESM and IIFE builds
- 🧩 **Extensible** - Create your own plugins

## 📦 Packages

| Package                           | Description              | Size    | Links                                                                |
| --------------------------------- | ------------------------ | ------- | -------------------------------------------------------------------- |
| `@bw-ui/datepicker`               | Core datepicker          | ~27.3KB | [npm](https://www.npmjs.com/package/@bw-ui/datepicker)               |
| `@bw-ui/datepicker-theming`       | Dark mode, CSS variables | ~11.5KB | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-theming)       |
| `@bw-ui/datepicker-accessibility` | Keyboard nav, ARIA       | ~18.8KB | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) |
| `@bw-ui/datepicker-positioning`   | Auto-flip, collision     | ~11.2KB | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)   |
| `@bw-ui/datepicker-mobile`        | Touch, swipe gestures    | ~7.49KB | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)        |
| `@bw-ui/datepicker-input-handler` | Input masking            | ~12.2KB | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) |
| `@bw-ui/datepicker-date-utils`    | Date parsing             | ~19KB   | [npm](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)    |

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

picker.on('date:changed', ({ date, dateISO }) => {
  console.log('Selected:', dateISO);
});
```

### Browser (CDN)

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

## ⚙️ Core Options

```javascript
const picker = new BWDatePicker('#date', {
  mode: 'popup', // 'popup' | 'modal' | 'inline'
  format: 'DD/MM/YYYY', // Display format
  minDate: new Date(), // Minimum selectable date
  maxDate: new Date('2025-12-31'), // Maximum selectable date
  disabledDates: [], // Array of disabled dates
});
```

## 🛠️ API Methods

```javascript
// Open/Close
picker.open();
picker.close();

// Date methods
picker.setDate(date);
picker.getDate();
picker.clear();
picker.today();

// Navigation
picker.prevMonth();
picker.nextMonth();
picker.prevYear();
picker.nextYear();

// Lifecycle
picker.refresh();
picker.destroy();
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

## 🔌 Official Plugins

### Theming

```javascript
import { ThemingPlugin } from '@bw-ui/datepicker-theming';

.use(ThemingPlugin, {
  theme: 'dark',        // 'light' | 'dark' | 'auto'
  persist: true,        // Save to localStorage
})
```

[Full Documentation →](https://www.npmjs.com/package/@bw-ui/datepicker-theming)

### Accessibility

```javascript
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

.use(AccessibilityPlugin)
// Arrow keys, Tab, Enter, Escape, PageUp/Down
```

[Full Documentation →](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility)

### Positioning

```javascript
import { PositioningPlugin } from '@bw-ui/datepicker-positioning';

.use(PositioningPlugin, {
  placement: 'bottom',
  autoFlip: true,
})
```

[Full Documentation →](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)

### Mobile

```javascript
import { MobilePlugin } from '@bw-ui/datepicker-mobile';

.use(MobilePlugin)
// Swipe left/right for month navigation
```

[Full Documentation →](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)

### Input Handler

```javascript
import { InputHandlerPlugin } from '@bw-ui/datepicker-input-handler';

.use(InputHandlerPlugin, {
  format: 'DD/MM/YYYY',
  allowManualInput: true,
})
```

[Full Documentation →](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler)

### Date Utils

```javascript
import { DateUtilsPlugin } from '@bw-ui/datepicker-date-utils';

.use(DateUtilsPlugin)
picker.parseDate('25 Dec 2025');
```

[Full Documentation →](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)

---

## 🧩 Creating Your Own Plugin

BW DatePicker has an open plugin architecture. You can create custom plugins to extend functionality.

### Plugin Interface

A plugin is an object with three properties:

```javascript
const MyPlugin = {
  name: 'my-plugin', // Unique plugin name

  init(api, options) {
    // Called when plugin is registered
    // api - provides access to datepicker internals
    // options - user-provided options

    // Return instance for cleanup (optional)
    return {
      /* your plugin instance */
    };
  },

  destroy(instance) {
    // Called when datepicker is destroyed
    // Cleanup your plugin
  },
};
```

### API Object

The `api` object passed to `init()` provides:

```javascript
{
  datepicker,           // The datepicker instance
  getEventBus(),        // Event emitter for listening/emitting events
  getStateManager(),    // State management
  getPickerElement(),   // The picker DOM element
  getInputElement(),    // The input DOM element
  getOptions(),         // User options
}
```

### Simple Plugin Example

```javascript
// HighlightTodayPlugin.js
export const HighlightTodayPlugin = {
  name: 'highlight-today',

  init(api, options = {}) {
    const eventBus = api.getEventBus();
    const color = options.color || '#ff0000';

    // Listen for picker open
    eventBus.on('picker:opened', () => {
      const today = api
        .getPickerElement()
        .querySelector('.bw-datepicker__day--today');

      if (today) {
        today.style.backgroundColor = color;
      }
    });

    return { color };
  },

  destroy(instance) {
    // Cleanup if needed
  },
};

// Usage
picker.use(HighlightTodayPlugin, { color: '#00ff00' });
```

### Advanced Plugin Example

```javascript
// DateRangePlugin.js
export const DateRangePlugin = {
  name: 'date-range',

  init(api, options = {}) {
    const eventBus = api.getEventBus();
    let startDate = null;
    let endDate = null;

    // Listen for date selection
    eventBus.on('date:selected', ({ date }) => {
      if (!startDate || (startDate && endDate)) {
        // Start new range
        startDate = date;
        endDate = null;
      } else {
        // Complete range
        endDate = date;

        // Emit custom event
        eventBus.emit('range:selected', {
          start: startDate,
          end: endDate,
        });
      }
    });

    // Add methods to datepicker
    api.datepicker.getRange = () => ({ start: startDate, end: endDate });
    api.datepicker.clearRange = () => {
      startDate = null;
      endDate = null;
    };

    return { getRange: () => ({ start: startDate, end: endDate }) };
  },

  destroy(instance) {
    // Cleanup
  },
};

// Usage
picker.use(DateRangePlugin);
picker.on('range:selected', ({ start, end }) => {
  console.log('Range:', start, 'to', end);
});
```

### Plugin with CSS

```javascript
// CustomStylePlugin.js
export const CustomStylePlugin = {
  name: 'custom-style',

  init(api, options = {}) {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
      .bw-datepicker__day--selected {
        background: ${options.selectedColor || '#007bff'} !important;
        border-radius: ${options.borderRadius || '50%'} !important;
      }
    `;
    document.head.appendChild(style);

    return { styleElement: style };
  },

  destroy(instance) {
    instance.styleElement?.remove();
  },
};
```

### Available Events to Listen

```javascript
// Lifecycle
'picker:opened';
'picker:closed';

// Date
'date:changed'; // { date, dateISO, oldDate }
'date:selected'; // { date, dateISO }
'date:cleared';

// Navigation
'nav:monthChanged'; // { month, year }
'nav:yearChanged'; // { year }

// Render (for modifying HTML)
'render:header'; // { html }
'render:calendar'; // { html }
'render:footer'; // { html }
```

### Publishing Your Plugin

1. Create npm package:

```json
{
  "name": "@yourname/bw-datepicker-myplugin",
  "version": "1.0.0",
  "peerDependencies": {
    "@bw-ui/datepicker": "^1.0.0"
  }
}
```

2. Export your plugin:

```javascript
export const MyPlugin = {
  /* ... */
};
export default MyPlugin;
```

3. Publish:

```bash
npm publish --access public
```

---

## 🏗️ Development

```bash
# Clone
git clone https://github.com/bw-ui/bw-datepicker.git
cd bw-datepicker

# Install
npm install

# Build all
npm run build

# Build specific
npm run build:core
npm run build:theming
```

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🤝 Contributing

Contributions welcome! Feel free to submit issues and PRs.

- 🐛 [Report Bug](https://github.com/bw-ui/bw-datepicker/issues)
- 💡 [Request Feature](https://github.com/bw-ui/bw-datepicker/issues)
- 📖 [Documentation](https://github.com/bw-ui/bw-datepicker)
