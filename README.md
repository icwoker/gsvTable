# GSV Table Component

This is a table component for parsing and displaying GSV data. It depends on **echart** and **arco** libraries. To use it, make sure to install these two libraries first.

```bash
# Download echarts and arco
npm install --save-dev @arco-design/web-vue
npm install echarts --save
```

## Installation

After installing the required dependencies, you need to register the Arco component library in your `main.ts`:

```typescript
import { createApp } from "vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(ArcoVue);
app.mount("#app");
```

## Usage

Once registered, you can use the `GsvTable` component where needed:

```typescript
<script setup lang="ts">
import { GsvTable } from "gsvtable";
import { ref } from "vue";

const Data = ref([
  "$GNGGA,000048.00,5006.63590048,N,01433.38754186,E,1,16,1.1,221.4358,M,44.6136,M,,*71",
  "$GNZDA,000048.00,28,08,2024,,*72",
  "$GNRMC,000048.00,A,5006.63590048,N,01433.38754186,E,15.440,169.3,280824,4.3,E,A,C*73",
  "$GPGSV,1,1,04,18,15,182,46,20,16,080,46,25,66,106,46,29,81,228,46,1*61",
  "$GPGSV,1,1,01,25,66,106,53,8*5A",
  "$GLGSV,1,1,02,80,65,323,56,82,55,188,56,1*78",
  "$GBGSV,2,1,06,03,24,201,53,05,28,206,53,09,43,134,53,20,31,080,53,1*7E",
  "$GBGSV,2,2,06,19,75,305,53,25,56,200,53,1*7A",
  "$GBGSV,1,1,03,20,31,080,42,19,75,305,42,25,56,200,42,3*43",
  "$GBGSV,1,1,03,20,31,080,51,19,75,305,51,25,56,200,51,5*47",
  "$GAGSV,1,1,04,13,33,164,52,15,52,090,52,19,17,260,52,21,59,295,52,1*71",
  "$GAGSV,1,1,03,13,33,164,40,19,17,260,40,21,59,295,40,2*4B",
  "$GAGSV,1,1,04,27,61,100,46,13,33,164,46,15,52,090,46,21,59,295,46,7*7E",
]);

const changeData = () => {
  Data.value = [
    "$GNGGA,000013.00,5006.74223416,N,01433.39769189,E,1,16,0.8,228.6490,M,44.6103,M,,*7F",
    "$GNZDA,000013.00,28,08,2024,,*7C",
    "$GNRMC,000013.00,A,5006.74223416,N,01433.39769189,E,8.326,261.7,280824,4.3,E,A,C*4F",
    "$GPGSV,1,1,02,25,67,106,46,26,17,293,46,1*6D",
    "$GLGSV,1,1,02,82,54,188,56,80,65,323,57,1*78",
    "$GBGSV,2,1,06,03,24,201,53,05,28,206,54,09,43,134,53,20,31,080,54,1*7E",
    "$GBGSV,2,2,06,25,56,200,53,19,75,304,53,1*7B",
    "$GBGSV,1,1,02,20,31,080,43,25,56,200,43,3*78",
    "$GBGSV,1,1,03,20,31,080,48,25,56,200,48,19,75,304,48,5*4E",
    "$GAGSV,2,1,06,21,59,294,50,27,62,099,50,34,19,037,50,13,33,164,50,1*7B",
    "$GAGSV,2,2,06,15,51,090,50,19,17,260,50,1*70",
    "$GAGSV,2,1,06,21,59,294,37,27,62,099,37,34,19,037,36,13,33,164,37,2*79",
    "$GAGSV,2,2,06,15,51,090,37,19,17,260,37,2*73",
    "$GAGSV,2,1,06,21,59,294,46,27,62,099,46,34,19,037,46,13,33,164,46,7*7D",
    "$GAGSV,2,2,06,15,51,090,46,19,17,260,46,7*76",
  ];
};
</script>

<template>
  <GsvTable :GSVData="Data" />
  <button @click="changeData">Change Data Value</button>
</template>

<style scoped></style>
```

Now, you can use the component in your project.