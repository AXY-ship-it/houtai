<template>
  <div class="attributes">
       <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-alert
            title="注意：只允许为第三级分类设置相关参数！"
            type="warning"
            show-icon>
       </el-alert>
       <div class="top">
         <span>选择商品分类: </span>
         <el-cascader
          v-model="selectParams"
          expandTrigger="hover"
          :options="paramsCateList"
          :props="paramsProps"
          @change="paramsChange">
       </el-cascader>
       </div>
        <el-tabs v-model="activeName">
          <!-- 动态参数面板 -->
            <el-tab-pane label="动态参数" name="many">
               <el-col :span=4>
                 <el-button type="primary"  :disabled="selectParams.length!==3?true:false" @click="addParams" class="m-margin">添加参数</el-button>
               </el-col>
               <el-table border style="width: 100%" :data="manyResultParams">
                 <!-- 展开行 -->
                 <el-table-column width="120" type="expand">
                     <template slot-scope="scope">
                       <el-tag class="tag" @close="deleteParamsTag(scope.row,index)" v-for="(item,index) in scope.row.attr_vals" :key="index" closable >{{item}}</el-tag>
                       <!-- tag输入框 -->
                       <el-input class="input-new-tag" size="small" ref="saveTagInput" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)" v-if="scope.row.inputVisable" v-model="scope.row.inputValue"></el-input>
                       <el-button v-else size="small" class="button-new-tag" @click="showInputTag(scope.row)">+NEW Tags</el-button>
                     </template>
                 </el-table-column>
                 <el-table-column width="120"  type="index" ></el-table-column>
                 <el-table-column prop="attr_name" width="400" label="属性名称"></el-table-column>
                 <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="editParams(scope.row)">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                  </template>
                 </el-table-column>
               </el-table>
            </el-tab-pane>
            <!-- 静态参数面板 -->
            <el-tab-pane label="静态参数" name="only">
              <el-col :span=4>
                 <el-button type="primary" :disabled="selectParams.length!==3?true:false" @click="addParams"  class="m-margin">添加参数</el-button>
               </el-col>
               <el-table border style="width: 100%" :data="onlyResultParams">
                 <!-- 展开行 -->
                 <el-table-column width="120" type="expand">
                     <template slot-scope="scope">
                       <el-tag  v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="deleteParamsTag(scope.row,index)">{{item}}</el-tag>
                       <el-input class="input-new-tag" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)" v-if="scope.row.inputVisable" v-model="scope.row.inputValue"></el-input>
                       <el-button v-else size="small" class="button-new-tag" @click="showInputTag(scope.row)">+NWE Tags</el-button>
                     </template>
                 </el-table-column>
                 <el-table-column width="120"  type="index" ></el-table-column>
                 <el-table-column prop="attr_name" width="400" label="属性3名称"></el-table-column>
                 <el-table-column  label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" @click="editParams(scope.row)">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" @click="deleteParams(scope.row)">删除</el-button>
                  </template>
                 </el-table-column>
               </el-table>
            </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 弹出编辑的对话框 -->
<el-dialog
  title="修改动态参数"
  :visible.sync="paramsDialogVisible"
  width="50%">
  <el-form ref="editParamsRef" :model="editParamsForm" label-width="80px" :rules="paramsRules">
  <el-form-item label="动态参数">
    <el-input v-model="editParamsForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="paramsDialogVisible= false">取 消</el-button>
    <el-button type="primary" @click="confirmEditParams">确 定</el-button>
  </span>
</el-dialog>
<!-- 添加参数的对话框 -->
<el-dialog
  :title="'添加'+activeTitle"
  :visible.sync="addPramsDialogVisible"
  width="50%">
  <el-form ref="addParamsRef" :model="addParamsForm" label-width="80px" :rules="paramsRules">
  <el-form-item :label="activeTitle" prop="attr_name">
    <el-input v-model="addParamsForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addPramsDialogVisible= false">取 消</el-button>
    <el-button type="primary" @click="confirmAddParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {confirmParamsEdit,addParams,getAttributes,getAllCateList,getParamsById,deleteParams} from '@/network/attributes.js'
