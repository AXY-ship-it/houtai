<template>
  <div class="">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
     </el-breadcrumb>
    
     <el-card class="box-card">
       <el-row :gutter="20">
          <el-col :span="8">
              <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUsers">
               <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
              </el-input>
           </el-col>
          <el-col :span="4">
              <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
             
              <!-- 添加用户头部区域 -->
<el-dialog title="添加用户" :visible.sync="dialogFormVisible" @close="addFormClose">
  
  <!-- 内容主体区域 -->
  <el-form :model="form" :rules="addRules" ref="addFormRef">
    <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" :label-width="formLabelWidth"  prop="password">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" :label-width="formLabelWidth"  prop="email">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="手机号" :label-width="formLabelWidth"  prop="mobile">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <!-- 底部区域 -->
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary"  @click="addUser">确 定</el-button>
  </div>
</el-dialog>
<!-- 修改用户信息 -->
<el-dialog
  title="修改用户信息"
  :visible.sync="changedialogVisible"
  width="50%">
  <el-form ref="form" :model="changeForm" label-width="80px">
  <el-form-item label="用户名">
    <el-input v-model="changeForm.username" disabled></el-input>
  </el-form-item>
    <el-form-item label="邮箱">
    <el-input v-model="changeForm.email"></el-input>
  </el-form-item>
    <el-form-item label="手机号">
    <el-input v-model="changeForm.mobile"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="changedialogVisible= false">取 消</el-button>
    <el-button type="primary" @click="confirmEditUser(changeForm.id)">确 定</el-button>
  </span>
</el-dialog>
        </el-col>
       </el-row>
       <el-table
    :data="userList"
    style="width: 100%">
    <el-table-column
      label="序号"
      width="60">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.$index+1}}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="姓名"
      width="180">
      <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.username }}</el-tag>
          </div>
      </template>
    </el-table-column>
    <el-table-column label="邮箱" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.email }}</el-tag>
          </div>
      </template>
    </el-table-column>
    <el-table-column label="电话" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.mobile }}</el-tag>
          </div>
      </template>
    </el-table-column>
    <el-table-column label="角色" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">{{ scope.row.role_name }}</el-tag>
          </div>
      </template>
    </el-table-column>
     <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <div slot="reference" class="name-wrapper">
            <el-switch v-model="scope.row.mg_state"  active-color="#13ce66" inactive-color="#ff4949" @change="updateState(scope.row)"></el-switch>
          </div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEditUser(scope.row.id)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDeleteUser(scope.row.id)">删除</el-button>
        <el-button size="mini" @click="handleRole(scope.row)">分配角色</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
       @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1, 2, 3, 5]"
      :page-size="queryInfo.pagesize"
      :current-page="queryInfo.pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="分配角色"
  :visible.sync="setRoleDialogVisible"
  width="50%">
  <p>当前的用户:{{currentUser.username}}</p>
  <p>当前的角色:{{currentUser.role_name}}</p>
  <span>分配新角色:</span>
  <el-select v-model="value" placeholder="请选择">
    <el-option
      v-for="item in userList"
      :key="item.id"
      :label="item.role_name"
      :value="item.id">
    </el-option>
  </el-select>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible=false">取 消</el-button>
    <el-button type="primary" @click="confirmSetRole">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import {getUsers,updateUserState,addUsers,selectById,editById,deleteUser} from '@/network/home.js'
// import Login from '../../profile/Login.vue';
export default {
  name:'',
  // components: {Login},
  props: {},
  data() {
    // 验证邮箱
    // var checkEmail=(rule,value,cb)=>{
    //   const regEmail=/^([a-zA-Z]|[0-9])(|)+@[a-zA-Z0-9]+([a-zA-Z]{2,4})$/
    //   if(regEmail.test(value)){
    //     return cb()
    //   }
    //    cb(new Error("请输入合法的邮箱"))
    // }
    // var checkPhone=(rule,value,cb)=>{
    //   const regPhone=/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9]){8}$/
    //   if(regPhone.test(value)){
    //     return cb()
    //   }
    //   cb(new Error('请输入合法的电话号码'))
    // }
    return {
        value:'',
        currentUser:{},
        setRoleDialogVisible:false,
        userList:[],
        total:0,
        queryInfo:{
           query:'',
           pagesize:2,
           pagenum:1
        },
         dialogFormVisible: false,
        form: {
          username:'',
          password:'',
          email:'',
          mobile:''
        },
        addRules:{
            username:[
              {required:true,message:"请输入用户名",trigger:'blur'},
              {min:2,max:10,message:"用户名的长度在2-10位之间",trigger:'blur'}
            ],
            password:[
              {required:true,message:"请输入密码",trigger:'blur'},
              {min:2,max:10,message:"密码的长度在2-10位之间"}
            ],
            email:[
              {required:true,message:"请输入邮箱",trigger:'blur'},
              // {validator:checkEmail,trigger:'blur'}
            ],
            mobile:[
              {required:true,message:"请输入电话号码",trigger:'blur'},
              // {validator:checkPhone,trigger:'blur'}
            ]
        },
        formLabelWidth: '120px',
        changeForm:{},
        changedialogVisible:false
        
    };
  },
  methods: {
      async getUsers(){
          const {data:res}=await getUsers(this.queryInfo.query,this.queryInfo.pagenum,this.queryInfo.pagesize)
          this.userList=res.data.users
          this.total=res.data.total
          console.log('user',res)
      },
      //监听switch状态的改变，同步到数据库中
      updateState(userInfo){
         updateUserState(userInfo)
      },
      handleSizeChange(newSize){
        this.queryInfo.pagesize=newSize
        this.getUsers()
      },
      handleCurrentChange(newChange){
        this.queryInfo.pagenum=newChange
        this.getUsers()
      },
      addFormClose(){
        this.$refs.addFormRef.resetFields()
      },
     addUser(){
        this.$refs.addFormRef.validate(async vali=>{
          if(!vali){
            return;
          }
         const {data:res}=await addUsers(this.form)
          if(res.meta.status===201){
            this.$message.success("添加用户成功")
          }
          else{
            this.$message.error("添加用户失败")
          }
          //隐藏添加用户的对话框
          this.dialogFormVisible=false
          this.getUsers()

        })
      },
    async handleEditUser(id){
         this.changedialogVisible=true
         const {data:res}=await selectById(id)
         console.log(res)
         this.changeForm=res.data
      },
   
   async handleDeleteUser(id){
       const confirmresult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        if(confirmresult==='confirm')
        {
          //  deleteUser(id).then(res=>console.log(res))
           const {data:res}=await deleteUser(id)
           if(res.meta.status!==200){
             this.$message({
            message: '删除失败!'
          })
          }
          else{
            this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUsers()
           }
        }
        else if(confirmresult==='cancel'){
            this.$message({
            type: 'info',
            message: '已取消删除'
          }) 
        } 
  },
  handleRole(currentUser){
    this.currentUser=currentUser
    this.setRoleDialogVisible=true
  },
  confirmSetRole(){
    this.setRoleDialogVisible=false
  },
 async confirmEditUser(id){
    const {data:res}=await editById(id,this.changeForm.email,this.changeForm.mobile)
    if(res.meta.status!==200){
      this.$message.error('更新用户失败')
    }
    this.changedialogVisible=false
    this.getUsers()
    this.$message.success('更新用户成功')
}
  },
  created(){
    this.getUsers()
  }
}
</script>
<style lang="less" scoped>
.el-pagination{
    margin-top: 10px;
}
</style>