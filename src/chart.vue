<template>
  <div
    id="myChart"
    :style="{ width: '100%', minHeight: props.minHeight + 'px' }"
    ref="chartRef"
  ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineExpose } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "默认标题",
  },
  option: {
    type: Object,
    default: () => ({}), // 将默认值设置为一个空对象
  },
  minHeight: {
    type: Number,
    default: 400,
  },
});

// 引入 echarts 核心模块
import * as echarts from "echarts/core";

// 引入柱状图和折线图组件
import { BarChart, LineChart } from "echarts/charts";

// 引入标题、提示框、网格、数据集和数据转换器组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
} from "echarts/components";

// 引入 Canvas 渲染器
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

const chartRef = ref(null);
let myChart: any;
onMounted(() => {
  myChart = echarts.init(chartRef.value);
  // 配置图表
  if (Object.keys(props.option).length === 0) {
    myChart.setOption(option);
  } else {
    myChart.setOption(props.option);
  }
});

const option = {
  //添加标题
  title: {
    text: props.title,
  },
  tooltip: {},
  xAxis: {
    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    axisLabel: {
      fontSize: "20px",
      color: "#000", // 更改 x 轴字体颜色
    },
  },
  yAxis: {
    type: "value",
    axisLabel: {
      color: "#000",
      fontSize: "20px",
      formatter: function (value: number) {
        return value + " dB";
      },
    },
  },
  series: [
    {
      name: "销量",
      type: "line",
      data: [25, 30, 35, 40, 45, 55],
      lineStyle: {
        color: "red",
      },
    },
  ],
};
const changeOption = (xData: any, yData: any) => {
  props.option.xAxis.data = xData;
  props.option.series[0].data = yData;
  if (myChart) {
    myChart.setOption(props.option);
  }
};
defineExpose({
  myChart,
  changeOption,
});
</script>
