<script setup>
import { ref } from 'vue';
import { BWDatePicker } from '@bw-ui/datepicker-vue';
import { ThemingPlugin } from '@bw-ui/datepicker-theming';
import '@bw-ui/datepicker/css';
import '@bw-ui/datepicker-theming/css';

const date = ref(null);
const plugins = [ThemingPlugin];
const pluginOptions = {
  theming: { theme: 'dark' },
};

const handleChange = (newDate) => {
  console.log('Date changed:', newDate);
};
</script>

<template>
  <div class="container">
    <h1>BW DatePicker Vue Test</h1>

    <div class="demo">
      <h2>Basic Usage</h2>
      <BWDatePicker
        v-model="date"
        placeholder="Select a date"
        @change="handleChange"
      />
      <p>Selected: {{ date }}</p>
    </div>

    <div class="demo">
      <h2>With Theming Plugin (Dark)</h2>
      <BWDatePicker
        v-model="date"
        :plugins="plugins"
        :plugin-options="pluginOptions"
        placeholder="Dark theme picker"
      />
    </div>
  </div>
</template>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, sans-serif;
}

.demo {
  margin: 30px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h1 {
  color: #333;
}

h2 {
  margin-top: 0;
  color: #666;
}
</style>
