# @bw-ui/datepicker-positioning

Positioning plugin for BW DatePicker - Auto-flip, collision detection, and viewport constraints.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-positioning)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-positioning)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-positioning)

[Live Demo](https://bw-ui.github.io/bw-datepicker) • [Documentation](https://www.npmjs.com/package/@bw-ui/datepicker-positioning) • [Core Package](https://www.npmjs.com/package/@bw-ui/datepicker)

## ✨ Features

- 📍 **Auto Positioning** - Position relative to input
- 🔄 **Auto Flip** - Flip when near viewport edges
- 🚧 **Collision Detection** - Avoid overlapping viewport
- 📐 **Multiple Placements** - Top, bottom, left, right
- ↔️ **Alignment Options** - Start, center, end

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-positioning
```

> ⚠️ **Peer Dependency:** Requires `@bw-ui/datepicker` core package

## 🚀 Quick Start

### ES Modules

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { PositioningPlugin } from '@bw-ui/datepicker-positioning';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
}).use(PositioningPlugin);
```

### CDN

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.css"
/>

<script src="https://unpkg.com/@bw-ui/datepicker/dist/bw-datepicker.min.js"></script>
<script src="https://unpkg.com/@bw-ui/datepicker-positioning/dist/bw-positioning.min.js"></script>

<script>
  const picker = new BW.BWDatePicker('#date-input').use(
    BWPositioning.PositioningPlugin
  );
</script>
```

## ⚙️ Options

```javascript
.use(BWPositioning.PositioningPlugin, {
  placement: 'bottom',
  alignment: 'start',
  autoFlip: true,
  offset: { x: 0, y: 8 },
  constrainToViewport: true,
})
```

### Options Reference

| Option                | Type      | Default          | Values                          | Description                       |
| --------------------- | --------- | ---------------- | ------------------------------- | --------------------------------- |
| `placement`           | `string`  | `'bottom'`       | `'top'`, `'bottom'`             | Position relative to input        |
| `alignment`           | `string`  | `'start'`        | `'left'`, `'center'`, `'right'` | Alignment along placement axis    |
| `autoFlip`            | `boolean` | `true`           | `true`, `false`                 | Flip to opposite side if no space |
| `offset`              | `object`  | `{ x: 0, y: 8 }` | `{ x: number, y: number }`      | Offset from input (px)            |
| `constrainToViewport` | `boolean` | `true`           | `true`, `false`                 | Keep picker inside viewport       |

## 📍 Placement & Alignment

```
              alignment
           start  center  end
          ┌──────┬──────┬──────┐
    top   │  TL  │  TC  │  TR  │
          ├──────┼──────┼──────┤
placement │      │[INPUT]│      │
          ├──────┼──────┼──────┤
   bottom │  BL  │  BC  │  BR  │
          └──────┴──────┴──────┘
```

| Placement + Alignment | Position                   |
| --------------------- | -------------------------- |
| `bottom` + `start`    | Below input, left aligned  |
| `bottom` + `center`   | Below input, centered      |
| `bottom` + `end`      | Below input, right aligned |
| `top` + `start`       | Above input, left aligned  |
| `top` + `center`      | Above input, centered      |
| `top` + `end`         | Above input, right aligned |

## 📖 Examples

### Basic Usage

```javascript
.use(BWPositioning.PositioningPlugin)
// Default: bottom, start aligned, auto-flip enabled
```

### Position Above Input

```javascript
.use(BWPositioning.PositioningPlugin, {
  placement: 'top'
})
```

### Center Aligned

```javascript
.use(BWPositioning.PositioningPlugin, {
  placement: 'bottom',
  alignment: 'center'
})
```

### Right Aligned

```javascript
.use(BWPositioning.PositioningPlugin, {
  placement: 'bottom',
  alignment: 'end'
})
```

### Custom Offset

```javascript
.use(BWPositioning.PositioningPlugin, {
  offset: { x: 0, y: 16 }  // 16px gap below input
})
```

### Disable Auto Flip

```javascript
.use(BWPositioning.PositioningPlugin, {
  autoFlip: false  // Always stay at specified placement
})
```

### No Viewport Constraint

```javascript
.use(BWPositioning.PositioningPlugin, {
  constrainToViewport: false  // Allow overflow outside viewport
})
```

## 🔄 Auto Flip Behavior

When `autoFlip: true`:

| Input Position          | Default Placement | Flipped To |
| ----------------------- | ----------------- | ---------- |
| Near bottom of viewport | `bottom`          | `top`      |
| Near top of viewport    | `top`             | `bottom`   |
| Near right of viewport  | `right`           | `left`     |
| Near left of viewport   | `left`            | `right`    |

## 🔌 Combining with Other Plugins

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import { PositioningPlugin } from '@bw-ui/datepicker-positioning';

const picker = new BWDatePicker('#date-input')
  .use(ThemingPlugin, { theme: 'dark' })
  .use(PositioningPlugin, { placement: 'top' });
```

## 📁 What's Included

```
dist/
├── bw-positioning.min.js      # IIFE build (for <script>)
└── bw-positioning.esm.min.js  # ESM build (for import)
```

## 🔗 Related Packages

| Package                                                                                          | Description     |
| ------------------------------------------------------------------------------------------------ | --------------- |
| [@bw-ui/datepicker](https://www.npmjs.com/package/@bw-ui/datepicker)                             | Core (required) |
| [@bw-ui/datepicker-theming](https://www.npmjs.com/package/@bw-ui/datepicker-theming)             | Dark mode       |
| [@bw-ui/datepicker-accessibility](https://www.npmjs.com/package/@bw-ui/datepicker-accessibility) | Keyboard nav    |
| [@bw-ui/datepicker-mobile](https://www.npmjs.com/package/@bw-ui/datepicker-mobile)               | Touch support   |
| [@bw-ui/datepicker-input-handler](https://www.npmjs.com/package/@bw-ui/datepicker-input-handler) | Input masking   |
| [@bw-ui/datepicker-date-utils](https://www.npmjs.com/package/@bw-ui/datepicker-date-utils)       | Date utilities  |

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)

## 🐛 Issues

Found a bug? [Report it here](https://github.com/bw-ui/bw-datepicker/issues)
