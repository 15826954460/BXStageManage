<template>
  <el-dialog :title="dialogWrapperOne ? '还款确认' : ''"
             :visible.sync="dialogBackOne" width="500px"
            top="20%" @close="close">
    <div v-if="backOne" v-show="dialogBackOne && dialogWrapperOne">
      <div class="">
        <p class="gray tc">
          <span class="inb_span" style="text-align: center">还款金额</span>
        </p>
        <p class="f24 mb8 mt8 tc">
          <span calss="">{{backOne.repayAmount | toThousands}}</span>
        </p>
        <p class="mb8 pa_l150">
          <span class="gray">还款至商户号：</span>
          <!-- :v-html="backOne.funder === 1 ? '淮南' : '荷包'"-->
          <span>{{backOne.funder}}</span>
        </p>
        <p class="mb8 pa_l150">
          <span class="gray">还款支付渠道：</span>
          <el-select v-model="withholdChannel" size="small">
            <el-option
              v-for="item in backOne.withholdChannels"
              :key="item.withholdChannel"
              :label="item.withholdChannelName"
              :value="item.withholdChannel">
            </el-option>
          </el-select>
        </p>
      </div>
      <div slot="footer" class="dialog-footer tr pr20">
        <el-button @click="close" size="small">取消</el-button>
        <el-button type="primary" @click="sure(backOne)" size="small">确定</el-button>
      </div>
    </div>

    <div v-show="dialogWrapperTwo">
      <div class="tc">
        <p class="f24 mb8 mt8 flex h80 lh80 jusc">
          <span class="iconfont success mr24">&#xe62c;</span>
          <span class="success f24">还款提交成功</span>
        </p>
        <p class="mb8">还款结果以支付订单结果为准</p>
        <p class="mb8"><span>交易编号：{{insertOrderNo}}</span></p>
      </div>
      <div slot="footer" class="dialog-footer tr pr20">
        <el-button @click="lookPayOrder" size="small">查看支付订单</el-button>
        <el-button type="primary" @click="close" size="small">关闭</el-button>
      </div>
    </div>

    <div v-show="dialogWrapperThree">
      <div class="tc">
        <p class="f24 mb8 mt8 flex h80 lh80 jusc">
          <span class="iconfont error mr24">&#xe64a;</span>
          <span class="error f24">还款提交失败</span>
        </p>
        <p class="mb8" v-show="insteadOrderId"><span>交易编号：{{insertOrderNo}}</span></p>
        <p class="mb8"><span>失败原因：{{errorReason}}</span></p>
      </div>
      <div slot="footer" class="dialog-footer tr pr20">
        <el-button type="primary" @click="close" size="small">关闭</el-button>
      </div>
    </div>

  </el-dialog>

</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'

  export default {
    props: ['casePage'],
    data: function () {
      return {
        orderId: this.$route.query.orderId,
        dialogWrapperOne: true,
        dialogWrapperTwo: false,
        dialogWrapperThree: false,
        errorReason: '', // 提交失败原因
        insteadOrderId: '', // 代付订单号（第三方）
        insertOrderNo: '', // 内部交易单号
        withholdChannel: '',
        allowPost: true
      }
    },
    computed: {
      ...mapState(['backOne']),
      dialogBackOne: {
        get: function () {
          if (this.$store.state.backOne.withholdChannels) {
            this.withholdChannel = this.$store.state.backOne.withholdChannels[0].withholdChannel
          }
          return this.$store.state.dialogBackOne
        },
        set: function () {
        }
      }
    },
    methods: {
      ...mapActions(['getLoanDetailInfo', 'getLoanDetailPlan', 'getCaseDataOverDueList', 'getOverTimeInfo', 'caseSpeed']),
      // 取消
      close() {
        this.dialogWrapperOne = true
        this.dialogWrapperTwo = false
        this.dialogWrapperThree = false
        this.$store.commit('showBackOne', false)
      },
      // 查看支付订单
      lookPayOrder() {
        this.$router.push({
          path: '/nav/finance/transferDetail',
          query: {
            withholdOrderId: this.insteadOrderId
          }
        })
        this.$store.commit('showBackOne', false)
      },
      // 单期还款执行接口
      async sure(backOne) {
        if (!this.allowPost) return
        this.allowPost = false
        axios.post('/loan/phase/repayDo', {
          id: backOne.id,
          funder: backOne.funder,
          withholdChannel: this.withholdChannel
        }).then((res) => {
          if (res.data.code === 200) {
            this.allowPost = true
            this.dialogWrapperTwo = true
            if (this.casePage) {
              // 刷新案件详情期次列表
              this.getCaseDataOverDueList({type: 0, userId: this.$route.query.userId})
              // 刷新案件详情的逾期信息
              this.getOverTimeInfo({userId: this.$route.query.userId})
              // 刷新催收进度数据
              this.caseSpeed({userId: this.$route.query.userId})
            } else {
              // 初始化借款详情-借款信息数据
              this.getLoanDetailInfo({orderId: this.$route.query.orderId})
              // 初始化借款详情-还款计划表数据
              this.getLoanDetailPlan({orderId: this.$route.query.orderId})
            }
            // 511 权限不足的toast, 400 扣款权限不足的toast
          } else if (Number.parseInt(res.data.code) === 511) {
            this.$message.error(res.data.message)
            this.close()
          } else if (Number.parseInt(res.data.code) === 400) {
            this.$message.error(res.data.message)
            this.close()
            this.allowPost = true
          } else {
            this.dialogWrapperThree = true
            if (res.data.body) {
              this.errorReason = res.data.body.descript
            }
          }
          if (res.data.body) {
            this.insteadOrderId = res.data.body.orderId
            this.insertOrderNo = res.data.body.orderNo
          }
          this.dialogWrapperOne = false
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang=less>
  .el-dialog__header {
    .el-dialog__title {
      font-size: 24px;
      font-weight: bold;
    }
  }

  .bm {
    border-bottom: 1px solid #E6E6E6;
  }

  .pa_l150 {
    padding-left: 150px;
  }

  .iconfont {
    font-size: 40px;
  }

  .inb_span{
    display: inline-block;
    width: 100px;
    text-align: right;
  }
</style>
