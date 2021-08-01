<template>
  <div class="login-page">
    <div class="loginForm">
      <div class="logo">
        <img src="@/assets/img/userLogo.jpg" />
      </div>
      <el-form
        ref="form"
        :model="loginForm"
        label-width="0px"
        class="form"
        :rules="rules"
      >
        <el-form-item prop="name">
          <el-input v-model="loginForm.name" placeholder="请输入您的用户账号" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="psd">
          <el-input v-model="loginForm.psd" type="password" placeholder="请输入您的用户密码" prefix-icon="iconfont icon-password">
              <span class="iconfont icon-eye">zs</span>
          </el-input>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
// import {ElForm} from 'element-ui'
import { getLogin } from "@/network/login.js";
export default {
  name: "Login",
  components: {},
  props: {},
  data() {
    return {
      loginForm: {
        name: "",
        psd: "",
      },
      rules: {
        name: [
          //   { required: true, message: "请输入您的账号", trigger: "blur" },
          {
            min: 5,
            max: 11,
            message: "长度在 5 到 11 个字符",
            trigger: "blur",
          },
        ],
        psd: [
          //   { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 8, message: "长度在 5 到 8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  watch: {},
  computed: {},
  methods: {
    login() {
      this.$refs.form.validate(async (vali) => {
        if (!vali) return;
        const {data: res } = await getLogin(
          this.loginForm.name,
          this.loginForm.psd
        )
        if (res.meta.status === 200) {
          window.sessionStorage.setItem("token", res.data.token);
          this.$message.success("登录成功");
          this.$router.push("/home");
        } else {
          this.$message.error("用户名或密码错误");
        }
      });
    },
    reset() {
      this.$refs.form.resetFields();
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.login-page {
  width: 100%;
  height: 100%;

  .loginForm {
    background-color: #fff;
    width: 430px;
    height: 350px;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0 10px #eee;
    padding: 0 20px;
    .logo {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid #eee;
      padding: 10px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
      img {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 50%;
      }
    }
    .form {
      margin-top: 100px;
      width: 100%;
      .btn {
        text-align: center;
        margin-top: 10px;
      }
    }
  }
}
</style>
