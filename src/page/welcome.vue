<template>
    <p v-if="userLoginInfo" class="fw f18"
       style="color:#000;padding:20px">欢迎{{userLoginInfo.realName}}登录后台系统~~</p>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data: function () {
      return {}
    },
    computed: {
      ...mapState(['userLoginInfo'])
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
