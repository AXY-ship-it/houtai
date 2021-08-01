<template>
  <el-container class="home-container">
    <el-header>
      <h1>电商后台管理系统</h1>
      <div><el-button type="info" round @click="signOut">退出</el-button></div>
    </el-header>
    <el-container>
      <el-aside :width="isSide?'64px':'200px'" :class="{side:isSide}">
        <div @click="toggleBtn" class="toggle-btn">|||</div>
         <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#030A42"
      text-color="#fff"
      :unique-opened=true
      :collapse="isSide"
      :collapse-transition="isSide"
      router
      active-text-color="#409EFF">
      <el-submenu :index="item.order+''" v-for="item in asideMenu" :key="item.id">
          <!-- 一级菜单的模板区域 -->
        <template slot="title">
            <!-- 图标 -->
          <i :class="iconlist[item.order]"></i>
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="itemM.path+''" v-for="itemM in item.children" :key="itemM.id"> 
            <template slot="title">
            <!-- 图标 -->
           <i class="el-icon-menu"></i>
           <span>{{itemM.authName}}</span>
        </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <el-main>
        
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {getMenu} from '@/network/home.js'
export default {
  name: "",
  components: {},
  props: {},
  data() {
    return {
      asideMenu:[],
      iconlist:{
        1:'iconfont icon-user2',
        2:'iconfont icon-quanxian',
        3:'iconfont icon-shangpin',
        4:'iconfont icon-emaxcitygerenxinxitubiaoji03',
        5:'iconfont icon-shuju'
      },
      isSide:false
    }

  },
  watch: {},
  computed: {},
  methods: {
     async getMenu(){
        const {data:res}=await getMenu()
        this.asideMenu=res.data
        console.log(res.data)
      },
      signOut(){
        window.sessionStorage.clear()
        this.$router.push("/login")
      },
      toggleBtn(){
        this.isSide=!this.isSide
      }
  },
  created() {
      this.getMenu()
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #030A42;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h1{
      font-size: 30px;
      color:#fff;
    }
  }
  .el-aside {
    background-color: #030A42;
    .toggle-btn{
      color:#fff;
      text-align: center;
      cursor: pointer;
    }
    .el-menu{
      border-right:none;
    }
  }
  .el-main {
  }
}
i{
  margin-right:8px;
  font-size: 18px;
}

</style>
