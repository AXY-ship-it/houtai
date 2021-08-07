<template>
   <div class="rights">
       <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
        <el-table
    :data="tableData"
    height="550"
    style="width: 100%">
    <el-table-column
      type="index"
      label="序号"
      width="100">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="340">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径"
      width="340">
    </el-table-column>
    <el-table-column
      prop="level"
      label="权限等级">
    </el-table-column>
  </el-table>
    </el-card>
  </div>
</template>

<script>
import {getRights} from '@/network/rights.js'
export default {
  name:'',
  components: {},
  props: {},
  data() {
    return {
        tableData:[]
    }
  },
  watch: {},
  computed: {},
  methods: {
    async  getRightsList(){
        const {data:res}=await getRights()
        if(res.meta.status!==200){
            this.$message.error('获取权限列表失败')
        }
        this.tableData=res.data
        
    }
  },
  created() {
      this.getRightsList()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>