<template>
  <div class="report">
    <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">数据统计</a></el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
      
  <!-- 基于时间统计的折线图 -->
      <el-card>
        <div id="main" style="width: 800px;height:400px;"></div>
      </el-card>
  </div> 
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
import {getReport} from '@/network/home.js'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
  },
 async mounted() {
     var myChart = echarts.init(document.getElementById('main'))
     const {data:res}=await getReport()
      if(res.meta.status!==200){
        return this.$message.error('获取数据失败')
      }
      // 准备数据和配置项
      console.log(res.data)
      const result=_.merge(res.data,this.options)
      console.log(this.options)
      
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result)
  }
}
</script>
<style lang="less" scoped>

</style>