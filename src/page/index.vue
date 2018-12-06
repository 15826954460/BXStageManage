<template>
  <div class="index_wrapper">
    <!-- 头部组件 -->
    <div class="header">
    </div>
    <div class="menu_top">
      <v-header></v-header>
    </div>

    <div class="section">
      <!-- 左侧导航栏组件 -->
      <div class="index_left">
      </div>
      <div class="nav">
        <v-nav></v-nav>
      </div>
      <router-view/>
    </div>

    <update-password></update-password>
  </div>
</template>

<script async>
  import vHeader from '../components/header.vue'
  import vNav from '../components/leftNav.vue'
  import updatePassword from '../components/updatePassword.vue'

  export default {
    data: function () {
      return {
        dialogFormVisible: false
      }
    },
    methods: {
    },
    components: {
      vHeader, vNav, updatePassword
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .index_wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-top: 60px;
  }

  .head {
    height: 60px;
    flex-shrink: 0;
  }

  .menu_top {
    position: fixed;
    top: 0;
    width: 100vw;
    z-index: 2000;
  }

  .nav {
    position: fixed;
    width: 200px;
    height: 100vh;
    top: 60px;
  }

  .section {
    width: 100%;
    flex: 1;
    display: flex;
    .index_left {
      width: 200px;
      flex-shrink: 0;
      background-color: #f2f2f2;
    }
    .index_right {
      background-color: #f2f2f2;
      flex: 1;
    }
  }
</style>
