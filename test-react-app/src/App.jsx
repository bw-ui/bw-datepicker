import { useState } from 'react';
import { BWDatePicker } from '../../packages/react/src/index.js';
import '../../packages/core/dist/bw-datepicker.min.css';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import '@bw-ui/datepicker-theming/css';
import { LocalePlugin } from '@bw-ui/datepicker-locale';

export default function App() {
  const [date, setDate] = useState(null);

  return (
    <div style={{ padding: 40 }}>
      <h1>BW DatePicker Test</h1>
      <BWDatePicker
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
        plugins={[ThemingPlugin, LocalePlugin]}
        pluginOptions={{
          theming: { theme: 'dark' },
          locale: { locale: 'hi-IN' },
        }}
      />
      <p>Selected: {date?.toLocaleDateString() || 'None'}</p>
    </div>
  );
}
