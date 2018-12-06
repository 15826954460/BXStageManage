<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">Dashboard</p>
    <el-card class="mb14 box-card">
      <div class="dashboard_wrapper mb20" v-if="dashboardData">
        <p class="title br_p f14 bg_g">今日关键指标</p>
        <ul class="ul_style pt_b">
          <li class="li_style" v-if="dashboardData.todayRelease">
            <p class="gray tc ">放款订单</p>
            <p class="f28 mb8 tc">{{dashboardData.todayRelease.all}}</p>
            <p class="gray">
              <span class="tr span">放款中</span>
              <span>
                {{dashboardData.todayRelease.releasing}}
              </span>
            </p>
            <p class="gray">
              <span class="tr span">放款异常</span>
              <span>{{dashboardData.todayRelease.needconfirm}}</span>
            </p>
            <p class="gray">
              <span class="tr span">放款失败</span>
              <span>{{dashboardData.todayRelease.fail}}</span>
            </p>
            <p class="gray">
              <span class="tr span">放款成功</span>
              <span>
                {{dashboardData.todayRelease.success}}</span></p>
          </li>
          <li class="li_style br_r br_l" v-if="dashboardData.todayCharge">
            <p class="gray tc">代扣还款订单</p>
            <p class="f28 mb8 tc">{{dashboardData.todayCharge.all}}</p>
            <p class="gray">
              <span class="tr span">还款中</span>
              <span>{{dashboardData.todayCharge.charging}}</span>
            </p>
            <p class="gray">
              <span class="tr span">还款异常</span>
              <span>{{dashboardData.todayCharge.needconfirm}}</span>
            </p>
            <p class="gray">
              <span class="tr span">已挂起</span>
              <span>{{dashboardData.todayCharge.handup}}</span>
            </p>
            <p class="gray">
              <span class="tr span">还款失败</span>
              <span>{{dashboardData.todayCharge.fail}}</span>
            </p>
            <p class="gray">
              <span class="tr span">还款成功</span>
              <span>{{dashboardData.todayCharge.success}}</span>
            </p>
          </li>
          <li class="li_style" v-if="dashboardData.todayOverDue">
            <p class="gray tc">到期期数</p>
            <p class="f28 mb8 tc">{{dashboardData.todayOverDue.dueday}}</p>
            <p class="gray">
              <span class="tr span">待还款</span>
              <span>{{dashboardData.todayOverDue.wait}}</span></p>
            <p class="gray">
              <span class="tr span">还款中</span>
              <span>{{dashboardData.todayOverDue.paying}}</span></p>
            <p class="gray">
              <span class="tr span">已还清</span>
              <span>{{dashboardData.todayOverDue.settle}}</span>
            </p>
          </li>
        </ul>
      </div>
      <div class="dashboard_wrapper mb20">
        <p class="title br_p f14 bg_g">整体逾期情况</p>
        <table class="collapse" style="width:100%;border:1px solid #C7D1DE">
          <tbody v-if="dashboardData && dashboardData.allOverdue">
          <tr class="tc tr_h pt_b">
            <td class="w30 pt_b">
              <p class="mb8 f14 gray">逾期期次（今日新增）</p>
              <p class="f28">{{dashboardData.allOverdue.newadd}}</p>
            </td>
            <td class="w30 pt_b">
              <p class="mb8 f14 gray">逾期期次（最新）</p>
              <p class="f28">{{dashboardData.allOverdue.newoverdue}}</p>
            </td>
            <td class="w30 pt_b">
              <p class="mb8 f14 gray">逾期期次（累计）</p>
              <p class="f28">{{dashboardData.allOverdue.all}}</p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <div>
        <p class="title f14 bg_g br_p">今日代扣成功率</p>
        <div style="padding:10px;border:1px solid #C7D1DE; border-bottom: none">
          <el-tabs @tab-click="handleClick" v-if="menuList" v-model="activeName">
            <el-tab-pane v-for="(item, index) in menuList" :key="index"
                         :label="item.label" :name="item.name">
            </el-tab-pane>
          </el-tabs>
          <el-table v-if="WithholdingSuccess"
                    :data="WithholdingSuccess"
                    :default-sort="{prop: '', order: ''}"
                    @sort-change="sortChange"
                    border style="width: 100%;">
            <el-table-column label="银行" prop="bankName"></el-table-column>
            <el-table-column label="成功数" prop="successCount" sortable="custom"></el-table-column>
            <el-table-column label="成功率" prop="successRate" sortable="custom">
              <template slot-scope="scope">
                <el-progress
                  :text-inside="true"
                  :stroke-width="14"
                  :percentage="Number(scope.row.successRate)"
                  status="success"
                  ></el-progress>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </el-card>
