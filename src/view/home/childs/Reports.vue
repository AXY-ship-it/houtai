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
        
      </el-card>
  </div> 
</template>

<script>
export default {
  name:'',
  components: {},
  props: {},
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  methods: {},
  created() {
    console.log('1234567')
  },
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>