<template>
  <div style="width:100%;" class="mb14"
       v-if="parseInt(type) === 2">
    <div slot="header" class="clearfix mb14">
      <span class="fw f20">额度信息</span>
    </div>
    <div v-if="creditAmountInfo" class="pd10 card_bg">
      <p class="mb14">
        <span class="yellow">授信时间（最新）：</span>
        <span> {{creditAmountInfo.creditTime | dateTime}}</span>
      </p>
      <p class="mb14">
        <span class="yellow">审批人（最新）：</span>
        <span>{{creditAmountInfo.auditor}}</span></p>
      <p class="mb14">
        <span class="yellow">授信额度（实时）：</span>
        <span> {{creditAmountInfo.creditAmount | toThousands}}</span></p>
      <p class="mb14">
        <span class="yellow">剩余可用额度（实时）：</span>
        <span>{{creditAmountInfo.remainCreditAmount | toThousands}}</span>
      </p>
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
        userId: this.$route.query.userId,
        creditAmountInfo: {} // 额度信息
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      this.getCreditAmountInfo()
    },
    methods: {
      // 获取额度信息
      getCreditAmountInfo() {
        if (parseInt(this.type) === 2) {
          axios.post('credit/creditAmountInfo', {userId: this.userId, orderId: this.orderId}
          ).then(res => {
            if (res.data.code === 200) {
              this.creditAmountInfo = res.data.body
            }
          })
        }
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.orderId = this.$route.query.orderId
          this.userId = this.$route.query.userId
          this.type = this.$route.query.type
          this.getCreditAmountInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
