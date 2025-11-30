/**
 * @bw-ui/datepicker-input-handler
 * Input Handler Plugin - Masking, validation, manual input
 *
 * Compatible with slot-based architecture (v1.1.0):
 * - Uses core events (date:selected, date:changed)
 * - No dependencies on other plugins
 *
 * @version 1.1.0
 */

import { InputBinder } from './InputBinder.js';
import { MaskHandler } from './MaskHandler.js';
import { ValidationHandler } from './ValidationHandler.js';
import { ValueSync } from './ValueSync.js';

export const InputHandlerPlugin = {
  name: 'input-handler',

  init(api, options = {}) {
    const inputEl = api.getInputElement();
    const opts = api.getOptions();
    const eventBus = api.getEventBus();

    const binder = new InputBinder(inputEl, api.datepicker, eventBus, {
      format: options.format || opts.format || 'DD/MM/YYYY',
      autoCorrect: options.autoCorrect !== false,
      validateOnBlur: options.validateOnBlur !== false,
      showErrors: options.showErrors !== false,
      allowManualInput: options.allowManualInput !== false,
      minDate: opts.minDate,
      maxDate: opts.maxDate,
      disabledDates: opts.disabledDates,
    });

    return binder;
  },

  destroy(instance) {
    instance?.destroy?.();
  },
};

export { InputBinder, MaskHandler, ValidationHandler, ValueSync };
export default InputHandlerPlugin;
