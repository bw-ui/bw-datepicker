# @bw-ui/datepicker-locale

Locale plugin for BW DatePicker - Internationalization support with 17+ languages.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-locale)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-locale)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-locale)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-locale) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 🌍 **17+ Languages** - Built-in presets for major languages
- 🔤 **Intl API** - Uses native browser localization
- ✏️ **Custom Names** - Override month/day names
- 🔄 **Runtime Switching** - Change locale dynamically
- 📅 **First Day of Week** - Configurable per locale
- ↔️ **RTL Support** - Right-to-left languages

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-locale
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { LocalePlugin } from '@bw-ui/datepicker-locale';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup'
}).use(LocalePlugin, {
  locale: 'fr-FR'
});
```

### CDN

```html
<link rel="stylesheet" href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css">

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-locale/dist/bw-locale.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input')
    .use(BWLocale.LocalePlugin, {
      locale: 'fr-FR'
    });
</script>
```

## ⚙️ Options

```javascript
.use(BWLocale.LocalePlugin, {
  locale: 'en-US',
  useIntl: true,
  monthNames: null,
  monthNamesShort: null,
  dayNames: null,
  dayNamesShort: null,
  dayNamesNarrow: null,
  firstDayOfWeek: 0,
})
```

### Options Reference

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `locale` | `string` | `'en-US'` | BCP 47 locale code or preset name |
| `useIntl` | `boolean` | `true` | Use browser's Intl API |
| `monthNames` | `array\|null` | `null` | Custom month names (12 items) |
| `monthNamesShort` | `array\|null` | `null` | Custom short month names |
| `dayNames` | `array\|null` | `null` | Custom day names (7 items, starting Sunday) |
| `dayNamesShort` | `array\|null` | `null` | Custom short day names |
| `dayNamesNarrow` | `array\|null` | `null` | Custom narrow day names (single letter) |
| `firstDayOfWeek` | `number` | `0` | First day: `0` (Sunday) - `6` (Saturday) |

## 🌍 Built-in Locales

| Code | Language | First Day |
|------|----------|-----------|
| `en-US` | English (US) | Sunday |
| `en-GB` | English (UK) | Monday |
| `es-ES` | Spanish | Monday |
| `fr-FR` | French | Monday |
| `de-DE` | German | Monday |
| `it-IT` | Italian | Monday |
| `pt-BR` | Portuguese (Brazil) | Sunday |
| `nl-NL` | Dutch | Monday |
| `ru-RU` | Russian | Monday |
| `ja-JP` | Japanese | Sunday |
| `zh-CN` | Chinese (Simplified) | Monday |
| `ko-KR` | Korean | Sunday |
| `ar-SA` | Arabic (RTL) | Sunday |
| `hi-IN` | Hindi | Sunday |
| `tr-TR` | Turkish | Monday |
| `pl-PL` | Polish | Monday |
| `sv-SE` | Swedish | Monday |

## 📖 Examples

### Using Built-in Preset

```javascript
// French
.use(BWLocale.LocalePlugin, { locale: 'fr-FR' })

// German  
.use(BWLocale.LocalePlugin, { locale: 'de-DE' })

// Japanese
.use(BWLocale.LocalePlugin, { locale: 'ja-JP' })

// Arabic (with RTL)
.use(BWLocale.LocalePlugin, { locale: 'ar-SA' })
```

### Using Intl API (Any Locale)

```javascript
// Use any BCP 47 locale code - Intl API handles it
.use(BWLocale.LocalePlugin, { 
  locale: 'th-TH',  // Thai
  useIntl: true 
})
```

### Custom Month/Day Names

```javascript
.use(BWLocale.LocalePlugin, {
  locale: 'custom',
  monthNames: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  firstDayOfWeek: 1,
})
```

### Monday First Day of Week

```javascript
.use(BWLocale.LocalePlugin, {
  locale: 'en-US',
  firstDayOfWeek: 1,  // Monday
})
```

## 🔄 Runtime Locale Switching

```javascript
const picker = new BWDatePicker('#date-input')
  .use(BWLocale.LocalePlugin, { locale: 'en-US' });

// Get locale plugin instance
const locale = picker.getPlugin('locale');

// Switch to French
locale.setLocale('fr-FR');

// Switch to German
locale.setLocale('de-DE');

// Get current locale
const current = locale.getLocale(); // 'de-DE'
```

## 📖 API Methods

```javascript
const locale = picker.getPlugin('locale');

// Get current locale
locale.getLocale();                    // 'fr-FR'

// Set locale
locale.setLocale('de-DE');

// Get month name
locale.getMonthName(0);                // 'January'
locale.getMonthName(0, 'short');       // 'Jan'

// Get all month names
locale.getMonthNames();                // ['January', 'February', ...]
locale.getMonthNames('short');         // ['Jan', 'Feb', ...]

// Get day name
locale.getDayName(0);                  // 'Sunday'
locale.getDayName(0, 'narrow');        // 'S'

// Get all day names
locale.getDayNames();                  // ['Sun', 'Mon', ...]
locale.getDayNames('long', 1);         // Monday first: ['Monday', 'Tuesday', ...]

// Format date with locale
locale.formatDate(new Date(), { dateStyle: 'long' });

// Get relative time
locale.getRelativeTime(new Date());    // 'Today', 'Tomorrow', etc.
```

## 🔌 Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { LocalePlugin } from '@bw-ui/datepicker-locale';
import { AccessibilityPlugin } from '@bw-ui/datepicker-accessibility';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(LocalePlugin, { locale: 'de-DE' })
  .use(AccessibilityPlugin);
```

## 📝 Using Presets Directly

```javascript
import { LocalePlugin, fr_FR, de_DE } from '@bw-ui/datepicker-locale';

// Use preset object
.use(LocalePlugin, fr_FR)

// Or spread and override
.use(LocalePlugin, {
  ...de_DE,
  firstDayOfWeek: 0,  // Override to Sunday
})
```

## 📁 What's Included

```
dist/
├── bw-locale.min.js      # IIFE build (for <script>)
└── bw-locale.esm.min.js  # ESM build (for import)
```

## 🔗 Related Packages

| Package | Description |
|---------|-------------|
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker) | Core (required) |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming) | Dark mode |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning) | Auto-positioning |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile) | Touch support |
| [@bw-ui/datepicker-input-handler](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) | Input masking |
| [@bw-ui/datepicker-date-utils](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils) | Date utilities |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
