# @bw-ui/datepicker-input-handler

Input handler plugin for BW DatePicker - Date masking, manual input, validation, and error messages.

![Version](https://img.shields.io/npm/v/@bw-ui/datepicker-input-handler)
![License](https://img.shields.io/npm/l/@bw-ui/datepicker-input-handler)
![Size](https://img.shields.io/bundlephobia/minzip/@bw-ui/datepicker-input-handler)

## ✨ Features

- ⌨️ **Manual Input** - Type dates directly
- 🎭 **Input Masking** - Auto-format as you type (DD/MM/YYYY)
- ✅ **Validation** - Validate on blur with error messages
- 🔄 **Auto Sync** - Syncs input with picker
- 📅 **Multiple Formats** - Support various date formats

## 📦 Installation

```bash
npm install @bw-ui/datepicker @bw-ui/datepicker-input-handler
```

## 🚀 Quick Start

```javascript
import { BWDatePicker } from '@bw-ui/datepicker';
import { InputHandlerPlugin } from '@bw-ui/datepicker-input-handler';

const picker = new BWDatePicker('#date-input', {
  mode: 'popup',
}).use(InputHandlerPlugin, {
  format: 'DD/MM/YYYY',
  allowManualInput: true,
});
```

## ⚙️ Options

| Option             | Type      | Default        | Description                     |
| ------------------ | --------- | -------------- | ------------------------------- |
| `format`           | `string`  | `'DD/MM/YYYY'` | Date format for input/display   |
| `allowManualInput` | `boolean` | `true`         | Allow typing in input field     |
| `autoCorrect`      | `boolean` | `true`         | Auto-correct invalid dates      |
| `validateOnBlur`   | `boolean` | `true`         | Validate when input loses focus |
| `showErrors`       | `boolean` | `true`         | Show error messages below input |

## 📅 Supported Formats

- `DD/MM/YYYY` - 25/12/2025
- `MM/DD/YYYY` - 12/25/2025
- `YYYY-MM-DD` - 2025-12-25
- `DD-MM-YYYY` - 25-12-2025
- `DD.MM.YYYY` - 25.12.2025

## 📄 License

MIT © [BW UI](https://github.com/bw-ui)
