<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">Dashboard</p>
    <el-card class="mb14 box-card">
      <div class="dashboard_wrapper"  v-if="dashboardDataOne">
        <p class="title br_p f14 bg_g">整体逾期情况</p>
        <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
          <tbody>
          <tr class="tc tr_h pt_b">
            <td class="w30 pt_b">
              <p class="mb8 f14 gray">逾期期次（今日新增）</p>
              <p class="f28">{{dashboardDataOne.todayPhaseNum}}</p>
            </td>
            <td class="w30 pt_b">
              <p class="mb8 f14 gray">逾期期次（最新）</p>
              <p class="f28">{{dashboardDataOne.newPhaseNum}}</p>
            </td>
            <td class="w30 pt_b">
              <p class="mb8 f14 gray">逾期期次（累计）</p>
              <p class="f28">{{dashboardDataOne.sumPhaseNum}}</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </el-card>
    <el-card class="mb14 box-card">
      <div class="dashboard_wrapper" v-if="dashboardDataTwo">
        <p class="title br_p f14 bg_g">今日到期数据</p>
        <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
          <tbody>
          <tr class="tc tr_h pt_b">
            <td class="w25 pt_b">
              <p class="mb8 f14 gray">到期期数</p>
              <p class="f28">{{dashboardDataTwo.duePhaseNum}}</p>
            </td>
            <td class="w25 pt_b">
              <p class="mb8 f14 gray">待还款</p>
              <p class="f28">{{dashboardDataTwo.waitRepay}}</p>
            </td>
            <td class="w25 pt_b">
              <p class="mb8 f14 gray">还款中</p>
              <p class="f28">{{dashboardDataTwo.repaying}}</p>
            </td>
            <td class="w25 pt_b">
              <p class="mb8 f14 gray">已还清</p>
              <p class="f28">{{dashboardDataTwo.repayed}}</p>
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
        dashboardDataOne: {},
        dashboardDataTwo: {}
      }
    },
    computed: {},
    mounted() {
      // 获取 dashboard 数据
      this.getDashData()
    },
    methods: {
      getDashData() {
        axios.post('dun/dashboard').then(res => {
          if (res.data.code === 200) {
            this.dashboardDataTwo = res.data.body.todayCount
            this.dashboardDataOne = res.data.body.overdueCount
          } else {
            throw new Error('接口返回数据不对')
          }
        })
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
