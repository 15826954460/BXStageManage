<template>
  <el-card style="width:100%;" class="">
    <div slot="header" class="clearfix">
      <span class="f28 fw">借款详情</span>
    </div>

    <div class="loan_info" v-if="loanDetailDataInfo">
      <p class="mb8">借款人：{{loanDetailDataInfo.realName}}</p>
      <p class="mb8">借款编号：{{loanDetailDataInfo.orderId}}</p>
      <p class="mb8">借款审批人：{{loanDetailDataInfo.auditor}}</p>
      <p class="mb8">借款状态：{{loanDetailDataInfo.loanStatus}}</p>
      <p class="mb8">资金方：{{loanDetailDataInfo.funder}}</p>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="借款信息" name="1"></el-tab-pane>
        <el-tab-pane label="还款计划表" name="2"
                     v-if="loanDetailDataPlan && loanDetailDataPlan.loanPhaseInnerList && loanDetailDataPlan.loanPhaseInnerList.length > 0"></el-tab-pane>
      </el-tabs>

      <table style="width:70%" class="collapse" v-show="Number.parseInt(activeName) === 1">
        <tbody>
        <!--<tr class="bm lh32">-->
        <!--<td class="gray table_left">借款人姓名</td>-->
        <!--<td class="pl100">{{loanDetailDataInfo.realName}}</td>-->
        <!--</tr>-->
        <tr class="lh32">
          <td class="gray table_left">借款人手机号</td>
          <td class="bm">{{loanDetailDataInfo.mobile}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款人身份证号</td>
          <td class="bm">{{loanDetailDataInfo.idCard}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款金额</td>
          <td class="bm">{{loanDetailDataInfo.amount | toThousands}} 元</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款期数</td>
          <td class="bm">{{loanDetailDataInfo.term}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款年化利率</td>
          <td class="bm">{{loanDetailDataInfo.rate}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款用途</td>
          <td class="bm">{{loanDetailDataInfo.purpose}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">还款方式</td>
          <td class="bm">{{loanDetailDataInfo.paymentMethod}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款申请渠道</td>
          <td class="bm">{{loanDetailDataInfo.channelName}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款申请时间</td>
          <td class="bm">{{loanDetailDataInfo.createTime | dateTime}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">放款时间</td>
          <td class="bm">{{loanDetailDataInfo.loanTime | dateTime}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">收款银行卡</td>
          <td class="bm">{{loanDetailDataInfo.incomeBankCardNo}}</td>
        </tr>
        <tr class="lh32">
          <td class="gray table_left">借款合同</td>
          <td class="flex" v-if="loanDetailDataInfo">
            <p>
              <span class="blue cur" @click="lookContract(2)">《授权征信调查协议》</span>
              <span class="blue cur" @click="lookContract(3)">《委托扣款授权书》</span>
              <span class="blue cur" @click="lookContract(1)">《借款协议》</span>
              <span class="blue cur" @click="lookContract(5)">《借款居间服务协议》</span>
            </p>

            <!--<el-button size="mini"-->
            <!--:disabled="parseInt(loanDetailDataInfo.loanContractButtonState) === 2"-->
            <!--:type="parseInt(loanDetailDataInfo.loanContractButtonState) === 2 ? 'info' : 'primary'"-->
            <!--@click="lookContract(1)">-->
            <!--查看-->
            <!--</el-button>-->
          </td>
        </tr>
        </tbody>
      </table>

      <div style=""
           v-if="loanDetailDataPlan && loanDetailDataPlan.loanPhaseInnerList"
           v-show="Number.parseInt(activeName) === 2">
        <!--<h2 class="mb8 inb" v-if="loanDetailDataPlan.loanPhaseInnerList.length > 0">还款计划表</h2>-->
        <!--<span class="iconfont fw cur" @click="loadAgain"-->
        <!--v-if="loanDetailDataPlan.loanPhaseInnerList.length > 0">&#xe6cc;</span>-->
        <!--todo:全部还款对话框-->
        <div v-if="loanDetailDataPlan.loanPhaseInnerList.length > 0">
          <backall></backall>
        </div>
        <div v-if="loanDetailDataPlan.loanPhaseInnerList">
          <el-table :data="loanDetailDataPlan.loanPhaseInnerList"
                    border style="width: 100%;">
            <el-table-column prop="phaseNum" label="期数">
            </el-table-column>
            <el-table-column label="还款日">
              <template slot-scope="scope">
                {{scope.row.dueDate | date}}
              </template>
            </el-table-column>
            <el-table-column label="期次总金额">
              <template slot-scope="scope">
                {{scope.row.repayAmount | toThousands}}
              </template>
            </el-table-column>
            <el-table-column label="已还">
              <template slot-scope="scope">
                {{scope.row.alreadyRepayAmount | toThousands}}
              </template>
            </el-table-column>
            <el-table-column label="减免">
              <template slot-scope="scope">
                {{scope.row.annulRepayAmount | toThousands}}
              </template>
            </el-table-column>
            <el-table-column label="待还">
              <template slot-scope="scope">
                {{scope.row.waitRepayAmount | toThousands}}
              </template>
            </el-table-column>
            <el-table-column label="还清时间" width="160px">
              <template slot-scope="scope">
                {{scope.row.settleTime | dateTime}}
              </template>
            </el-table-column>
            <el-table-column label="逾期天数">
              <template slot-scope="scope">
                <span :class="{error: parseInt(scope.row.overdueDays) > 0}">{{scope.row.overdueDays}}</span>
              </template>
            </el-table-column>
            <el-table-column label="期次状态">
              <template slot-scope="scope">
              <span v-for="(item, index) in fixedField.installmentStatus" :key="index"
                    v-show="item.statusCode === scope.row.state"
                    :style="{color: item.color}">
                {{item.value}}
              </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button @click="lookDetail(scope.row)" type="text" class="cur"
                           v-show="showExportBtnM">明细
                </el-button>

                <el-button
                  v-show="showExportBtnR && parseInt(scope.row.remiteButtonState) === 1"
                  @click="breaks(scope.row)" type="text" class="cur">减免
                </el-button>

                <!--todo: 该功能作废了-->
                <!--<el-button @click="payRecord(scope.row)"-->
                <!--type="text" class="cur"-->
                <!--v-show="parseInt(scope.row.repayRecordButtonState) === 1">支付记录-->
                <!--</el-button>-->

                <el-button @click="payOne(scope.row)"
                           v-show="showExportBtnMS && parseInt(scope.row.repayButtonState) !== 0 "
                           :class="{self_gray: parseInt(scope.row.repayButtonState) === 2,
                         ban: parseInt(scope.row.repayButtonState) === 2}"
                           type="text" class="cur">单期还款
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--单期还款对话框-->
        <backone></backone>
      </div>
    </div>
    <!--todo:单期明细-->
    <el-dialog title="" :visible.sync="dialogTableVisible" :show-close="false"
               top="30vh">
      <table v-if="payOneDetailData" class="collapse" border="1" style="width:100%;">
        <thead>
        <tr class="tc">
          <th></th>
          <th>需还</th>
          <th>已还</th>
          <th>减免</th>
          <th>待还</th>
        </tr>
        </thead>
        <tbody>
        <tr class="tc">
          <td>本金</td>
          <td>{{payOneDetailData.allPrincipal | toThousands}}</td>
          <td>{{payOneDetailData.repaidPrincipal | toThousands}}</td>
          <td>{{payOneDetailData.remitPrincipal | toThousands}}</td>
          <td>{{payOneDetailData.waitPrincipal | toThousands}}</td>
        </tr>
        <tr class="tc">
          <td>借款利息</td>
          <td>{{payOneDetailData.allInterest | toThousands}}</td>
          <td>{{payOneDetailData.repaidInterest | toThousands}}</td>
          <td>{{payOneDetailData.remitInterest | toThousands}}</td>
          <td>{{payOneDetailData.waitInterest | toThousands}}</td>
        </tr>
        <tr class="tc">
          <td>借款服务费</td>
          <td>{{payOneDetailData.allServiceFee | toThousands}}</td>
          <td>{{payOneDetailData.repaidServiceFee | toThousands}}</td>
          <td>{{payOneDetailData.remitServiceFee | toThousands}}</td>
          <td>{{payOneDetailData.waitServiceFee | toThousands}}</td>
        </tr>
        <tr class="tc">
          <td>逾期管理费</td>
          <td>{{payOneDetailData.allOverdueFee | toThousands}}</td>
          <td>{{payOneDetailData.repaidOverdueFee | toThousands}}</td>
          <td>{{payOneDetailData.remitOverdueFee | toThousands}}</td>
          <td>{{payOneDetailData.waitOverdueFee | toThousands}}</td>
        </tr>
        <tr class="tc">
          <td>逾期复利</td>
          <td>{{payOneDetailData.allCompoundInterest | toThousands}}</td>
          <td>{{payOneDetailData.repaidCompoundInterest | toThousands}}</td>
          <td>{{payOneDetailData.remitCompoundInterest | toThousands}}</td>
          <td>{{payOneDetailData.waitCompoundInterest | toThousands}}</td>
        </tr>
        <tr class="tc">
          <td>合计</td>
          <td>{{payOneDetailData.totalRepayAmount | toThousands}}</td>
          <td>{{payOneDetailData.totalAlreadyRepayAmount | toThousands}}</td>
          <td>{{payOneDetailData.totalRemitedAmount | toThousands}}</td>
          <td>{{payOneDetailData.totalWaitRepayAmount | toThousands}}</td>
        </tr>
        </tbody>
      </table>
    </el-dialog>

    <!--todo:减免弹框-->
    <el-dialog :title="breaksOneWrapper ? '减免-修改待还金额' : breaksTwoWrapper ? '确认减免' : ''"
               :visible.sync="breaksDialogFormVisible"
               @close="closeDialog('ruleFormOne')"
               :breaksDialogFormVisible="false" width="500px">

      <el-form :model="breaksPostParam" ref="ruleFormOne" :rules="rules" v-show="breaksOneWrapper">
        <el-form-item label="本期待还金额：" :label-width="formLabelWidth">
          <span>{{breaksPostParam.waitRepayAmount | toThousands}}</span>
        </el-form-item>
        <el-form-item label="修改为：" :label-width="formLabelWidth" prop="updateAmount">
          <el-input v-model="breaksPostParam.updateAmount" size="small"
                    @keyup.native="onkeyup($event)"></el-input>
        </el-form-item>
        <el-form-item label="" :label-width="formLabelWidth">
          <p>可改为
            {{breaksPostParam.minUpdateScope | toThousands}} ~ {{breaksPostParam.maxUpdateScope | toThousands}}</p>
        </el-form-item>
        <el-form-item label="原因：" :label-width="formLabelWidth" prop="updateRemark">
          <el-input type="textarea" v-model="breaksPostParam.updateRemark" size="small"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="cancel('ruleFormOne')" size="small">取 消</el-button>
          <el-button type="primary" @click="nextStep('ruleFormOne')" size="small">下一步</el-button>
        </el-form-item>
      </el-form>

      <div v-show="breaksTwoWrapper">
        <p class="gray tc mb8">减免金额</p>
        <p class="f30 tc mb20">{{breaksAmount}}</p>
        <p class="flex bm" style="border-top:1px solid #E6E6E6;height:40px;line-height: 40px">
          <span class="gray">减免前，待还金额</span>
          <span>{{breaksPostParam.waitRepayAmount | toThousands}}</span>
        </p>
        <p class="flex bm mb20" style="height:40px;line-height: 40px">
          <span class="gray">减免后，待还金额</span>
          <span>{{updateAmount | toThousands}}</span>
        </p>
        <div class="tr">
          <el-button @click="prevStep()" size="small">上一步</el-button>
          <el-button type="primary" @click="breaksSure" size="small">确认</el-button>
        </div>
      </div>

      <div v-show="breaksThreeWrapper">
        <p class="gray" style="display: flex;justify-content: center;padding-top: 60px;margin-bottom: 30px">
          <span class="iconfont" style="color: #1AC604;margin-right: 10px;align-items: center;">&#xe62c;</span>
          <span style="color: #1AC604" class="f20">减免成功</span>
        </p>
        <p class="tc mb20">交易编号: {{transactionNumber}}</p>
        <div class="tr">
          <el-button type="primary" @click="resultsClose" size="small">关闭</el-button>
        </div>
      </div>

      <div v-show="breaksFourWrapper">
        <p class="gray" style="display: flex;justify-content: center;padding-top: 60px;margin-bottom: 30px">
          <span class="iconfont danger" style="margin-right: 10px;align-items: center;">&#xe64a;</span>
          <span class="danger">减免失败</span>
        </p>
        <p class="mb20 tc">失败原因: {{errorReason}}</p>
        <div class="tr">
          <el-button type="primary" @click="resultsClose('ruleFormOne')" size="small">关闭</el-button>
        </div>
      </div>

    </el-dialog>
  </el-card>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import backall from '../../../components/backAllMoney.vue'
  import backone from '../../../components/backOneMoney.vue'
  import axios from 'axios'
  import {judgeLimit} from '../../../untils/common'

  export default {
    data: function () {
      // 验证输入金额
      let validateUpdateAmount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('金额不能为空'))
        } else if (value) {
          if (Number.parseFloat(value) > this.breaksPostParam.maxUpdateScope ||
            Number.parseFloat(value) < this.breaksPostParam.minUpdateScope) {
            callback(new Error('修改金额不在可改范围'))
          } else {
            callback()
          }
        }
      }
      let validateUpdateRemark = (rule, value, callback) => {
        if (!value) {
          callback(new Error('修改原因不能为空'))
        } else if (value.length > 100) {
          callback(new Error('修改原因最大长度不能超过100字'))
        } else {
          callback()
        }
      }
      return {
        postParam: {
          orderId: this.$route.query.orderId
        },
        propActiveName: this.$route.query.activeName,
        activeName: '1',
        dialogTableVisible: false,
        /*
        *0.5.0
        * 减免金额参数
        */
        breaksDialogFormVisible: false, // 弹框
        formLabelWidth: '150px',
        breaksPostParam: {
          updateAmount: '', // 修改的金额
          waitRepayAmount: null, // 待还金额
          minUpdateScope: null, // 最小修改范围
          maxUpdateScope: null, // 最大修改范围
          updateRemark: null // 修改原因
        },
        updateAmount: '',
        breaksAmount: '', // 减免金额
        rules: {
          updateAmount: [
            {required: true, validator: validateUpdateAmount, trigger: 'blur'}
          ],
          updateRemark: [
            {required: true, validator: validateUpdateRemark, trigger: 'blur'}
          ]
        },
        // 减免执行接口
        breaksPerformParams: {
          remitAmount: '', // 减免金额
          remark: '', // 备注
          phaseId: '' // 其次id
        },
        breaksOneWrapper: true,
        breaksTwoWrapper: false,
        breaksThreeWrapper: false,
        breaksFourWrapper: false,
        transactionNumber: '', // 交易编号
        errorReason: '', // 失败原因
        payOneDetailData: null,
        detailMenuId: 42,
        reimbursementMenuId: 43,
        singleMenuId: 44
      }
    },
    computed: {
      ...mapState(['fixedField', 'loanDetailDataInfo', 'loanDetailDataPlan', 'refreshLoanDetailDataType', 'refreshLoanDetailType', 'setSinglePhaseStatus', 'dialogBackOne']),
      showExportBtnM: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.detailMenuId)
      },
      showExportBtnR: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.reimbursementMenuId)
      },
      showExportBtnMS: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.singleMenuId)
      }
    },
    components: {backall, backone},
    beforeDestroy() {
      this.$store.commit('refreshLoanDetailInfo', false)
      this.$store.commit('refreshLoanDetailPlan', false)
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 初始化借款详情-借款信息数据
      this.getLoanDetailInfo(this.postParam)
      // 初始化借款详情-还款计划表数据
      this.getLoanDetailPlan(this.postParam)
    },
    methods: {
      ...mapActions(['getLoanDetailInfo', 'getLoanDetailPlan', 'getBackOne', 'payOneDetail', 'buttonLimit']),
      onkeyup(event) {
        this.breaksPostParam.updateAmount = this.breaksPostParam.updateAmount.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        this.breaksPostParam.updateAmount = this.breaksPostParam.updateAmount.replace(/^\./g, '') // 验证第一个字符是数字而不是.
        this.breaksPostParam.updateAmount = this.breaksPostParam.updateAmount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
        this.breaksPostParam.updateAmount = this.breaksPostParam.updateAmount.replace(/^(\d+)\.(\d\d).*$/, '$1.$2') // 只保留第一个. 清除多余的.
        this.breaksPostParam.updateAmount = this.breaksPostParam.updateAmount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      },
      // 切换 tab 刷新页面
      handleClick() {
        if (Number.parseInt(this.activeName) === 1) {
          this.getLoanDetailInfo(this.postParam)
        } else if (Number.parseInt(this.activeName) === 2) {
          this.getLoanDetailPlan(this.postParam)
        }
      },
      // 查看明细
      lookDetail(row) {
        axios.post('loan/phase/detail', {id: row.id}).then(res => {
          if (res.data.code === 200) {
            this.payOneDetailData = res.data.body
            this.dialogTableVisible = true
          } else {
            this.dialogTableVisible = false
            this.$message.error(res.data.message)
          }
        })
        // this.payOneDetail({id: row.id})
      },
      // 单期还款
      payOne(row) {
        // 获取单期还款数据
        if (parseInt(row.repayButtonState) === 1) {
          this.getBackOne({id: row.id})
          this.$store.commit('showBackOne', true)
        }
        if (parseInt(row.repayButtonState) === 2) {
        }
      },
      // 支付记录
      payRecord(row) {
        this.$router.push({
          path: '/nav/finance/transferDetail',
          query: {
            withholdOrderId: row.withholdOrderId
          }
        })
      },
      // 查看合同
      lookContract(lable) {
        let host = window.location.origin
        window.open(`${host}/api/loan/contract?orderId=${this.$route.query.orderId}&type=${lable}`, '_blank')
      },
      loadAgain() {
        this.getLoanDetailInfo({orderId: this.$route.query.orderId})
        this.getLoanDetailPlan(this.postParam)
        if (this.refreshLoanDetailType && this.refreshLoanDetailDataType) {
          this.$message.success('刷新成功')
        }
      },
      // 减免操作 入口
      breaks(row) {
        this.breaksPerformParams.phaseId = row.id
        this.breaksDialogFormVisible = true
        this.breaksPostParam.waitRepayAmount = row.waitRepayAmount
        this.breaksPostParam.minUpdateScope = row.waitRepayPrincipalAmount
        this.breaksPostParam.maxUpdateScope = (Number.parseFloat(row.waitRepayAmount) - 0.01).toFixed(2)
      },
      // 取消
      cancel(formName) {
        this.breaksDialogFormVisible = false
        this.breaksPostParam.updateAmount = ''
        this.breaksPostParam.updateRemark = ''
        this.$refs[formName].resetFields()
      },
      // 下一步
      nextStep(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updateAmount = this.breaksPostParam.updateAmount
            this.breaksPerformParams.remark = this.breaksPostParam.updateRemark
            this.breaksOneWrapper = false
            this.breaksTwoWrapper = true
            this.breaksAmount = (Number.parseFloat(this.breaksPostParam.waitRepayAmount) - Number.parseFloat(this.breaksPostParam.updateAmount)).toFixed(2)
            this.$refs[formName].resetFields()
          } else {
            // console.log('error submit!!')
            // return false
          }
        })
      },
      // 上一步
      prevStep() {
        this.breaksOneWrapper = true
        this.breaksTwoWrapper = false
      },
      // 关闭弹框
      closeDialog(formName) {
        this.breaksDialogFormVisible = false
        this.breaksPostParam.updateAmount = ''
        this.breaksPostParam.updateRemark = ''
        this.breaksOneWrapper = true
        this.breaksTwoWrapper = false
        this.breaksThreeWrapper = false
        this.breaksFourWrapper = false
        this.$refs[formName].resetFields()
      },
      // 确认减免
      breaksSure() {
        this.breaksPerformParams.remitAmount = this.breaksAmount
        this.breaksPostParam.updateAmount = this.updateAmount
        this.breaksTwoWrapper = false
        axios.post('phase/remit', this.breaksPerformParams).then(res => {
          this.breaksPostParam.updateAmount = ''
          this.breaksPostParam.updateRemark = ''
          if (res.data.code === 200) {
            this.breaksThreeWrapper = true
            this.transactionNumber = res.data.body
            this.getLoanDetailPlan(this.postParam) // 刷新页面
          } else if (Number.parseInt(res.data.code) === 511) {
            this.$message.error(res.data.message)
            this.cancel('ruleFormOne')
          } else {
            this.breaksFourWrapper = true
            this.errorReason = res.data.body
          }
        })
      },
      // 获取状态结果后关闭弹框
      resultsClose(formName) {
        this.breaksDialogFormVisible = false
        this.breaksThreeWrapper = false
        this.breaksFourWrapper = false
      }
    },
    watch: {
      setSinglePhaseStatus(old, val) {
        this.dialogTableVisible = true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .table_left {
    width: 15%;
    text-align: left;
  }

  .table_right {
    padding-left: 100px;
  }

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .bm {
    border-bottom: 1px solid #E6E6E6;
  }

  .look {
    &:hover {
      cursor: pointer;
    }
  }

  .iconfont {
    width: 50px;
    font-size: 50px;
    margin-left: 20px;
    vertical-align: bottom;
    background: #EEF1F6;
    &:hover {
      cursor: pointer;
    }
  }

  .ban {
    &:hover {
      color: #909399;
      cursor: not-allowed;
    }
  }

  .self_gray {
    color: #909399 !important;
  }

  .visited {
    &:visited {
      color: #909399;
    }
  }

  .active {
    &:active {
      color: #909399;
    }
  }

  .el-form-item {
    margin-bottom: 10px;
  }
</style>
