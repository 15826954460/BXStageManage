<template>
  <el-card style="width:100%;" class="big_background" v-if="handleDetail">
    <p class="mb14 f18 fw" v-html="Number.parseInt(method) === 0 ? '放款异常' : '还款异常'"></p>
    <div class="rel">
      <p class="f14 mb14" style="height:32px;line-height:32px;">
        异常类型：<span class="error">{{handleDetail.subAbnomalTypeStr}}</span>
      </p>
      <handelBtn></handelBtn>
    </div>
    <el-card>
      <p class="f14 fw mb8">交易信息</p>
      <ul v-if="handleDetail"
          style="background:#F9F9F9; width:100%;" class="pd10 mb8 flex">
        <li class="w50">
          <div class="mb8 f14 pr20" v-show="Number.parseInt(method) === 1">
            账单编号：
            <span style="word-break:break-all; line-height: 25px;">
              {{handleDetail.loanBills}}
            </span>
          </div>
          <p class="mb8 f14">借款编号：{{handleDetail.loanOrderNo}}</p>
          <p class="mb8 f14">用户ID：{{handleDetail.userId}}</p>
          <p class="mb8 f14">姓名：{{handleDetail.realName}}</p>
          <p class="mb8 f14">手机号：{{handleDetail.mobile}}</p>
          <p class="mb8 f14">预留手机号：{{handleDetail.reserveMobile}}</p>
          <p class="mb8 f14">银行卡号：{{handleDetail.bankCardNo}}</p>
          <p class="mb8 f14">开户行：{{handleDetail.bankName}}</p>
        </li>
        <li>
          <p class="mb8 f14">交易金额：{{handleDetail.amount | toThousands}}</p>
          <p class="mb8 f14">支付渠道：{{handleDetail.channelName}}</p>
          <p class="mb8 f14">支付单号：{{handleDetail.payNo}}</p>
          <p class="mb8 f14">提交时间：{{handleDetail.commitTime | dateTime}}</p>
          <p class="mb8 f14">回调时间：{{handleDetail.callbackTime | dateTime}}</p>
          <p class="mb8 f14">支付描述：{{handleDetail.description}}</p>
        </li>
      </ul>
      <p class="f14 fw mb8">客服处理详情</p>
      <div style="background:#F9F9F9" class="pd10">
        <p class="f14 mb8">处理状态：<span>{{handleDetail.stateStr}}</span></p>
        <p class="f14 mb8">处理人：<span>{{handleDetail.operator}}</span></p>
        <p class="f14 mb8">处理记录：</p>
        <handleRecords :id="id" :type="0" :heigth="false"></handleRecords>
      </div>
    </el-card>
  </el-card>
</template>
<script>
  import axios from 'axios'
  import {mapActions, mapState} from 'vuex'
  import handleRecords from '../../components/handleRecords.vue'
  import handelBtn from './hadleComponent/handleBtn.vue'

  export default {
    data: function () {
      return {
        method: this.$route.query.method,
        id: this.$route.query.id
      }
    },
    computed: {
      ...mapState(['fixedField', 'handleDetail'])
    },
    mounted() {
      axios.post('cs/getCSOperatorDetail', {id: this.$route.query.id, type: this.$route.query.type}).then(res => {
        if (res.data.code === 200) {
          this.$store.commit('setHandleDetail', res.data.body)
        }
      })
    },
    components: {handleRecords, handelBtn},
    methods: {
      ...mapActions(['getHandleDetail'])
    }
  }
</script>
<style lang="less">
  .w50 {
    width: 50%;
  }
</style>
