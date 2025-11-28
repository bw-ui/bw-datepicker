/**
 * @bw-ui/datepicker-date-utils
 * Date Utilities Plugin - Advanced parsing, formatting, calculations
 */

import * as calculator from './calculator.js';
import * as comparator from './comparator.js';
import * as formatter from './formatter.js';
import * as generator from './generator.js';
import * as parser from './parser.js';
import * as validator from './validator.js';

export const DateUtilsPlugin = {
  name: 'date-utils',
  
  init(api, options = {}) {
    // Extend datepicker with advanced date methods
    Object.defineProperties(api.datepicker, {
      parseDate: { value: parser.smartParse, writable: true },
      formatDate: { value: formatter.formatDate, writable: true },
      isValidDate: { value: validator.isValidDate, writable: true },
      compareDates: { value: comparator.isSameDay, writable: true },
    });

    return { calculator, comparator, formatter, generator, parser, validator };
  },
  
  destroy() {}
};

export { calculator, comparator, formatter, generator, parser, validator };
export default DateUtilsPlugin;
