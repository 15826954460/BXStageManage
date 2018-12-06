<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">Dashboard</p>
    <el-card class="mb14 box-card">
      <div class="dashboard_wrapper">
        <p class="title br_p f14">待处理工单数</p>
        <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
          <tbody>
          <tr class="tc tr_h" v-if="dashboardData">
            <td class="tr_b w50">
              <p class="mb8 f14">放款异常</p>
              <p class="yellow f28">{{dashboardData.releasePendingCount}}</p>
            </td>
            <td class="tr_b w50">
              <p class="mb8 f14">还款异常</p>
              <p class="yellow f28">{{dashboardData.repayPendingCount}}</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </el-card>
  </el-card>
</template>
<script>
  import axios from 'axios'

  export default {
    data: function () {
      return {
        dashboardData: {
        }
      }
    },
    mounted() {
      this.fetchDashboard()
    },
    methods: {
      // dashboard 接口
      fetchDashboard() {
        axios.post('cs/getPendingAbnormalCount').then(res => {
          if (res.data.code === 200) {
            this.dashboardData = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .title {
    line-height: 30px;
  }

  .tr_h {
    height: 200px;
  }

  .tr_b {
    border: 1px solid #C7D1DE;
  }

  .w50 {
    width: 50%;
  }

  .br_p {
    border: 1px solid #C7D1DE;
    border-bottom: none;
    padding: 10px;
  }
</style>
