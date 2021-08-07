<template>
  <div class="order-list">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">订单管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!-- 查询订单 -->
         <el-col :span="10" style="margin-bottom:10px">
           <el-input placeholder="请输入内容" v-model="searchOrder" class="input-with-select">
                 <el-button slot="append" icon="el-icon-search"></el-button>
           </el-input>
         </el-col>
        <!-- 表格 -->
           <el-table border style="width: 100%" :data="orderLists" stripe>
                 <el-table-column width="60"  type="index" label="序号"></el-table-column>
                 <el-table-column prop="order_number" width="300" label="订单编号"></el-table-column>
                 <el-table-column prop="order_price" width="150" label="订单价格"></el-table-column>
                 <el-table-column prop="is_send" width="150" label="是否付款">
                   <template slot-scope="scope">
                     <el-tag type="danger" v-if="scope.row.is_send==='否'">未付款</el-tag>
                     <el-tag type="success" v-else>已付款</el-tag>
                   </template>
                 </el-table-column>
                 <el-table-column prop="create_time" width="200" label="订单时间"></el-table-column>
                 <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditOrder(scope.row)">编辑</el-button>
                    <el-button type="success" size="mini" icon="el-icon-location-outline" @click="editOrderAddress(scope.row)">修改地址</el-button>
                    <el-button type="info" size="mini" icon="el-icon-s-order" @click="lookOrderInfo(scope.row)">查看订单信息</el-button>
                  </template>
                 </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="query.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="query.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
      </el-card>
      <!-- 编辑订单信息的对话框 -->
      <el-dialog
  title="编辑商品信息"
  :visible.sync="editOrderDialogVisible"
  width="50%">
  <el-form ref="editOrderRef" :model="editOrderForm" label-width="80px" :rules="editOrderRules">
  <el-form-item label="订单是否发货">
    <el-input v-model="editOrderForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="订单支付方式">
    <el-input v-model="editOrderForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="订单价格">
    <el-input v-model="editOrderForm.goods_name"></el-input>
  </el-form-item>
   <el-form-item label="订单数量">
    <el-input v-model="editOrderForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="支付状态">
    <el-input v-model="editOrderForm.goods_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editOrderDialogVisible= false">取 消</el-button>
    <el-button type="primary" @click="confirmEditOrder">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {getOrderList, editOrder} from '@/network/order.js'
export default {
  name:'',
  components: {},
  props: {},
  data() {
    return {
      orderLists:[],
      total:0,
      query:{
        pagenum:1,
        pagesize:10,
      },
      editOrderDialogVisible:false,
      editOrderForm:{},
      editOrderRules:{},
      searchOrder:''
    }
  },
  watch: {},
  computed: {},
  methods: {
    async getOrderList(){
      const {data:res}=await getOrderList(this.query)
      if(res.meta.status!==200){
       return this.$message.error('获取数据失败')
      }
      this.total=res.data.total
      this.orderLists=res.data.goods
      console.log(res)
    },
    // 监听pagesize的变化
    handleSizeChange(newSize){
      this.query.pagesize=newSize
      this.getOrderList()
    },
    handleCurrentChange(newNum){
      this.query.pagenum=newNum
      this.getOrderList()
    },
    // 展示编辑订单信息的对话框
  async  showEditOrder(order){
       this.editOrderDialogVisible=true
       const {data:res}=await editOrder(order.order_id)
       console.log(res)
    },
    // 修改订单信息
    async  confirmEditOrder(){
        this.editOrderDialogVisible=false
    }
  },
  created() {
    this.getOrderList()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>

</style>