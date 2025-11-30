# @bw-ui/datepicker-vue

Vue 3 bindings for the BW DatePicker library.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-vue)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-vue)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-vue)

[Core Documentation](https://www.npmjs.com/package/@bw-ui/datepicker) • [npm](https://www.npmjs.com/package/@bw-ui/datepicker-vue)

## ✨ Features

- 🪶 **Lightweight** - Only ~5KB gzipped
- 💚 **Vue 3** - Composition API support
- 🔌 **Full Plugin Support** - Use all BW DatePicker plugins
- 🎣 **Composable API** - `useBWDatePicker` for headless usage
- 📘 **TypeScript** - Full type definitions included
- 🔄 **SSR Ready** - Works with Nuxt out of the box

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-vue
```

## 🚀 Quick Start

### Component

```vue
<script setup>
import { ref } from 'vue';
import { BWDatePicker } from '@bw-ui/datepicker-vue';
import '@bw-ui/datepicker/css';

const date = ref(null);
</script>

<template>
  <BWDatePicker v-model="date" placeholder="Select a date" />
</template>
```

### Composable

```vue
<script setup>
import { useBWDatePicker } from '@bw-ui/datepicker-vue';
import '@bw-ui/datepicker/css';

const { inputRef, date, open, close } = useBWDatePicker({
  onChange: (date) => console.log('Selected:', date),
});
</script>

<template>
  <div>
    <input ref="inputRef" placeholder="Select date" />
    <button @click="open">Open</button>
  </div>
</template>
```

## 🔌 Using Plugins

All BW DatePicker plugins work with the Vue wrapper:

```bash
npm install @bw-ui/datepicker-theming @bw-ui/datepicker-locale
```

{% raw %}
```vue
<script setup>
import { ref } from 'vue';
import { BWDatePicker } from '@bw-ui/datepicker-vue';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { LocalePlugin } from '@bw-ui/datepicker-locale';
import '@bw-ui/datepicker/css';
import '@bw-ui/datepicker-theming/css';

const date = ref(null);
const plugins = [ThemingPlugin, LocalePlugin];
const pluginOptions = {
  theming: { theme: 'dark' },
  locale: { locale: 'hi-IN' },
};
</script>

<template>
  <BWDatePicker
    v-model="date"
    :plugins="plugins"
    :plugin-options="pluginOptions"
  />
</template>
```
{% endraw %}

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

```vue
<BWDatePicker
  v-model="date"
  :default-value="new Date()"
  @change="(date, data) => {}"
  @open="() => {}"
  @close="() => {}"
  @month-change="({ month }) => {}"
  @year-change="({ year }) => {}"
/>
```

### Core Options

```vue
<BWDatePicker
  mode="popup"
  format="YYYY-MM-DD"
  placeholder="Select date"
  :disabled="false"
  :read-only="false"
/>
```

### Date Constraints

```vue
<BWDatePicker
  :min-date="new Date()"
  :max-date="new Date('2025-12-31')"
  :disabled-dates="[date1, date2]"
/>
```

### Display Options

```vue
<BWDatePicker
  :first-day-of-week="1"
  :show-week-numbers="false"
  :show-other-months="true"
  :number-of-months="1"
/>
```

### Styling

{% raw %}
```vue
<BWDatePicker
  container-class="my-container"
  input-class-name="my-input"
  :container-style="{ width: '300px' }"
  :input-style="{ padding: '10px' }"
/>
```
{% endraw %}

## 🛠️ Template Ref Methods

```vue
<script setup>
import { ref } from 'vue';
import { BWDatePicker } from '@bw-ui/datepicker-vue';

const pickerRef = ref(null);
</script>

<template>
  <BWDatePicker ref="pickerRef" />
  <button @click="pickerRef?.open()">Open</button>
  <button @click="pickerRef?.close()">Close</button>
  <button @click="pickerRef?.clear()">Clear</button>
  <button @click="pickerRef?.today()">Today</button>
  <button @click="pickerRef?.setDate(new Date())">Set</button>
</template>
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

## 🎣 Composable API

{% raw %}
```vue
<script setup>
import { useBWDatePicker } from '@bw-ui/datepicker-vue';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';

const {
  inputRef,     // Attach to input
  date,         // Current date (reactive)
  isOpen,       // Open state (reactive)
  open,         // Open picker
  close,        // Close picker
  toggle,       // Toggle picker
  setDate,      // Set date
  clear,        // Clear date
  prevMonth,    // Previous month
  nextMonth,    // Next month
  today,        // Go to today
  getPlugin,    // Get plugin
  getInstance,  // Get core instance
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
</script>

<template>
  <input ref="inputRef" />
</template>
```
{% endraw %}

## 📘 TypeScript

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { BWDatePicker, type BWDatePickerExposed } from '@bw-ui/datepicker-vue';

const pickerRef = ref<BWDatePickerExposed | null>(null);
const date = ref<Date | null>(null);

const handleChange = (newDate: Date | null) => {
  console.log(newDate);
};
</script>

<template>
  <BWDatePicker ref="pickerRef" v-model="date" @change="handleChange" />
</template>
```

## 🔄 SSR / Nuxt

Works automatically. The core is dynamically imported on client side.

```vue
<!-- No special configuration needed -->
<script setup>
import { BWDatePicker } from '@bw-ui/datepicker-vue';
</script>
```

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)
