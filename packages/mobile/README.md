# @bw-ui/datepicker-mobile

Mobile plugin for BW DatePicker - Touch support, swipe gestures, and orientation handling.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-mobile)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-mobile)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-mobile)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-mobile) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 👆 **Touch Support** - Native touch event handling
- 👈👉 **Swipe Gestures** - Swipe left/right for month navigation
- 🔄 **Orientation Handling** - Adapts to portrait/landscape
- 📱 **Mobile Detection** - Auto-detect mobile devices
- ✨ **Touch Feedback** - Visual feedback on touch

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-mobile
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { MobilePlugin } from '@bw-ui/datepicker-mobile';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
}).use(BWMobile.MobilePlugin);
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker-mobile/dist/bw-mobile.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-mobile/dist/bw-mobile.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input').use(BWMobile.MobilePlugin);
</script>
```

## ⚙️ Options

```javascript
.use(BWMobile.MobilePlugin, {
  enableTouch: true,
  enableSwipe: true,
  swipeThreshold: 50,
  touchFeedback: true,
  enableOrientationChange: true,
})
```

### Options Reference

| Option                    | Type      | Default | Values                   | Description                       |
| ------------------------- | --------- | ------- | ------------------------ | --------------------------------- |
| `enableTouch`             | `boolean` | `true`  | `true`, `false`          | Enable touch event handling       |
| `enableSwipe`             | `boolean` | `true`  | `true`, `false`          | Enable swipe gestures             |
| `swipeThreshold`          | `number`  | `50`    | Any positive number (px) | Minimum swipe distance to trigger |
| `touchFeedback`           | `boolean` | `true`  | `true`, `false`          | Visual feedback on touch          |
| `enableOrientationChange` | `boolean` | `true`  | `true`, `false`          | Handle orientation changes        |

## 👆 Swipe Gestures

| Gesture     | Action         |
| ----------- | -------------- |
| Swipe Left  | Next month     |
| Swipe Right | Previous month |

## 📖 Examples

### Basic Usage

```javascript
.use(BWMobile.MobilePlugin)
// All features enabled by default
```

### Disable Swipe

```javascript
.use(BWMobile.MobilePlugin, {
  enableSwipe: false
})
```

### Custom Swipe Sensitivity

```javascript
.use(BWMobile.MobilePlugin, {
  swipeThreshold: 100  // Requires longer swipe
})
```

### Disable Touch Feedback

```javascript
.use(BWMobile.MobilePlugin, {
  touchFeedback: false
})
```

### Touch Only (No Swipe)

```javascript
.use(BWMobile.MobilePlugin, {
  enableTouch: true,
  enableSwipe: false
})
```

## 🔌 Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { MobilePlugin } from '@bw-ui/datepicker-mobile';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(BWMobile.MobilePlugin);
```

## 📁 What's Included

```
dist/
├── bw-mobile.min.js      # IIFE build (for <script>)
├── bw-mobile.esm.min.js  # ESM build (for import)
└── bw-mobile.min.css     # Mobile styles
```

## 🔗 Related Packages

| Package                                                                                          | Description      |
| ------------------------------------------------------------------------------------------------ | ---------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required)  |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode        |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav     |
| [@bw-ui/datepicker-positioning](https://www.npmjs.com/package/@bw-ui/datepicker-positioning)     | Auto-positioning |
| [@bw-ui/datepicker-input-handler](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) | Input masking    |
| [@bw-ui/datepicker-date-utils](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)       | Date utilities   |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
