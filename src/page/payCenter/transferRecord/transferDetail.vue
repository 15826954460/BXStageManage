<template>
  <el-card style="width:100%;">
    <p class="mb14 fw f24">交易详情</p>
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span class="f20 fw">交易信息</span>
          </div>
          <div v-if="tradingListData">
            <p class="mb8">交易状态： {{tradingListData.state}}</p>
            <p class="mb8">交易编号：{{tradingListData.orderNo}}</p>
            <p class="mb8">用户ID：{{tradingListData.userId}}</p>
            <p class="mb8">姓名：{{tradingListData.realName}}</p>
            <p class="mb8">预留手机号：{{tradingListData.mobile}}</p>
            <p class="mb8">银行卡号：{{tradingListData.bankCardNo}}</p>
            <p class="mb8">开户行：{{tradingListData.bankName}}</p>
            <p class="mb8">交易金额：{{tradingListData.amount | toThousands}}</p>
            <p class="mb8">支付渠道：{{tradingListData.withholdChannel}}</p>
            <p class="mb8">支付单号：{{tradingListData.withholdOrderId}}</p>
            <p class="mb8">提交时间：{{tradingListData.createTime | dateTime}}</p>
            <p class="mb8">回调时间：{{tradingListData.updateTime | dateTime}}</p>
            <p class="mb8">支付描述：{{tradingListData.descript}}</p>
            <p class="mb8">备注：{{tradingListData.remark}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header" class="clearfix">
            <span class="f20 fw">关联借款订单</span>
          </div>
          <el-table v-if="tradingListData" :data="tradingListData.innerListVo"
                    border style="width: 100%">
            <el-table-column prop="billNo" label="账单编号" >
            </el-table-column>
            <el-table-column prop="loanOrderNo" label="借款编号" >
            </el-table-column>
            <el-table-column prop="term" label="期次名称" >
            </el-table-column>
            <!--<el-table-column label="应还金额" >-->
              <!--<template slot-scope="scope">-->
                <!--{{scope.row.repayAmount | toThousands}}-->
              <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column label="本次交易金额" >
              <template slot-scope="scope">
                {{scope.row.transactionAmount | toThousands}}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    data: function () {
      return {
        activeName: 'first',
        postParam: {
          withholdOrderId: this.$route.query.withholdOrderId
        }
      }
    },
    computed: {
      ...mapState(['tradingListData'])
    },
    mounted() {
      this.getRecordInfo(this.postParam)
    },
    methods: {
      ...mapActions(['getRecordInfo'])
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
