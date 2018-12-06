<template>
  <el-row style="width:100%;">
    <el-col :span="24">
      <el-card style="width:100%;" v-show="parseInt(type) === 2" class="mb20">
        <div slot="header" class="clearfix">
          <span class="fw f20">借款订单</span>
        </div>

        <table style="border-collapse: collapse;width:100%"
               v-if="loanHistoryInfo && parseInt(type) === 2">
          <thead style="background: #EEF1F6">
          <tr class="h40 f14 bd">
            <td>借款编号</td>
            <td>借款金额</td>
            <td>借款期数</td>
            <td>申请时间</td>
            <td>渠道</td>
            <td>审批状态</td>
            <td>审批人</td>
            <td>逾期天数</td>
            <td>累计逾期天数</td>
            <td>借款状态</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in loanHistoryInfo.records" class="h50">
            <td class="bd">
              <span class="cur blue" @click="goDetail(item, 2)">{{item.orderId}}</span>
            </td>
            <td class="bd">
              <span :class="{error: parseInt(item.overDuePhase) > 0 ||  parseInt(item.overDueDays) > 0}">
              {{item.amount | formatToThree}}
              </span>
            </td>
            <td class="bd">
              <span :class="{error: parseInt(item.overDuePhase) > 0 ||  parseInt(item.overDueDays) > 0}">
          {{item.term}}期
          </span>
            </td>
            <td class="bd">
               <span :class="{error: parseInt(item.overDuePhase) > 0 ||  parseInt(item.overDueDays) > 0}">
          {{item.createTime | dateTime}}
          </span>
            </td>
            <td class="bd">
              <span :class="{error: parseInt(item.overDuePhase) > 0 ||  parseInt(item.overDueDays) > 0}">
          {{item.channelName}}
          </span>
            </td>
            <!--todo: 借款 授信 审批状态-->
            <td class="bd">
              <span v-for="items in fixedField.examinationStatus" :key="item.code"
                    v-show="item.auditStatus === items.code"
                    :class="{error: parseInt(item.overDueDays) > 0 || (item.auditStatus === 300) || (item.auditStatus === 400),
                    success: item.auditStatus === 200}">
          {{items.value}}
          </span>
            </td>
            <td class="bd">
             <span :class="{error: parseInt(item.overDuePhase) > 0 ||  parseInt(item.overDueDays) > 0}">
          {{item.auditor}}
          </span>
            </td>
            <td class="bd">
               <span :class="{error: parseInt(item.overDuePhase) > 0 ||  parseInt(item.overDueDays) > 0}">
          {{item.overDuePhase}}
          </span>
            </td>
            <td class="bd">
               <span :class="{error: parseInt(item.overDuePhase) > 0 ||  parseInt(item.overDueDays) > 0}">
          {{item.overDueDays}}
          </span>
            </td>
            <!--todo: 借款状态-->
            <td class="bd">
               <span v-for="items in fixedField.loanStatus" :key="item.statusCode"
                     v-show="item.loanStatus === items.statusCode"
                     :class="{error: parseInt(item.overDueDays) > 0}">
          {{items.value}}
          </span>
            </td>
          </tr>
          </tbody>
        </table>

        <div>
          <div class="tr pt30" v-if="loanHistoryInfo">
            <el-pagination
              @size-change="handleSizeChangeLoan"
              @current-change="handleCurrentChangeLoan"
              :current-page="postParamLoan.pageNow"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="postParamLoan.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="loanHistoryInfo.totalrecord">
            </el-pagination>
          </div>
        </div>

      </el-card>

      <el-card>
        <div slot="header" class="clearfix">
          <span class="fw f20">授信订单</span>
        </div>

        <table style="border-collapse: collapse;width:100%" class="mt20"
               v-if="creditHistoryInfo && (parseInt(type) === 1 || parseInt(type) === 2)">
          <thead style="background: #EEF1F6">
          <tr class="h40 f14 bd">
            <td>授信编号</td>
            <td>申请时间</td>
            <td>渠道</td>
            <td>额度评估</td>
            <td>审批人</td>
            <td>审批时间</td>
            <td>审批状态</td>
            <td>原因类型</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in creditHistoryInfo.records" class="h50">
            <td class="bd">
              <span class="cur blue" @click="goDetail(item, 1)">{{item.orderId}}</span>
            </td>
            <td class="bd">
               <span>
                {{item.createTime | dateTime}}
              </span>
            </td>
            <td class="bd">
              <span>{{item.channelName}}</span>
            </td>
            <td class="bd">
               <span>
                {{item.creditAmount | toThousands}}
                </span>
            </td>
            <td class="bd">
              <span>{{item.auditor}}</span>
            </td>
            <td class="bd">
               <span>
                {{item.auditTime | dateTime}}
                </span>
            </td>
            <!--todo: 授信状态-->
            <td class="bd">
              <span v-for="items in fixedField.examinationStatus" :key="item.code"
                    v-show="parseInt(item.status) === items.code"
                    :style="{color: items.color}">
                  {{items.value}}
              </span>
            </td>
            <td class="bd">
              <span>{{item.text}}</span>
            </td>
          </tr>
          </tbody>
        </table>

        <div>
          <div class="tr pt30" v-if="creditHistoryInfo">
            <el-pagination
              @size-change="handleSizeChangeCredit"
              @current-change="handleCurrentChangeCredit"
              :current-page="postParamCredit.pageNow"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="postParamCredit.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="creditHistoryInfo.totalrecord">
            </el-pagination>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data: function () {
      return {
        type: this.$route.query.type,
        orderId: this.$route.query.orderId,
        // 借款
        postParamLoan: {
          userId: this.$route.query.userId,
          pageSize: 10,
          pageNow: 1
        },
        // 授信
        postParamCredit: {
          userId: this.$route.query.userId,
          pageSize: 10,
          pageNow: 1
        },
        loanHistoryInfo: {}, // 历史借款信息
        creditHistoryInfo: {} // 授信信息
      }
    },
    computed: {
      ...mapState(['fixedField', 'circulation'])
    },
    mounted() {
      this.getLoanHistoryInfo()
    },
    methods: {
      // 获取记录
      getLoanHistoryInfo() {
        // 授信
        this.creditRecord()
        // 借款
        if (parseInt(this.type) === 2) {
          this.loanRecord()
        }
      },
      // 授信记录
      creditRecord () {
        axios.post('creditApply/historyCreditRecord', this.postParamCredit).then(res => {
          if (res.data.code === 200) {
            this.creditHistoryInfo = res.data.body
          }
        })
      },
      // 借款记录
      loanRecord () {
        axios.post('loan/historyLoanRecord', this.postParamLoan).then(res => {
          if (res.data.code === 200) {
            this.loanHistoryInfo = res.data.body
          }
        })
      },
      // 借款分页
      handleSizeChangeLoan(val) {
        this.postParamLoan.pageSize = val
        this.loanRecord()
      },
      handleCurrentChangeLoan(val) {
        this.postParamLoan.pageNow = val
        this.loanRecord()
      },
      // 授信分页
      handleSizeChangeCredit(val) {
        this.postParamCredit.pageSize = val
        this.creditRecord()
      },
      handleCurrentChangeCredit(val) {
        this.postParamCredit.pageNow = val
        this.creditRecord()
      },
      // 跳转查看审批页面
      goDetail(row, val) {
        this.$store.commit('isShowBtn', false)
        this.$store.commit('changeRightWidth', true)
        this.$store.commit('closeCirculation', false)
        const url = `${window.location.origin + window.location.pathname}#/nav/risk/letterOrder/?orderId=${row.orderId}&type=${val}&userId=${row.userId}&channelName=${row.channelName}&goHistory=2&closeCirculation=${false}`
        window.open(url, '_blank')
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.postParam.userId = this.$route.query.userId
          this.getLoanHistoryInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .nagetiveError {
    color: #FF0000;
  }

  .h50 {
    height: 50px;
    line-height: 50px;
  }

  .h40 {
    height: 40px;
    line-height: 40px;
  }

  .bg_e4 {
    background: #EEF1F6;
  }

  .bd {
    border: 1px solid #EBEEF5;
  }
</style>
