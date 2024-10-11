<template>
  <div class="container">
    <a-tabs default-active-key="2" v-model:active-key="Tab">
      <a-tab-pane :key="tab.key" :title="tab.title" v-for="tab in tabsData">
        <a-tabs
          class="sub-tabs"
          v-model:active-key="subTab"
          @change="handleSubTabChange"
        >
          <a-tab-pane
            :key="subTab.key"
            :title="subTab.title"
            v-for="subTab in tab.subTabs"
          >
          </a-tab-pane>
        </a-tabs>
      </a-tab-pane>
    </a-tabs>
    <chart :key="fullTabName" :option="Chartoption" ref="chartRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, defineProps, onMounted } from "vue";
import chart from "./chart.vue";
import * as parser from "../utils/parser";

const props = defineProps({
  GSVData: {
    type: Object,
    default: () => {
      return {
        status: "ok",
        data: [],
      };
    },
  },
});

const RPSstore = reactive({
  SNRData: {} as any,
  ggaData: {} as any,
  getSNRData(type: string, subTab: string) {
    return this.SNRData[type][subTab];
  },
});

const chartRef = ref(null);

const tabsData = [
  {
    title: "GPS",
    key: "GPS",
    subTabs: [
      {
        title: "L1",
        key: "L1",
      },
      {
        title: "L2C",
        key: "L2C",
      },
      {
        title: "L2P",
        key: "L2P",
      },
      {
        title: "L5",
        key: "L5",
      },
      {
        title: "C/A",
        key: "C/A",
      },
    ],
  },
  {
    title: "BDS",
    key: "BDS",
    subTabs: [
      {
        title: "B1I",
        key: "B1I",
      },
      {
        title: "B2I",
        key: "B2I",
      },
      {
        title: "B3I",
        key: "B3I",
      },
      {
        title: "B1C",
        key: "B1C",
      },
      {
        title: "B2b",
        key: "B2b",
      },
      {
        title: "B2a",
        key: "B2a",
      },
    ],
  },
  {
    title: "GAL",
    key: "GAL",
    subTabs: [
      {
        title: "E1",
        key: "E1",
      },
      {
        title: "E5a",
        key: "E5a",
      },
      {
        title: "E5b",
        key: "E5b",
      },
    ],
  },
  {
    title: "GLO",
    key: "GLO",
    subTabs: [
      {
        title: "G1",
        key: "G1",
      },
      {
        title: "G2",
        key: "G2",
      },
    ],
  },
  {
    title: "QZSS",
    key: "QZSS",
    subTabs: [
      {
        title: "L1 C/A",
        key: "L1 C/A",
      },
      {
        title: "L2C",
        key: "L2C",
      },
      {
        title: "L5",
        key: "L5",
      },
    ],
  },
];

const Tab = ref("GPS");
const subTab = ref("L1");
const fullTabName = ref("GPS-L1");
const Chartoption = ref({});

const handleSubTabChange = (key: string | number) => {
  fullTabName.value = `${Tab.value}-${key}`;
  const type: string = nameSwitch(Tab.value)!;
  let xData, yData, data;
  try {
    data = RPSstore.getSNRData(type, key as string);
    xData = data["PRN"];
    yData = data["cn"];
  } catch {
    xData = [];
    yData = [];
  }

  console.log(xData, yData);
  console.log(fullTabName.value);
  setChartoption(xData, yData);
  return { xData, yData };
};
const nameSwitch = (name: string): string | undefined => {
  switch (name) {
    case "GPS":
      return "GP";
    case "BDS":
      return "GB";
    case "GAL":
      return "GA";
    case "GLO":
      return "GL";
    case "QZSS":
      return "GN";
    default:
      console.log("暂时不支持此类型");
      return undefined; // Explicitly return undefined for unsupported types
  }
};
const setChartoption = (xData: any, yData: any) => {
  Chartoption.value = {
    title: {
      text: fullTabName.value,
      left: "center", // Center the title
      textStyle: {
        color: "#333", // Title color
        fontSize: 24, // Title font size
        fontWeight: "bold", // Bold title
      },
    },
    tooltip: {
      backgroundColor: "rgba(255, 255, 255, 0.8)", // Light background for tooltips
      borderColor: "#4c8bf5", // Tooltip border color
      borderWidth: 1, // Border width
      textStyle: {
        color: "#000", // Tooltip text color
      },
    },
    xAxis: {
      name: "SNR",
      type: "value",
      nameTextStyle: {
        color: "#000", // X-axis name color
        fontSize: 20,
        fontWeight: "bold", // Bold axis name
      },
      axisLabel: {
        color: "#000",
        fontSize: 20,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed", // Dashed grid lines
          color: "#ccc", // Grid line color
        },
      },
    },
    yAxis: {
      name: "PRN",
      type: "category",
      nameTextStyle: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
      },
      data: xData,
      axisLabel: {
        color: "#000",
        fontSize: 20,
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#ccc",
        },
      },
    },
    series: [
      {
        name: "SNR",
        type: "bar",
        data: yData,
        itemStyle: {
          color: {
            type: "linear", // Gradient color
            x: 0,
            y: 0,
            x2: 1,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#4c8bf5" }, // Start color
              { offset: 1, color: "#8dbef5" }, // End color
            ],
          },
        },
      },
    ],
  };
};
setChartoption([], []);

watch(
  () => RPSstore.SNRData,
  () => {
    const { xData, yData } = handleSubTabChange(subTab.value);
    if (chartRef.value) {
      (chartRef.value as any).changeOption(xData, yData);
    }
  }
);

const getText = async () => {
  const txt: any = props.GSVData;
  console.log(txt);
  console.log(txt[0]);
  if (txt) {
    const result = parser.filterGSVLines(txt);
    const gga = txt[0];
    const ggaData = parser.parseGGA(gga);
    RPSstore.ggaData = ggaData;
    console.log(RPSstore.ggaData);
    const data = result.map(parser.processGSVLine);
    const finalData = parser.storeProcessedDataByType(data);
    console.log(finalData);
    RPSstore.SNRData = finalData as any;
  }
};
watch(
  () => props.GSVData,
  () => {
    getText();
  }
);
onMounted(() => {
  if (props.GSVData.length > 0) {
    getText();
  }
});
</script>

<style scoped>
.container {
  background-color: #1a539a;
}
:deep(.arco-tabs-tab) {
  color: #fff;
}

:deep(.arco-tabs-tab:hover) {
  color: #333;
}
</style>
