<template>
  <div style="width:100%;">
    <div slot="header" class="clearfix mb14">
      <span class="fw f20 error">风险信息</span>
    </div>
    <div class="card_bg pd10">
      <div>
        <p class="yellow mb14">风险规则：</p>
        <p class="error mb14" v-if="riskInfo" v-for="item in riskInfo">{{item}}</p>
        <span style="color:#909399" v-else>暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data: function () {
      return {
        orderId: this.$route.query.orderId,
        type: this.$route.query.type,
        riskInfo: null // 风险信息
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      this.getRiskInfo()
    },
    methods: {
      // 获取风险信息
      getRiskInfo() {
        axios.post('audit/riskInfo', {orderId: this.orderId}).then(res => {
          if (res.data.code === 200) {
            if (res.data.body && res.data.body.length > 0) {
              this.riskInfo = res.data.body
            } else {
              this.riskInfo = ''
            }
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
//          alert('风险')
          this.orderId = this.$route.query.orderId
          this.getRiskInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
