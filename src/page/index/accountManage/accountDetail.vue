<template>
  <el-card style="width:100%;" class="">
    <div slot="header" class="clearfix">
      <span class="f28 fw">账单详情</span>
    </div>
    <div v-if="billDetailListData">
      <h2 class="mb8">账单信息</h2>
      <p class="gray">账单编号：{{billDetailListData.billNo}} </p>
      <ul class="ul pl30">
        <li class="li">
          <table class="collapse mb14">
            <tbody>
            <tr class="lh32">
              <td class="gray pl30 tr">账单总额(总计)：</td>
              <td>{{billDetailListData.billAmount | toThousands}}</td>
            </tr>
            <tr class="lh32">
              <td class="gray pl30 tr">已还(总计)：</td>
              <td>{{billDetailListData.repaidAmount | toThousands}}</td>
            </tr>
            <tr class="bm lh32">
              <td class="gray pl30 tr">减免(总计)：</td>
              <td>{{billDetailListData.remissionAmount | toThousands}}</td>
            </tr>
            <tr class="lh32">
              <td class="gray pl30 tr">待还款(总计)：</td>
              <td>{{billDetailListData.waitRepayAmount | toThousands}}</td>
            </tr>
            </tbody>
          </table>
        </li>
        <li class="li">
          <table class="collapse mb14">
            <tbody>
            <tr class="lh32">
              <td class="gray pl30 tr">账单状态：</td>
              <td>{{billDetailListData.state}}</td>
            </tr>
            <tr class="lh32">
              <td class="gray pl30 tr">还款日：</td>
              <td>{{billDetailListData.repayDate | date}}</td>
            </tr>
            <tr class="lh32">
              <td class="gray pl30 tr">还款时间：</td>
              <td>{{billDetailListData.settleTime | date}}</td>
            </tr>
            </tbody>
          </table>
        </li>
        <li class="li">
          <table class="collapse mb14">
            <tbody>
            <tr class="lh32">
              <td class="gray pl30 tr">姓名：</td>
              <td>{{billDetailListData.realName}}</td>
            </tr>
            <tr class="lh32">
              <td class="gray pl30 tr">手机号：</td>
              <td>{{billDetailListData.mobile}}</td>
            </tr>
            <tr class="lh32">
              <td class="gray pl30 tr">身份证号：</td>
              <td>{{billDetailListData.idCard}}</td>
            </tr>
            </tbody>
          </table>
        </li>
      </ul>

      <el-table v-if="billDetailListData" :data="billDetailListData.billDetailInnerListVo"
                border style="width: 100%;">
        <el-table-column prop="id" label="期数ID" >
        </el-table-column>
        <el-table-column prop="phaseName" label="期次名称" >
        </el-table-column>
        <el-table-column prop="loanOrderNo" label="借款编号"  width="180px">
        </el-table-column>
        <el-table-column label="还款日"  width="180px">
          <template slot-scope="scope">
            {{scope.row.dueDate | date }}
          </template>
        </el-table-column>
        <el-table-column label="期次总金额" >
          <template slot-scope="scope">
            {{scope.row.repayAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="已还" >
          <template slot-scope="scope">
            {{scope.row.alreadyRepayAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="减免" >
          <template slot-scope="scope">
            {{scope.row.annulRepayAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="待还" >
          <template slot-scope="scope">
            {{scope.row.waitRepayAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
             <span v-for="(item, index) in fixedField.installmentStatus"
                   :key="index"
                   v-show="item.statusCode === Number.parseInt(scope.row.state)"
                   :style="{color:item.color}">
                {{item.value}}
              </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button @click="look(scope.row)" type="text">查看</el-button>
            <!--<el-button @click="payRecord(scope.row)" type="text" size="small"-->
                       <!--v-show="parseInt(scope.row.repayRecordButtonState) === 1">支付记录-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import backMoney from '../../../components/backAllMoney.vue'

  export default {
    data: function () {
      return {
        postParam: {
          billNo: this.$route.query.billNo
        },
        signingData: []
      }
    },
    mounted() {
      // 初始化账单详情数据
      this.getBillDetailList(this.postParam)
    },
    computed: {
      ...mapState(['fixedField', 'billDetailListData'])
    },
    methods: {
      ...mapActions(['getBillDetailList']),
      // 操作--查看--条转到借款详情
      look(row) {
        let url = `${window.location.origin + window.location.pathname}#nav/index/loanDetail?orderId=${row.loanOrderNo}`
        window.open(url, '_blank')
        // this.$router.push({path: '/nav/index/loanDetail', query: {orderId: row.loanOrderNo}})
      },
      payRecord(row) {
        this.$router.push({path: '/nav/finance/transferDetail', query: {withholdOrderId: row.withholdOrderId}})
      }
    },
    components: {backMoney}
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../../style/filterStyle';

  .table_left {
    width: 20%;
    text-align: right;
  }

  .table_right {
    padding-left: 40px;
  }

  .bm {
    border-bottom: 1px solid #E6E6E6;
  }

  .ul {
    width: 100%;
    display: flex;
    .li {
      flex: 1;
    }
  }
</style>
