# @bw-ui/datepicker-data

Data plugin for BW DatePicker - API integration for prices, availability, and events.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-data)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-data)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-data)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-data) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 💰 **Price Display** - Show prices in day cells
- 🏨 **Availability Status** - Available, limited, sold-out states
- 🔄 **API Integration** - Fetch data from any endpoint
- 📦 **Static Data** - Use pre-defined data objects
- ⏳ **Multiple Loader Types** - Overlay, calendar, skeleton, or spinner
- 🗄️ **Caching** - Cache fetched months to avoid re-fetching
- 🔁 **Auto Retry** - Retry failed requests automatically
- 📐 **Expanded Mode** - Larger cells for better readability
- 📅 **View Mode Support** - Works with calendar and week views
- 📆 **DualCalendar Support** - Automatically fetches data for all visible months

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-data
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { DataPlugin } from '@bw-ui/datepicker-data';
import '@bw-ui/datepicker/css';
import '@bw-ui/datepicker-data/css';

const picker = new BWDatePicker('#date-input').use(DataPlugin, {
  data: {
    '2025-12-01': { price: 99, status: 'available' },
    '2025-12-02': { price: 150, status: 'limited' },
    '2025-12-03': { price: 200, status: 'sold-out' },
  },
  renderDay: (dateKey, data) => {
    if (!data) return '';
    return `<span class="price">₹${data.price}</span>`;
  },
  dayClass: (dateKey, data) => data?.status || '',
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
  href="https://unpkg.com/@bw-ui/datepicker-data/dist/bw-data.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-data/dist/bw-data.min.js"></script>

<script>
  const picker = new BWDatePicker('#date-input').use(BWData.DataPlugin, {
    data: {
      '2025-12-01': { price: 99, status: 'available' },
    },
    renderDay: (dateKey, data) =>
      data ? `<span class="price">₹${data.price}</span>` : '',
    dayClass: (dateKey, data) => data?.status || '',
  });
</script>
```

## ⚙️ Options

```javascript
.use(DataPlugin, {
  // Data Sources
  data: {},                     // Static data object
  fetch: async () => {},        // Fetch function
  fetchPriority: 'replace',     // 'replace' | 'merge' | 'fallback'

  // Rendering
  renderDay: (dateKey, data) => '',   // Custom day content
  dayClass: (dateKey, data) => '',    // Custom day class

  // Display
  expanded: false,              // Larger day cells

  // Loading Options
  showLoading: true,            // Show loader while fetching
  loaderType: 'overlay',        // 'overlay' | 'calendar' | 'skeleton' | 'spinner'

  // Fetch Options
  cache: true,                  // Cache fetched months
  retries: 2,                   // Retry failed requests
  timeout: 10000,               // Request timeout (ms)
})
```

### Options Reference

| Option          | Type       | Default     | Description                            |
| --------------- | ---------- | ----------- | -------------------------------------- |
| `data`          | `object`   | `null`      | Static data object with date keys      |
| `fetch`         | `function` | `null`      | Async function to fetch data           |
| `fetchPriority` | `string`   | `'replace'` | How fetch interacts with static data   |
| `renderDay`     | `function` | `null`      | Custom render function for day content |
| `dayClass`      | `function` | `null`      | Custom class function for day cells    |
| `expanded`      | `boolean`  | `false`     | Enable larger day cells                |
| `showLoading`   | `boolean`  | `true`      | Show loading indicator                 |
| `loaderType`    | `string`   | `'overlay'` | Type of loading indicator              |
| `cache`         | `boolean`  | `true`      | Cache fetched months                   |
| `retries`       | `number`   | `2`         | Number of retry attempts               |
| `timeout`       | `number`   | `10000`     | Request timeout in ms                  |

## ⏳ Loader Types

| Type         | Description                                | Blocks Clicks |
| ------------ | ------------------------------------------ | ------------- |
| `'overlay'`  | Full picker overlay with spinner (default) | ✅ Yes        |
| `'calendar'` | Only calendar area has spinner             | ❌ No         |
| `'skeleton'` | Skeleton loaders on each day cell          | ❌ No         |
| `'spinner'`  | Small spinner in corner                    | ❌ No         |

### Overlay Loader (Default)

Blocks all interaction while loading - prevents accidental navigation.

```javascript
.use(DataPlugin, {
  fetch: fetchPrices,
  loaderType: 'overlay',
})
```

### Calendar Loader

Only calendar area shows loader - user can still use header navigation.

```javascript
.use(DataPlugin, {
  fetch: fetchPrices,
  loaderType: 'calendar',
})
```

### Skeleton Loader

Shows skeleton animation on each day cell.

```javascript
.use(DataPlugin, {
  fetch: fetchPrices,
  loaderType: 'skeleton',
})
```

### Spinner Loader

Non-intrusive small spinner in corner.

```javascript
.use(DataPlugin, {
  fetch: fetchPrices,
  loaderType: 'spinner',
})
```

### Disable Loading Indicator

```javascript
.use(DataPlugin, {
  fetch: fetchPrices,
  showLoading: false,
})
```

## 📊 Data Format

```javascript
{
  "2025-12-01": { price: 99, status: "available", rooms: 5 },
  "2025-12-02": { price: 150, status: "limited", rooms: 2 },
  "2025-12-03": { price: 200, status: "sold-out", rooms: 0 },
}
```

### Built-in Status Classes

| Status      | CSS Class    | Effect                   |
| ----------- | ------------ | ------------------------ |
| `available` | `.available` | Green background         |
| `limited`   | `.limited`   | Yellow background        |
| `sold-out`  | `.sold-out`  | Red background, disabled |

## 📖 Examples

### Static Data

```javascript
.use(DataPlugin, {
  data: {
    '2025-12-01': { price: 99, status: 'available' },
    '2025-12-02': { price: 150, status: 'limited' },
  },
  renderDay: (dateKey, data) => data ? `<span class="price">₹${data.price}</span>` : '',
  dayClass: (dateKey, data) => data?.status || '',
})
```

### API Fetch

```javascript
.use(DataPlugin, {
  fetch: async ({ month, year, signal }) => {
    const res = await fetch(`/api/prices?month=${month}&year=${year}`, { signal });
    return res.json();
  },
  renderDay: (dateKey, data) => data ? `<span class="price">₹${data.price}</span>` : '',
  dayClass: (dateKey, data) => data?.status || '',
})
```

### Fake Data for Testing

```javascript
.use(DataPlugin, {
  fetch: async ({ month, year }) => {
    await new Promise(r => setTimeout(r, 1000)); // 1 sec delay

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const data = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const rooms = Math.floor(Math.random() * 10);
      data[dateKey] = {
        price: Math.floor(Math.random() * 300) + 50,
        rooms: rooms,
        status: rooms === 0 ? 'sold-out' : rooms < 3 ? 'limited' : 'available'
      };
    }
    return data;
  },
  loaderType: 'skeleton',
  renderDay: (dateKey, data) => {
    if (!data) return '';
    return `<span class="price">₹${data.price}</span>`;
  },
  dayClass: (dateKey, data) => data?.status || '',
})
```

### Expanded Mode (Larger Cells)

```javascript
.use(DataPlugin, {
  expanded: true,
  data: { ... },
  renderDay: (dateKey, data) => {
    if (!data) return '';
    const statusColor = {
      'available': '#16a34a',
      'limited': '#ca8a04',
      'sold-out': '#dc2626'
    }[data.status] || '#666';

    return `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1px; margin-top: 2px;">
        <span style="font-size: 11px; font-weight: 700; color: ${statusColor};">₹${data.price}</span>
        <span style="font-size: 8px; color: #999;">${data.rooms} left</span>
      </div>
    `;
  },
  dayClass: (dateKey, data) => data?.status || '',
})
```

## 🔄 Fetch Priority

| Priority     | Behavior                                      |
| ------------ | --------------------------------------------- |
| `'replace'`  | Fetch overwrites static data (default)        |
| `'merge'`    | Fetch + static combined, fetch wins conflicts |
| `'fallback'` | Only fetch if no static data exists for month |

```javascript
// Static as placeholder, API updates
.use(DataPlugin, {
  data: { ... },              // Shows immediately
  fetch: async () => { ... }, // Replaces when loaded
  fetchPriority: 'replace',
})

// Merge static defaults with API data
.use(DataPlugin, {
  data: { ... },
  fetch: async () => { ... },
  fetchPriority: 'merge',
})

// Use static, only fetch if missing
.use(DataPlugin, {
  data: { ... },
  fetch: async () => { ... },
  fetchPriority: 'fallback',
})
```

## 🎨 Custom Rendering

### Price with Status Badge

```javascript
renderDay: (dateKey, data) => {
  if (!data) return '';

  const statusBg = {
    'available': '#dcfce7',
    'limited': '#fef9c3',
    'sold-out': '#fee2e2'
  }[data.status] || '#f3f4f6';

  const statusText = {
    'available': '#16a34a',
    'limited': '#ca8a04',
    'sold-out': '#dc2626'
  }[data.status] || '#666';

  return `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 3px; margin-top: 4px;">
      <span style="font-size: 11px; font-weight: 700; color: ${statusText};">₹${data.price}</span>
      <span style="font-size: 7px; background: ${statusBg}; color: ${statusText}; padding: 1px 4px; border-radius: 4px;">${data.rooms} left</span>
    </div>
  `;
},
```

## 🔌 API Methods

Access via `picker.getPlugin('data')`:

```javascript
const dataPlugin = picker.getPlugin('data');

// Get data for specific date
dataPlugin.get('2025-12-01');

// Set data for specific date
dataPlugin.set('2025-12-01', { price: 99, status: 'available' });

// Set data for entire month
dataPlugin.setMonth(11, 2025, { ... });

// Get data for date range
dataPlugin.getRange(new Date('2025-12-01'), new Date('2025-12-07'));

// Sum property across range (e.g., total price)
dataPlugin.sumRange(new Date('2025-12-01'), new Date('2025-12-07'), 'price');

// Refresh data (clear cache + re-fetch)
dataPlugin.refresh();

// Clear all data
dataPlugin.clear();

// Check if loading
dataPlugin.isLoading();
```

## 📡 Events

```javascript
const picker = new BWDatePicker('#date-input')
  .use(DataPlugin, { ... });

picker.on('data:loaded', ({ month, year, data }) => {
  console.log('Data loaded:', data);
});

picker.on('data:error', ({ month, year, error }) => {
  console.error('Fetch failed:', error);
});
```

## 📅 View Mode Support

The Data Plugin automatically handles different view modes:

| View Mode  | Data Display              |
| ---------- | ------------------------- |
| `calendar` | ✅ Shows data on days     |
| `week`     | ✅ Shows data on days     |
| `month`    | ❌ No data (month picker) |
| `year`     | ❌ No data (year picker)  |

Data is automatically fetched when:

- Picker opens
- Month/year navigation
- Week navigation (in week view)
- Switching back to calendar/week view

## 🔌 Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { DataPlugin } from '@bw-ui/datepicker-data';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(DataPlugin, {
    expanded: true,
    loaderType: 'overlay',
    data: { ... },
    renderDay: (dateKey, data) => { ... },
  });
```

## 📁 What's Included

```
dist/
├── bw-data.min.js       # IIFE build (for <script>)
├── bw-data.esm.min.js   # ESM build (for import)
└── bw-data.min.css      # Styles
```

## 🔗 Related Packages

| Package                                                                                          | Description          |
| ------------------------------------------------------------------------------------------------ | -------------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required)      |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode            |
| [@bw-ui/datepicker-range](https://www.npmjs.com/package/@bw-ui/datepicker-range)                 | Date range selection |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto positioning     |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav         |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch support        |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
