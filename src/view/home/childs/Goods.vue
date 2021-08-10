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
               <el-input placeholder="请输入内容" v-model="query.query" class="input-with-select"  @keyup.enter.native="getAllGoods" clearable @clear="getAllGoods">
                 <el-button slot="append" icon="el-icon-search" @click="getAllGoods"></el-button>
               </el-input>
           </el-col>
           <el-col :span="6">
               <el-button type="primary" class="btn" @click="addGoods">添加用户</el-button>
           </el-col>
           </el-row>
           <!-- 表格 -->
           <el-table border style="width: 100%" :data="goodLists" height="500">
                 <el-table-column width="60"  type="index" label="序号"></el-table-column>
                 <el-table-column prop="goods_name" width="600" label="商品名称"></el-table-column>
                 <el-table-column prop="goods_price" width="100" label="商品价格"></el-table-column>
                 <el-table-column prop="goods_weight" width="100" label="商品重量"></el-table-column>
                 <el-table-column prop="add_time" width="150" label="创建时间">
                   <template slot-scope="scope">
                     {{scope.row.add_time|formatDate}}
                   </template>
                 </el-table-column>
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
     <el-steps :active="active-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form label-width="100px" :model="addForm" :rules="addGoodsRules" label-position="top" ref="addFormRef">
        <el-tabs :tab-position="tabPosition" @tab-click="handleTabClick" v-model="active" :before-leave="beforeTabLeave">
        <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息 -->
                <el-form-item label="商品名称" prop="goods_name">
                    <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="addForm.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="addForm.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="addForm.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                   <el-cascader v-model="addForm.goods_cat" :options="goodsCate" :props="cateProps" expandTrigger='hover' clearable
                  @change="handleChange"></el-cascader>
                </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="item in addForm.attrs" :key="item.attr_id" :label="item.attr_name">
               <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="param" v-for="(param,index) in item.attr_vals" :key="index" border></el-checkbox>
               </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="attr.attr_name"  v-for="attr in goods_attr" :key="attr.attr_id">
                    <el-input v-model="attr.attr_vals"></el-input>
                </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="https://test.qhhz.xyz:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :headers="headerObj"
            list-type="picture"
            :on-success="handleSuccess">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">
            </quill-editor>
            <el-button style="margin-top:10px" type="primary" @click="add">添加商品</el-button>
        </el-tab-pane>
    </el-tabs>
      </el-form>
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
<!-- 图片预览 -->
<el-dialog
  title="预览"
  :visible.sync="picDialogVisible"
  width="50%">
  <img :src="picPreview" alt="" class="pic"/>
</el-dialog>
  </div>
</template>

<script>
import {deleteGoods,editGoods,getAllGoods,selectGoodById,addGoods} from '@/network/goods.js'
import {getAllCateList,getAttributes} from '@/network/attributes.js'
import _ from 'lodash'
export default {
  data() {
    return {
        goodLists:[],
        user:'',
        total:0,
        query:{
            query:'',
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
        active:'0',
        tabPosition:'left',
        addGoodsRules:{
            goods_name:[{required:true,message:'请输入商品名称',trigger:'blur'}],
            goods_price:[{required:true,message:'请输入商品价格',trigger:'blur'}],
            goods_number:[{required:true,message:'请输入商品数量',trigger:'blur'}],
            goods_weight:[{required:true,message:'请输入商品重量',trigger:'blur'}],
            goods_cat:[{required:true,message:'请输入商品分类',trigger:'blur'}]
        },
        addForm:{
          goods_name:'',
          goods_price:0,
          goods_weight:0,
          goods_number:0,
          goods_cat:[],
          // 商品参数
          attrs:[],
          // 图片上传到后台时的暂时存放路径
          pics:[],
          goods_introduce:''
        },
         // 商品属性
          goods_attr:[],
        cateProps:{
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        // 图片上传的请求头
        headerObj:{
          Authorization:window.sessionStorage.getItem('token')
        },
        // 图片预览
        picPreview:'',
        picDialogVisible:false
        
    }
  },
  methods: {
    //获取所有商品分类
      async getAllCates(){
          const {data:res}=await getAllCateList()
          console.log(res)
          if(res.meta.status!==200){
            this.$message.error('获取分类数据失败')
            return
          }
          this.goodsCate=res.data
          console.log(this.goodsCate)
              
      },
      async getAllGoods(){
          const {data:res}=await getAllGoods(this.query)
          this.total=res.data.total
          this.goodLists=res.data.goods
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
    // 添加商品时选中分类
    handleChange(){
       if(this.addForm.goods_cat.length!==3){
         this.addForm.goods_cat=[]
         this.$message.error('只允许选中三级商品分类')
       }
    },
    // 阻止tab页签跳转
    beforeTabLeave(activeName,oldName){
      console.log(activeName,oldName)
      if(oldName==='0'&&this.addForm.goods_cat.length!==3){
        this.$message.error('请完善商品信息')
        return false
      }

    },
   add(){
        this.$refs.addFormRef.validate(async vali=>{
          if(!vali){
           return this.$message.error('请完善商品信息')
          }
          const info=_.cloneDeep(this.addForm)
          info.goods_cat=info.goods_cat.join(',')
          console.log(info)
          const {data:res}=await addGoods(info)
          console.log(info,res)
          if(res.meta.status!==201){
           return this.$message.error('添加商品失败')
          }
          this.getAllGoods()
          this.$message.success('添加商品成功')
          this.isAdd=false
          
        })
    },
    // 处理tab点击时的请求事件,
   async handleTabClick(){
       if(this.active==='1'){
         const {data:res}=await getAttributes(this.addForm.goods_cat[2],'many')
        if(res.meta.status!==200){
          this.$message.error('获取参数数据失败')
          return
        }
        res.data.forEach(item=>{
          item.attr_vals=item.attr_vals===''?[]:item.attr_vals.split(' ')
        })
        this.addForm.attrs=res.data
        console.log(this.addForm.attrs)
       }
       else if(this.active==='2'){
         const {data:res}=await getAttributes(this.addForm.goods_cat[2],'only')
         console.log(res)
         if(res.meta.status!==200){
           this.$message.$error('获取商品属性失败')
           return
         }
         this.goods_attr=res.data
       }
    },
    // 处理图片预览时的操作
    handlePreview(file){
      this.picPreview=file.url
      this.picDialogVisible=true
      console.log(file)
    },
    // 处理图片移除时 的操作
    handleRemove(file){
      // 获取将要移除的图片的暂时路径
      const picTemp=file.response.data.tmp_path
     const i=this.addForm.pics.findIndex(x=>{
        x.pic=picTemp
      })
      this.addForm.pics.splice(i,1)
    },
    // 监听图片上传成功后返回的数据，用response接收
    handleSuccess(response){
      const picInfo={pic:response.data.tmp_path}
      this.addForm.pics.push(picInfo)
      console.log(response)
    }
  },

  created() {
      this.getAllGoods()
      this.getAllCates()
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
.pic{
  width:100%;
  height:100%;
}
</style>