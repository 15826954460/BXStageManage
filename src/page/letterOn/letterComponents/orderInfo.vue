<template>
  <div style="width:100%;" class="mb14">
    <div slot="header" class="clearfix mb14">
      <span class="fw f20">订单信息</span>
    </div>
    <div v-if="orderInfo"  class="pd10 card_bg">
      <p class="mb14">订单编号：{{orderInfo.orderId}}</p>
      <p class="mb14">申请时间：{{orderInfo.createTime | dateTime}}</p>
      <p class="mb14"
         v-if="Number.parseInt(type) === 2">
        申请金额：{{orderInfo.amount | toThousands}}
      </p>
      <p class="mb14"
         v-if="Number.parseInt(type) === 2">
        申请期数：{{orderInfo.term}}
      </p>
      <p class="mb14">贷款用途：{{orderInfo.purpose}}</p>
      <p class="mb14">渠道：{{orderInfo.channel}}</p>
      <p class="mb14">订单类型：{{orderInfo.orderType}}</p>
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
        orderInfo: {} // 订单信息
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      this.getOrderInfo()
    },
    methods: {
      // 获取订单信息
      getOrderInfo() {
        axios.post('audit/orderInfo', {orderId: this.orderId}).then(res => {
          if (res.data.code === 200) {
            this.orderInfo = res.data.body
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
//          alert('订单')
          this.orderId = this.$route.query.orderId
          this.type = this.$route.query.type
          this.getOrderInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
