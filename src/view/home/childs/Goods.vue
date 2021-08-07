<template>
  <div class="goods">
          <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card v-if="!isAdd">
          <!-- 添加用户 -->
           <el-row>
               <el-col :span="12">
               <el-input placeholder="请输入内容" v-model="user" class="input-with-select">
                 <el-button slot="append" icon="el-icon-search"></el-button>
               </el-input>
           </el-col>
           <el-col :span="6">
               <el-button type="primary" class="btn" @click="addGoods">添加用户</el-button>
           </el-col>
           </el-row>
           <!-- 表格 -->
           <el-table border style="width: 100%" :data="goodLists">
                 <el-table-column width="60"  type="index" label="序号"></el-table-column>
                 <el-table-column prop="goods_name" width="600" label="商品名称"></el-table-column>
                 <el-table-column prop="goods_price" width="100" label="商品价格"></el-table-column>
                 <el-table-column prop="goods_weight" width="100" label="商品重量"></el-table-column>
                 <el-table-column prop="add_time" width="150" label="创建时间"></el-table-column>
                 <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="editGood(scope.row)">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" @click="deleteGood(scope.row)">删除</el-button>
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
      <el-card v-else>
          <el-alert
    title="添加商品信息"
    type="info"
    show-icon
    center
    :closable="false">
  </el-alert>
     <el-steps :active="active" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs :tab-position="tabPosition" @tab-click="handleTabClick">
        <el-tab-pane label="基本信息">
            <!-- 基本信息 -->
            <el-form :label-position="labelPosition" label-width="50px" :model="basicInfoForm" :rules="editGoodRules">
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="basicInfoForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="basicInfoForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="basicInfoForm.goods_weight"></el-input>
                </el-form-item>
           </el-form>
        </el-tab-pane>
        <el-tab-pane label="商品参数">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
      </el-card>
      <!-- 编辑商品信息的对话框 -->
      <el-dialog
  title="编辑商品信息"
  :visible.sync="editGoodDialogVisible"
  width="50%">
  <el-form ref="editGoodRef" :model="editGoodForm" label-width="80px" :rules="editGoodRules">
  <el-form-item label="商品名称" prop="goods_name">
    <el-input v-model="editGoodForm.goods_name"></el-input>
  </el-form-item>
  <el-form-item label="商品价格" prop="goods_price">
    <el-input v-model="editGoodForm.goods_price"></el-input>
  </el-form-item>
  <el-form-item label="商品数量" prop="goods_number">
    <el-input v-model="editGoodForm.goods_number"></el-input>
  </el-form-item>
  <el-form-item label="商品重量" prop="goods_weight">
    <el-input v-model="editGoodForm.goods_weight"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editGoodDialogVisible= false">取 消</el-button>
    <el-button type="primary" @click="confirmEditGood">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {deleteGoods,editGoods,getAllGoods,selectGoodById} from '@/network/goods.js'
export default {
  data() {
    return {
        goodLists:[],
        user:'',
        total:0,
        query:{
            pagenum:1,
            pagesize:10
        },
        editGoodDialogVisible:false,
        editGoodForm:{},
        editGoodRules:{
            goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
            goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
            goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
            goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}]
        },
        addGoodDialogVisible:false,
        isAdd:false,
        active:1,
        tabPosition:'left',
        // 对齐方式
        labelPosition:'top',
        // 基本信息
        basicInfoForm:{
            goods_name:'',
            goods_info:'',
            goods_weight:''
        },
        
        
    }
  },
  methods: {
      async getAllGoods(){
          const {data:res}=await getAllGoods(this.query)
          this.total=res.data.total
          res.data.goods.forEach(item=>{
                 item.add_time=this.formatDate(item)
          })
          this.goodLists=res.data.goods
      },
    //   对日期进行格式化
      formatDate(row) {
            let date = new Date(parseInt(row.add_time));
            let Y = date.getFullYear() + '-';
            let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
            let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
            let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
      },
    //   监听pagesize的改变
      handleSizeChange(newSize){
          this.query.pagesize=newSize
          this.getAllGoods(this.query)

      },
    //   监听pagenum的改变
    handleCurrentChange(newNum){
         this.query.pagenum=newNum
         this.getAllGoods(this.query)
    },
    //编辑商品信息
   async editGood(good){
       console.log(good)
       const {data:res}=await selectGoodById(good.goods_id)
       this.editGoodForm=res.data
       console.log(res)
       this.editGoodDialogVisible=true
    },
    //   提交修改的商品信息
  async  confirmEditGood(){
      console.log(this.editGoodForm)
        this.editGoodDialogVisible=false
        const {data:res}=await editGoods(this.editGoodForm)
        console.log(res)
        if(res.meta.status!==200){
            return this.$message.error('修改商品信息失败')
        }
        this.getAllGoods(this.query)
        this.$message.success('修改商品信息成功')

    },
    // 删除商品
  async  deleteGood(good){
          const result=await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(result==='confirm'){
            const {data:res}=await deleteGoods(good.goods_id)
            if(res.meta.status!==200){
              this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getAllGoods(this.query)
            return
        }
         else if(result==='cancel') {
           this.$message({
            type: 'info',
            message: '已取消删除'
          }) 
         }
    },
    // 添加用户
    addGoods(){
       this.isAdd=true
    },
    // 确定添加商品信息
    confirmAddGood(){

    },
    handleTabClick(tab, event){
         console.log(tab, event);
    }
  },

  created() {
      this.getAllGoods()
  },
}
</script>
<style lang="less" scoped>
.el-row{
    margin-bottom:10px;
    .btn{
        margin-left: 10px;
    }
}
</style>