</template>

<script>
  import axios from 'axios'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '淮南-富友', name: '1'},
          {label: '淮南-宝付', name: '2'},
          {label: '荷包-宝付', name: '3'}
        ],
        postParam: {
          successCountSort: 0, // 成功数排序 0：不排除 1： 升序 2：降序
          successRateSort: 0, // 成功率 0：不排除 1： 升序 2：降序
          payChannel: 1, // 支付渠道 1 富友 2 宝付
          merchant: 1 // 支付商户 1 淮南 2 荷包
        },
        // 排序字段
        sortWord: '',
        // 排序顺序
        sortOrder: '',
        activeName: '1',
        dashboardData: null,
        WithholdingSuccess: []
      }
    },
    mounted() {
      // dashboard数据
      this.fetchDashboard()
      // 请求今日代扣成功率
      this.fetchWithholdingSuccess()
    },
    methods: {
      // dashboard 接口
      fetchDashboard() {
        axios.post('loanProduct/dashboard').then(res => {
          if (res.data.code === 200) {
            this.dashboardData = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取今日代扣成功率数据
      fetchWithholdingSuccess() {
        axios.post('chargeRecord/dashboard', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.WithholdingSuccess = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      handleClick() {
        switch (Number.parseInt(this.activeName)) {
          case 1:
            this.postParam.payChannel = 1
            this.postParam.merchant = 1
            break
          case 2:
            this.postParam.payChannel = 2
            this.postParam.merchant = 1
            break
          case 3:
            this.postParam.payChannel = 2
            this.postParam.merchant = 2
            break
        }
        this.fetchWithholdingSuccess()
      },
      sortChange(column) {
        if (column.prop === 'successCount') {
          if (column.order === 'descending') {
            this.postParam.successCountSort = 2
          } else if (column.order === 'ascending') {
            this.postParam.successCountSort = 1
          } else {
            this.postParam.successCountSort = 0
          }
          this.postParam.successRateSort = 0
        } else {
          if (column.order === 'descending') {
            this.postParam.successRateSort = 2
          } else if (column.order === 'ascending') {
            this.postParam.successRateSort = 1
          } else {
            this.postParam.successRateSort = 0
          }
          this.postParam.successCountSort = 0
        }
        this.fetchWithholdingSuccess()
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

  .tr_b {
    border: 1px solid #C7D1DE;
  }

  .br_p {
    border: 1px solid #C7D1DE;
    border-bottom: none;
    padding: 10px;
  }

  ul:after {
    content: "";
    display: block;
    clear: both;
  }

  .ul_style {
    border: 1px solid #C7D1DE;
  }

  .li_style {
    float: left;
    width: 33.333%;
  }

  .br_r {
    border-right: 1px solid #C7D1DE;
    border-left: 1px solid #C7D1DE;
  }

  .gray {
    color: rgb(176, 176, 177);
  }

  .span {
    width: 50%;
    margin-right: 20px;
    display: inline-block
  }

  .pt_b {
    padding-top: 15px;
    padding-bottom: 15px;
  }

  .bd_l {
    border-left: 1px solid #C7D1DE;
  }

  .w30 {
    width: 33.333%;
  }
</style>