export default {
  data() {
    return {
       paramsProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      paramsCateList:[],
      selectParams:[],
      activeName: 'many',
      //动态参数列表
      manyResultParams:[],
      // 静态参数列表
      onlyResultParams:[],
      paramsDialogVisible:false,
      paramsRules:{
        attr_name:[
          {required:true,message:'请输入参数值',trigger:'blur'}
        ]
      },
      editParamsForm:{},
      attrVals:[],
      addPramsDialogVisible:false,
      addParamsForm:{
        attr_name:''
      },
    }
  },
  computed:{
    activeTitle(){
      if(this.activeName==='many'){
        return '动态参数'
      }
      else return '静态参数'
    },
    // 计算分类ID
    cateId(){
      if(this.selectParams.length===3)
         return this.selectParams[2]
         else return null
       }
       
  },
  methods: {
    paramsChange(){
    },
    async getAttributes(){
      const {data:res}=await getAllCateList()
      if(res.meta.status!==200){
        this.$message.error('获取数据失败')
        return
      }
      this.paramsCateList=res.data
    },
    async paramsChange(paramsVlaue){
        this.selectParams=paramsVlaue
        if(this.selectParams.length===3){
          // this.cateId=this.selectParams[2]
          // 获取动态数据
          const {data:res}=await getAttributes(this.cateId,'many')
          // 获取静态数据
          const {data:res1}=await getAttributes(this.cateId,'only')
          res.data.forEach(item=>{
            item.attr_vals=item.attr_vals!==''?item.attr_vals.split(' '):[]
            item.inputVisable=false
            item.inputValue=''
          })
          res1.data.forEach(item=>{
            item.attr_vals=item.attr_vals!==''?item.attr_vals.split(' '):[]
          })
          this.onlyResultParams=res1.data
          this.manyResultParams=res.data
          // console.log(this.resultParams)
          return
        }
        else{
          this.selectParams=[]
          this.onlyResultParams=[]
          this.manyResultParams=[]
        }
    },
    //对参数进行编辑
  async  editParams(param){
    console.log(param)
       const attr_vals=param.attr_vals.join(',')
       const paramInfo={
         id:this.cateId,
         attrId:param.attr_id,
         attr_sel:param.attr_sel,
         attr_vals:attr_vals
       }
       this.paramsDialogVisible=true
       const {data:res}=await getParamsById(paramInfo)
       if(res.meta.status!==200){
         this.$message.error('获取数据失败')
         return
       }
       this.editParamsForm=res.data
        
    },
    // 确认对参数进行修改
    async confirmEditParams(){
      this.paramsDialogVisible=false
     const paramsEdit={id:this.cateId,...this.editParamsForm}
      const {data:res}=await confirmParamsEdit(paramsEdit)
      console.log(res)
      if(res.meta.status!==200){
        this.$message.error('修改参数信息失败')
        return 
      }
      this.$message.success('修改参数信息成功')
      this.paramsChange(this.selectParams)
    },
    //添加参数
    addParams(){
       this.addPramsDialogVisible=true
    },
    // 确认添加参数
  async confirmAddParams(){
         this.addPramsDialogVisible=false
         const {data:res}=await addParams(this.cateId,this.addParamsForm.attr_name,this.activeName)
         console.log(res)
         if(res.meta.status!==201){
           this.$message.error('添加参数失败')
           return
         }
         console.log(this.cateId)
         this.paramsChange(this.selectParams)
         this.$message.success('添加参数成功')
    },
    // 删除参数
    async deleteParams(scope){
       const result=await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(result==='confirm'){
            const {data:res}=await deleteParams(this.cateId,scope.attr_id)
            if(res.meta.status!==200){
              this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.paramsChange(this.selectParams)
            return
        }
         else if(result==='cancel') {
           this.$message({
            type: 'info',
            message: '已取消删除'
          }) 
         }
    },
    //删除tag
    deleteParamsTag(row,index){
     console.log(row,index)
     let tempVals=row.attr_vals.concat()
     tempVals.splice(index,1)
     row.attr_vals.splice(index,1)
     tempVals=tempVals.join(' ')
     const paramTag={
        id:this.cateId,
        ...row,
        attr_vals:tempVals
     }
      confirmParamsEdit(paramTag)
    },
    // 显示标签输入框
    showInputTag(param){
       param.inputVisable=true
       this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
    },
   async handleInputConfirm(param){
        if(param.inputValue.trim()===''){
          param.inputValue=''
          param.inputVisable=false
          return
        }
        param.attr_vals.push(param.inputValue.trim())
        param.inputValue=''
        param.inputVisable=false
        const {data:res}=await confirmParamsEdit({id:this.cateId,...param,attr_vals:param.attr_vals.join(' ')})
        console.log(res)
        if(res.meta.status!==200){
          this.$message.error('修改参数项失败')
          return
        }
        this.$message.success('修改参数项成功')
    }
  },
  created() {
    this.getAttributes()
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
.top{
  margin-top: 20px;
}
.tag{
  margin-right: 10px !important;
}
.m-margin{
  margin-bottom:10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>