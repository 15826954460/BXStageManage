<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">Dashboard</p>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="审批总况" name="1" v-if="showAllAuditSituation"></el-tab-pane>
      <el-tab-pane label="我的审批" name="2" v-if="showMyAudit"></el-tab-pane>
    </el-tabs>
    <div v-if="dashAllBoardData && Number.parseInt(activeName) === 1 && showAllAuditSituation">
      <el-card class="mb14 box-card">
        <div class="dashboard_wrapper">
          <p class="title br_p f14 bg_g">总库存</p>
          <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
            <tbody>
            <tr class="tc tr_h pt_b">
              <td class="w25 pt_b">
                <p class="mb8 f14 gray">待人工审批</p>
                <p class="f28">{{dashAllBoardData.waitPeopleAuditCount}}</p>
              </td>
              <td class="w25 pt_b">
                <p class="mb8 f14 gray">审批中</p>
                <p class="f28">{{dashAllBoardData.auditingCount}}</p>
              </td>
              <td class="w25 pt_b">
                <p class="mb8 f14 gray">重新提交</p>
                <p class="f28">{{dashAllBoardData.reSubmitCount}}</p>
              </td>
              <td class="w25 pt_b">
                <p class="mb8 f14 gray">已挂起</p>
                <p class="f28">{{dashAllBoardData.hangCount}}</p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-card>

      <el-card class="mb14 box-card">
        <p class="mb8">
          <span>今日转人工件：</span><span style="margin-right: 30px">{{dashAllBoardData.todayTransferPersonCount}}</span>
          <span>今日已审件（人工）：</span><span style="margin-right: 30px">{{dashAllBoardData.todayAuditedCount}}</span>
          <span>今日已退回（人工）：</span><span style="margin-right: 30px">{{dashAllBoardData.todaySendBackCount}}</span>
        </p>
        <div class="dashboard_wrapper" v-if="dashAllBoardData">
          <p class="title br_p f14 bg_g">今日人工已审件</p>
          <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
            <tbody>
            <tr class="tc tr_h pt_b">
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">通过数（人工）</p>
                <p class="f28">{{dashAllBoardData.todayPassedCount}}</p>
              </td>
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">拒绝数（人工）</p>
                <p class="f28">{{dashAllBoardData.todayRefusedCount}}</p>
              </td>
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">关闭数（人工）</p>
                <p class="f28">{{dashAllBoardData.todayClosedCount}}</p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </div>

    <div v-if="dashMyBoardData && Number.parseInt(activeName) === 2 && showMyAudit">
      <el-card class="mb14 box-card">
        <p class="mb8">待人工审批：{{dashMyBoardData.waitPeopleAuditCount}}</p>
        <div class="dashboard_wrapper">
          <p class="title br_p f14 bg_g">我的库存</p>
          <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
            <tbody>
            <tr class="tc tr_h pt_b">
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">审批中</p>
                <p class="f28">{{dashMyBoardData.auditingCount}}</p>
              </td>
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">重新提交</p>
                <p class="f28">{{dashMyBoardData.reSubmitCount}}</p>
              </td>
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">已挂起</p>
                <p class="f28">{{dashMyBoardData.hangCount}}</p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-card>

      <el-card class="mb14 box-card">
        <p class="mb8">
          <span>今日已审件：</span><span style="margin-right: 30px">{{dashMyBoardData.todayAuditedCount}}</span>
          <span>今日已退回：</span><span style="margin-right: 30px">{{dashMyBoardData.todaySendBackCount}}</span>
        </p>
        <div class="dashboard_wrapper" v-if="dashMyBoardData">
          <p class="title br_p f14 bg_g">我的今日已审件</p>
          <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
            <tbody>
            <tr class="tc tr_h pt_b">
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">通过数</p>
                <p class="f28">{{dashMyBoardData.todayPassedCount}}</p>
              </td>
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">拒绝数</p>
                <p class="f28">{{dashMyBoardData.todayRefusedCount}}</p>
              </td>
              <td class="w30 pt_b">
                <p class="mb8 f14 gray">关闭数</p>
                <p class="f28">{{dashMyBoardData.todayClosedCount}}</p>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </div>
  </el-card>
</template>
<script>
  import axios from 'axios'
  import {judgeLimit} from '../../untils/common'
  import {mapActions, mapState} from 'vuex'

  export default {
    data: function () {
      return {
        activeName: '1',
        dashAllBoardData: null, // 审批总况
        dashMyBoardData: null, // 我的审批
        allAuditSituationMenuId: 77, // 审批总况
        myAuditMenuId: 78 // 我的审批
      }
    },
    computed: {
      ...mapState(['setButtonLimitData']),
      // 审批总况
      showAllAuditSituation: function () {
        if (judgeLimit(this.$store.state.setButtonLimitData, this.allAuditSituationMenuId)) {
          this.activeName = '1'
        }
        return judgeLimit(this.$store.state.setButtonLimitData, this.allAuditSituationMenuId)
      },
      // 我的审批
      showMyAudit: function () {
        if (judgeLimit(this.$store.state.setButtonLimitData, this.myAuditMenuId) &&
          !judgeLimit(this.$store.state.setButtonLimitData, this.allAuditSituationMenuId)) {
          this.activeName = '2'
        }
        return judgeLimit(this.$store.state.setButtonLimitData, this.myAuditMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // if (judgeLimit(this.$store.state.setButtonLimitData, this.allAuditSituationMenuId)) {
      //   this.fetchAllDashboard()
      //   return
      // }
      // if (judgeLimit(this.$store.state.setButtonLimitData, this.myAuditMenuId)) {
      //   this.fetchMyDashboard()
      // }
    },
    methods: {
      ...mapActions(['buttonLimit']),
      // 审批总况
      fetchAllDashboard() {
        axios.post('auditOrder/getDashboardAll').then(res => {
          if (res.data.code === 200) {
            this.dashAllBoardData = res.data.body
          } else {
            throw new Error(res.data.message)
          }
        })
      },
      // 我的审批数据
      fetchMyDashboard() {
        axios.post('auditOrder/getDashboardOfMine').then(res => {
          if (res.data.code === 200) {
            this.dashMyBoardData = res.data.body
          } else {
            throw new Error(res.data.message)
          }
        })
      },
      handleClick() {
        if (Number.parseInt(this.activeName) === 1) {
          this.fetchAllDashboard()
        } else {
          this.fetchMyDashboard()
        }
      }
    },
    watch: {
      setButtonLimitData(val) {
        if (judgeLimit(this.$store.state.setButtonLimitData, this.allAuditSituationMenuId)) {
          this.fetchAllDashboard()
          return
        }
        if (judgeLimit(this.$store.state.setButtonLimitData, this.myAuditMenuId)) {
          this.fetchMyDashboard()
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .bg_g {
    background: rgb(241, 242, 247);
  }

  .title {
    line-height: 20px;
  }

  .br_p {
    border: 1px solid #C7D1DE;
    border-bottom: none;
    padding: 10px;
  }

  .gray {
    color: rgb(176, 176, 177);
  }

  .pt_b {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .w30 {
    width: 33.333%;
  }

  .w25 {
    width: 25%;
  }
</style>
