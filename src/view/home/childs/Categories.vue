<template>
  <div class="categories">
    <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row>
           <el-col :span="4"><el-button type="primary" @click="addCategories">添加分类</el-button></el-col>
        </el-row>
        <!-- 表格区域 -->
        <tree-table :data="cateList" :columns="columns" :selection-type="false" :expand-type="false" show-index border class="treetable">
          <!-- 是否有效，作用域插槽 -->
           <template slot="isok" slot-scope="scope">
             <i class="el-icon-success" v-if="scope.row.cat_delete" style="color:lightgreen"></i>
             <i class="el-icon-error" v-else style="color:red"></i>
           </template>
           <!-- 排序 -->
           <template slot="order" slot-scope="scope">
             <el-tag  v-show="scope.row.cat_level===0">一级</el-tag>
             <el-tag type="success" v-show="scope.row.cat_level===1">二级</el-tag>
             <el-tag type="warning" v-show="scope.row.cat_level===2">三级</el-tag>
           </template>
           <template slot="action" slot-scope="scope">
             <el-button type="primary" icon="el-icon-edit" @click="editCate(scope.row.cat_id)">编辑</el-button>
             <el-button type="danger" icon="el-icon-delete" @click="confirmDelete(scope.row.cat_id)">删除</el-button>
           </template>
        </tree-table>
        <el-pagination @size-change="handleSizeChange"
      @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[10, 20, 30, 40]"  :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" >
       </el-pagination>
      </el-card>
      <!-- 添加编辑对话框 -->
      <el-dialog
  title="编辑分类"
  :visible.sync="editDialogVisible"
  width="50%" @close="editDialogClose">
  <el-form  :model="editForm" ref="editRef" label-width="80px" :rules="editRules">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="confirmEdit">确 定</el-button>
  </span>
</el-dialog>
      <!-- //添加分类的对话框 -->
      <el-dialog
  title="添加分类"
  :visible.sync="cateDialogVisible"
  width="50%" @close="addCateClose">
  <el-form ref="addCateForm" :model="cateForm" label-width="80px" :rules="rules">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="cateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类" prop="cat_level">
     <el-cascader
    v-model="selectOption"
    expandTrigger="hover"
    :options="parentCateList"
    :props="cascaderProps"
    @change="parenthandleChange"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {getCategoriesList,getAllCate,addCateParent,selectCateById,confirmEditCate,deleteCate} from '@/network/categories.js'
export default {
  name:'',
  components: {},
  props: {},
  data() {
    return {
      cateList:[],
      // 总数据条数
      total:0,
      columns:[{
       label: '分类名称',
       prop: 'cat_name',
       width: '100px',
      },
      {
       label: '是否有效',
      //  表示将当前定义为模板列
       type:'template',
      // 表示当前这一列使用模板名称
       template: 'isok',
       width: '100px',
      },
      {
       label: '排序',
       type:'template',
      // 表示当前这一列使用模板名称
       template:'order',
       width: '100px',
      },
      {
       label: '操作',
       type:'template',
       template:'action',
       width: '200px',
      }
      ],
      queryInfo:{
        type:[1,2,3],
        pagenum:1,
        pagesize:10
      },
      cateForm:{
        cat_pid:0,
        cat_name:'',
        //默认要添加的说一级分类
        cat_level:0
      },
      parentCateList:[],
      rules:{
        cat_name:[
          {required:true,message:'请输入分类名称',tigger:'blur'}
        ]
      },
      cascaderProps:{
        value:'cat_id',
        label:'cat_name',
        children:'children'
      },
      selectOption:[],
      cateDialogVisible:false,
      editDialogVisible:false,
      editForm:{},
      editRules:{
        cat_name:[
          {required:true,message:'输入不能为空',trigger:'blur'}
        ]
      }
    };
  },
  watch: {},
  computed: {},
  methods: {
    // 获取商品分类数据
   async  getCategoriesList(){
          const {data:res}=await getCategoriesList(this.queryInfo)
          this.cateList=res.data.result
          this.total=res.data.total
     },
     //监听pagesize的改变
     handleSizeChange(newSize){
       this.queryInfo.pagesize=newSize
       this.getCategoriesList()
     },
     //监听当前页的改变
     handleCurrentChange(newNum){
       this.queryInfo.pagenum=newNum
       this.getCategoriesList()
     },
   async  addCategories(){
    //  获取父级数据列表
       const {data:res}=await getAllCate()
       if(res.meta.status!==200){
         this.$message.error("获取数据列表失败")
       }
       this.parentCateList=res.data
       this.cateDialogVisible=true

     },
   async   addCate(){
       const {data:res}=await addCateParent(this.cateForm)
         if(res.meta.status!==201){
           this.$message.error('添加分类失败')
         }
         this.$message.success('添加分类成功')
         this.getCategoriesList()
         this.cateDialogVisible=false
     },
    parenthandleChange(){
       if(this.selectOption.length>0){
         this.cateForm.cat_pid=this.selectOption[this.selectOption.length-1]  
         this.cateForm.cat_level=this.selectOption.length
       }
       else{
         this.cateForm.cat_pid=0
         this.cateForm.cat_level=0
       }
        
       
     },
     addCateClose(){
       this.cateDialogVisible=false
       this.$refs.addCateForm.resetFields()
      this.selectOption=[]
      this.cateForm.cat_pid=0
      this.cateForm.cat_level=0
     },
    async editCate(id){
      this.editDialogVisible=true
       const {data:res}=await selectCateById(id)
       if(res.meta.status!==200){
         this.$message.error('获取数据失败')
       }
       this.editForm=res.data
     },
     editDialogClose(){
       this.editDialogVisible=false
       this.$refs.editRef.resetFields()
     },
     //确认编辑分类
    async confirmEdit(){
       this.editDialogVisible=false
       const {data:res}=await confirmEditCate(this.editForm)
       this.getCategoriesList()
       if(res.meta.status!==200){
         this.$message.error('修改分类失败')
       }
       this.$message.success('修改分类成功')
     },
     //删除分类
     async confirmDelete(id){
      const result=await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(result==='confirm'){
            const {data:res}=await deleteCate(id)
            if(res.meta.status!==200){
              this.$message.error('删除失败')
            }
            this.$message.success('删除成功')
            this.getCategoriesList()
            return
        }
         else if(result==='cancel') {
           this.$message({
            type: 'info',
            message: '已取消删除'
          }) 
         }
          
       
     }

     //弹出添加分类的对话框
  },
  created() {
    this.getCategoriesList()
  }
};
</script>
<style lang="less" scoped>
.treetable{
  margin-top:20px;
}
</style>