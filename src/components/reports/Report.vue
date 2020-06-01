<template>
  <div>
    <!--面包屑头部-->
    <bread :breadTitle="breadTitle" />
    <!-- 卡片区域 -->
    <el-card>
      <!-- 通过echarts库来绘制报表 -->
      <!-- 2.  为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import Bread from "components/common/Bread";

//1. 导入echarts
import echarts from "echarts";
import _ from "lodash";
import { getReportData } from "network/reports";

export default {
  name: "Report",
  data() {
    return {
      breadTitle: ["首页", "数据统计", "数据报表"],
      // 4.指定表单的配置项和数据
      // 需要合并的options,通过工具白lodash
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  created() {},
  mounted() {
    // 图的渲染应该是在dom组件加载完成之后
    this.renderEchart();
  },
  methods: {
    async renderEchart() {
      // 3.基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main"));

      // 获取数据
      const { data } = await getReportData();
      if (data.meta.status != 200) return this.$message.error(data.meta.msg);

      // 5. 使用刚指定的配置项和数据显示图表
      const result = _.merge(data.data, this.options);

      myChart.setOption(result);
    }
  },
  components: { Bread }
};
</script>

<style lang="less" scoped>
</style>