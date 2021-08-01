<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>



export default {
  name: 'App',
  components: {
  }
}
</script>

<style lang="less">
@import './assets/css/reset.css';
@import './assets/css/fonts/iconfont.css';
@import './assets/css/base.css';
#app{
  height:100%;
  width: 100%;
}
</style>
