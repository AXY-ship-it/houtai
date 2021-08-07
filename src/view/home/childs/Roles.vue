<template>
  <div class="roles">
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row>
  <el-col :span="4"> <el-button type="primary">添加用户</el-button></el-col>
    </el-row>
    <!-- 卡片视图区域 -->
    <el-table
    :data="roleData"
    style="width: 100%" border stripe>
    <el-table-column type="expand">
      <template slot-scope="scope">
         <el-row v-for="(item,index) in scope.row.children" :key="index" :class="{Topborder:index===0?false:true}">
            <el-col :span="5">
              <el-tag>{{item.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19" >
              <el-row v-for="(childItem,id) in item.children" :key="id" :class="{Topborder:id===0?false:true}">
                <el-col :span="6">
                  <el-tag type="success">{{childItem.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag type="warning" closable @close="removeTag(scope.row,item2.id)" v-for="(item2,id2) in childItem.children" :key="id2" :class="{Topborder:id2===0?false:true}">{{item2.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
         </el-row>
      </template>
    </el-table-column>
    <el-table-column label="序号" type="index">
    </el-table-column>
    <el-table-column  label="角色名称" prop="roleName">
    </el-table-column>
    <el-table-column  label="角色描述" prop="roleDesc">
    </el-table-column>
    <el-table-column  label="操作">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
         <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          <el-button size="mini" type="warning" icon="el-icon-setting" @click="addRights(scope.row)">分配权限</el-button>
         
      </template>
    </el-table-column>
    </el-table>
     <el-dialog
  title="分配权限"
  :visible.sync="rightDialogVisible" width="50%" @close="closeTree">
  <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" ref="tree"></el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="rightDialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="confirmSetRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {getRoles,removeTag,getAllRights,setRights} from '@/network/rights.js'
export default {
  name:'',
  components: {},
  props: {},
  data() {
    return {
      roleData:[],
      rightDialogVisible:false,
      rightsList:[],
      treeProps:{
        label:'authName',
        children:'children'
      },
      defkeys:[],
      roleId:''
    }
  },
  methods: {
    async getRolesList(){
      const {data:res}=await getRoles()
      if(res.meta.status!==200){
        this.$message.error('获取角色列表失败')
      }
      this.roleData=res.data
      console.log(res)
    },
    async removeTag(role,rightId){
      const confirmResult=await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
      if(confirmResult!=='confirm'){
         this.$message({
            type: 'info',
            message: '已取消删除'
          })
          return
      }
       this.$message({
            type: 'success',
            message: '删除成功!'
          })
        const res=await removeTag(role.id,rightId)
        if(res.status!==200){
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
        role.children=res.data.data
        // this.getRolesList()
        console.log(res.status)
        console.log(res)
    },
   async addRights(role){
     console.log('1111',role)
     this.roleId=role.id
      this.rightDialogVisible=true
      const {data:res}=await getAllRights()
      this.rightsList=res.data
      this.getLeafKeys(role,this.defkeys)
      // consol/
    },
    //通过递归的方式，获取角色下所有三级权限的id,并保存到defkeys中
    getLeafKeys(node,arr){
      if(!node.children){
         return arr.push(node.id)
      }
      node.children.forEach(item=>this.getLeafKeys(item,arr))
    },
    closeTree(){
      this.defkeys=[]
    },
 async  confirmSetRights(){
      var data=[...this.$refs.tree.getCheckedKeys(),...this.$refs.tree.getHalfCheckedKeys()]
      var rids=data.join(',')
      const {data:res}=await setRights(this.roleId,rids)
      if(res.meta.status!==200){
        this.$message.error('更改权限失败')
      }
      this.$message.success('更改权限成功')
      this.getRolesList()
      this.rightDialogVisible=false
    }
  },
  created() {
    this.getRolesList()
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.Topborder{
  border-top:1px solid #eee;
}
.el-row{
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-col{
  padding:10px;
}
.el-tag{
  margin:10px;
}
</style>