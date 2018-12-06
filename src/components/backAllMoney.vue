<template>
  <div>
    <table class="collapse mb14" v-if="loanDetailDataPlan" style="width:70%">
      <tbody>
      <tr class="lh32">
        <td class="gray w200">期次金额(总计)</td>
        <td class="bm">{{loanDetailDataPlan.allRepayAmount | toThousands}}</td>
      </tr>
      <tr class="lh32">
        <td class="gray w200">已还(总计)</td>
        <td class="bm flex">
          <span>{{loanDetailDataPlan.allAlreadyRepayAmount | toThousands}}</span>
          <span class="success" v-show="loanDetailDataPlan.additionalPaid">
            溢缴{{loanDetailDataPlan.additionalPaid | toThousands}}
          </span>
        </td>
      </tr>
      <tr class="lh32">
        <td class="gray w200">减免(总计)</td>
        <td class="bm">{{loanDetailDataPlan.allAnnulRepayAmount | toThousands}}</td>
      </tr>
      <tr class="lh32">
        <td class="gray w200">待还款(总计)</td>
        <td class="bm">{{loanDetailDataPlan.allWaitRepayAmount | toThousands}}</td>
      </tr>
      <!--还款已结清就不显示-->
      <tr class="lh32" v-if="loanDetailDataPlan.buttonState === 1">
        <td class="gray w200">整笔结清，最低还款额</td>
        <td class="flex pt10">
          <span>{{loanDetailDataPlan.repayAllNeedAmount | toThousands}}</span>
          <p>
            <el-button :type="parseInt(loanDetailDataPlan.repayAllButtonState) === 2 ? 'info' : 'primary'"
                       class="ml40" v-show="showExportBtnF"
                       @click="showDialog()">
              整笔还款
            </el-button>
            <el-button type="primary" @click="breaksEntry" v-show="showExportBtnH">
              还款录入
            </el-button>
          </p>
        </td>
      </tr>
      </tbody>
    </table>
    <!--TODO：富有扣款-->
    <el-dialog :title="(dialogWrapperFour || dialogWrapperThree) ? '' : dialogWrapperTwo ? '还款确认' : '整笔还款'"
               :visible.sync="dialogFormVisibleOne" width="500px" top="20%" @close="close">
      <div class="dialog-wrapper-one" v-show="dialogFormVisibleOne && dialogWrapperOne">
        <div class="tc" v-if="backAll">
          <p class="mb8">待还(总计): {{backAll.allRepayAmount | toThousands}}</p>
          <p class="mb8">整笔结清可减免：{{backAll.annulRepayAmount | toThousands}}</p>
          <p class="bt inb">减免后需还：{{backAll.needRepayAmount | toThousands}}</p>
        </div>
        <div slot="footer" class="dialog-footer tr pr20">
          <el-button @click="close" size="small">取消</el-button>
          <el-button type="primary" @click="nextStep" size="small">下一步</el-button>
        </div>
      </div>

      <div class="dialog-wrapper-two" v-show="dialogWrapperTwo">
        <div v-if="backAll">
          <p class="tc">
            <span class="gray inb_span" style="text-align: center">还款金额</span>
          </p>
          <p class="f24 mb8 mt8 tc">{{backAll.needRepayAmount | toThousands}}</p>
          <p class="mb8 pa_l100">
            <span class="gray mr14">还款至商户号: </span>
            <span :v-html="backAll.funder === 1 ? '淮南' : '荷包'">{{backAll.funder}}</span>
          </p>
          <p class="mb8 pa_l100">
            <span class="gray">还款支付渠道：</span>
            <el-select v-model="withholdChannel" size="small">
              <el-option
                v-for="item in backAll.withholdChannels"
                :key="item.withholdChannel"
                :label="item.withholdChannelName"
                :value="item.withholdChannel">
              </el-option>
            </el-select>
          </p>
        </div>
        <div slot="footer" class="dialog-footer  tr pr20">
          <el-button @click="close" size="small">取消</el-button>
          <el-button type="primary" @click="sure(backAll)" size="small">确定</el-button>
        </div>
      </div>

      <div class="dialog-wrapper-three" v-show="dialogWrapperThree">
        <div class="tc">
          <p class="f24 mb8 mt8 flex h80 lh80 jusc">
            <span class="iconfont success mr24">&#xe62c;</span>
            <span class="success f24">还款提交成功</span>
          </p>
          <p class="mb8">还款结果以支付订单结果为准</p>
          <p class="mb8"><span>交易编号：</span>{{insertOrderNo}}</p>
        </div>
        <div slot="footer" class="dialog-footer  tr pr20">
          <el-button @click="lookPayOrder" size="small">查看支付订单</el-button>
          <el-button type="primary" @click="close(true)" size="small">关闭</el-button>
        </div>
      </div>

      <div class="dialog-wrapper-four" v-show="dialogWrapperFour">
        <div class="tc">
          <p class="f24 mb8 mt8 flex h80 lh80 jusc">
            <span class="iconfont error mr24">&#xe64a;</span>
            <span class="error f24">还款提交失败</span>
          </p>
          <p class="mb8" v-show="insteadOrderId"><span>交易编号：</span>{{insertOrderNo}}</p>
          <p class="mb8"><span>失败原因：</span>{{errorReason}}</p>
        </div>
        <div slot="footer" class="dialog-footer  tr pr20">
          <el-button type="primary" @click="close" size="small">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!--todo:还款录入-->
    <el-dialog :title="breaksOneWrapper ? '还款录入' : breaksTwoWrapper ? '确认金额' : ''"
               :visible.sync="breaksDialogFormVisible"
               @close="closeDialog('ruleForm')"
               :breaksDialogFormVisible="false" width="500px">
      <el-form :model="breaksPostParam" ref="ruleForm" :rules="rules" v-show="breaksOneWrapper">
        <el-form-item label="借款待还金额：" :label-width="formLabelWidth">
          <span>{{breaksPostParam.waitAmount | toThousands}}</span>
        </el-form-item>
        <el-form-item label="整笔结清，最低还款额：" :label-width="formLabelWidth">
          <span>{{breaksPostParam.minBreaksAmount | toThousands}}</span>
        </el-form-item>
        <el-form-item label="本次录入金额：" :label-width="formLabelWidth" prop="userBreaksAmount">
          <el-input v-model="breaksPostParam.userBreaksAmount" size="small"
                    @keyup.native="onkeyup($event)"></el-input>
        </el-form-item>
        <el-form-item label="用户还款时间：" :label-width="formLabelWidth" prop="breaksTime">
          <el-date-picker
            :picker-options="endDateOpt"
            style="width: 100%;"
            v-model="breaksPostParam.breaksTime"
            @change="selectTime()" size="small"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="nextStepAboutEntry('ruleForm')" size="small">下一步</el-button>
        </el-form-item>
      </el-form>

      <div v-if="breaksTwoWrapper && sureData">
        <p class="gray tc mb8">还款录入金额</p>
        <p class="f30 tc mb20">{{paramNextStep.repayAmount | toThousands}}</p>
        <p class="flex bm" style="border-top:1px solid #E6E6E6;height:40px;line-height: 40px">
          <span class="gray">用户还款时间</span>
          <span>{{sureData.backTime | dateTime}}</span>
        </p>
        <p class="flex bm" style="height:40px;line-height: 40px"
           v-show="Number.parseFloat(sureData.remitAmount) > 0">
          <span class="gray">可整笔结清，将自动减免</span>
          <span>{{sureData.remitAmount | toThousands}}</span>
        </p>
        <p class="flex bm mb20" style="height:40px;line-height: 40px"
           v-show="Number.parseFloat(sureData.overpaidAmount) > 0">
          <span class="gray">溢缴金额</span>
          <span>{{sureData.overpaidAmount | toThousands}}</span>
        </p>
        <div class="tr mt20">
          <el-button @click="prevStep()" size="small">上一步</el-button>
          <el-button type="primary" @click="breaksSure" size="small">确定</el-button>
        </div>
      </div>

      <div v-show="breaksThreeWrapper">
        <p class="gray" style="display: flex;justify-content: center;padding-top: 60px;margin-bottom: 30px">
          <span class="iconfont" style="color: #1AC604;margin-right: 10px;align-items: center;">&#xe62c;</span>
          <span style="color: #1AC604" class="f20">还款录入成功</span>
        </p>
        <p class="tc mb20">交易编号: {{transactionNumber}}</p>
        <div class="tr">
          <el-button type="primary" @click="resultsClose" size="small">关闭</el-button>
        </div>
      </div>

      <div v-show="breaksFourWrapper">
        <p class="gray" style="display: flex;justify-content: center;padding-top: 60px;margin-bottom: 30px">
          <span class="iconfont danger" style="margin-right: 10px;align-items: center;">&#xe64a;</span>
          <span class="danger">还款录入失败</span>
        </p>
        <p class="mb20 tc">失败原因: {{entryErrorReason}}</p>
        <div class="tr">
          <el-button type="primary" @click="resultsClose('ruleForm')" size="small">关闭</el-button>
        </div>
      </div>

    </el-dialog>
  </div>

</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import {filterTime, judgeLimit} from '../untils/common'

  export default {
    data: function () {
      let validateUserBreaksAmount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('用户还款金额不能为空'))
        } else if (value) {
          if (Number.parseFloat(value) < 0.01 || Number.parseFloat(value) > 20000.00) {
            callback(new Error('还款金额不在0.01~20000.00之间'))
          } else {
            callback()
          }
        }
      }
      return {
        // 限制当前时间不可选
        endDateOpt: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },
        activeName: this.$route.query.activeName,
        orderId: this.$route.query.orderId,
        dialogFormVisibleOne: false,
        dialogWrapperOne: true,
        dialogWrapperTwo: false,
        dialogWrapperThree: false,
        dialogWrapperFour: false,
        errorReason: '', // 提交失败原因
        insteadOrderId: '', // 代付订单号
        insertOrderNo: '', // 内部交易单号
        /*
        * 还款录入 0.5.0
        */
        formLabelWidth: '200px',
        breaksPostParam: {
          waitAmount: '', // 借款待还金额
          minBreaksAmount: '', // 整笔结清，最低还款金额
          userBreaksAmount: '', // 用户还款金额
          breaksTime: '' // 还款时间
        },
        rules: {
          userBreaksAmount: [
            {required: true, validator: validateUserBreaksAmount, trigger: 'blur'}
          ],
          breaksTime: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ]
        },
        // 还款录入下一步 接口参数
        paramNextStep: {
          loanOrderNo: this.$route.query.orderId, // 借款单号
          repayAmount: '', // 还款录入金额
          backTime: '' // 还款时间
        },
        backAll: null, // 富有扣款的信息
        breaksDialogFormVisible: false,
        breaksOneWrapper: true,
        breaksTwoWrapper: false,
        breaksThreeWrapper: false,
        breaksFourWrapper: false,
        sureData: null, // 确认弹框中的数据
        transactionNumber: '', // 交易编号
        entryErrorReason: '', // 失败原因
        menuIdF: 40,
        menuIdH: 41,
        withholdChannel: null,
        allowPost: true
      }
    },
    computed: {
      ...mapState(['loanDetailDataPlan']),
      showExportBtnF: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.menuIdF)
      },
      showExportBtnH: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.menuIdH)
      }
    },
    created() {
      // 每次进入页面都进行刷新
      this.buttonLimit()
    },
    methods: {
      ...mapActions(['getBackAll', 'sureBackAll', 'getLoanDetailInfo', 'getLoanDetailPlan', 'buttonLimit']),
      onkeyup(event) {
        this.breaksPostParam.userBreaksAmount = this.breaksPostParam.userBreaksAmount.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
        this.breaksPostParam.userBreaksAmount = this.breaksPostParam.userBreaksAmount.replace(/^\./g, '') // 验证第一个字符是数字而不是.
        this.breaksPostParam.userBreaksAmount = this.breaksPostParam.userBreaksAmount.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
        this.breaksPostParam.userBreaksAmount = this.breaksPostParam.userBreaksAmount.replace(/^(\d+)\.(\d\d).*$/, '$1.$2') // 只保留第一个. 清除多余的.
        this.breaksPostParam.userBreaksAmount = this.breaksPostParam.userBreaksAmount.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      },
      // 整笔还款
      showDialog(type) {
        axios.post('charge/checkMannualPay', {loanOrderNo: this.$route.query.orderId}).then(res => {
          if (res.data.code === 200) {
            axios.post('loan/phase/repayAllInfo', {orderId: this.$route.query.orderId}).then((res) => {
              if (res.data.code === 200) {
                this.dialogFormVisibleOne = this.dialogWrapperOne = true
                this.backAll = res.data.body
                this.withholdChannel = res.data.body.withholdChannels[0].withholdChannel
              } else {
                this.$message.error(res.data.message)
                this.dialogFormVisibleOne = this.dialogWrapperOne = false
              }
            })
            // this.getBackAll({orderId: this.$route.query.orderId})
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 下一步
      nextStep() {
        this.dialogWrapperOne = false
        this.dialogWrapperTwo = true
      },
      // 确定
      sure(backAll) {
        if (!this.allowPost) return
        this.allowPost = false
        this.dialogWrapperTwo = false
        // 借款管理--借款详情-还款计划表--确认全部还款
        axios.post('/loan/phase/repayAllDo', {
          loanOrderNo: backAll.orderId,
          funder: backAll.funder,
          withholdChannel: this.withholdChannel
        }).then((res) => {
          if (res.data.code === 200) {
            this.allowPost = true
            this.dialogWrapperThree = true
            // 初始化借款详情-借款信息数据
            this.getLoanDetailInfo({orderId: this.$route.query.orderId})
            // 初始化借款详情-还款计划表数据
            this.getLoanDetailPlan({orderId: this.$route.query.orderId})
          } else if (res.data.code === 400) {
            this.close()
            this.$message.error(res.data.message)
            this.allowPost = true
          } else {
            this.dialogWrapperFour = true
            this.errorReason = res.data.body.descript
          }
          this.dialogWrapperOne = this.dialogWrapperTwo = false
          this.insteadOrderId = res.data.body.orderId
          this.insertOrderNo = res.data.body.orderNo
        })
      },
      // 查看支付订单
      lookPayOrder() {
        this.$router.push({
          path: '/nav/finance/transferDetail',
          query: {
            withholdOrderId: this.insteadOrderId
          }
        })
        this.dialogFormVisibleOne = false
      },
      // 还款录入
      breaksEntry() {
        axios.post('charge/checkMannualPay', {loanOrderNo: this.$route.query.orderId}).then(res => {
          if (res.data.code === 200) {
            this.breaksDialogFormVisible = true
            this.breaksPostParam.waitAmount = this.loanDetailDataPlan.allWaitRepayAmount
            this.breaksPostParam.minBreaksAmount = this.loanDetailDataPlan.repayAllNeedAmount
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 选择时间
      selectTime() {
        this.paramNextStep.backTime = filterTime(this.breaksPostParam.breaksTime, 'dateTime')
      },
      // 还款录入中的下一步
      nextStepAboutEntry(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.paramNextStep.repayAmount = this.breaksPostParam.userBreaksAmount
            axios.post('loan/mannualPayShow', this.paramNextStep).then(res => {
              if (res.data.code === 200) {
                this.breaksOneWrapper = false
                this.breaksTwoWrapper = true
                this.sureData = res.data.body
                this.$refs[formName].resetFields()
              } else {
                this.$message.error(res.data.message)
              }
            })
          } else {
            return false
          }
        })
      },
      // 一步
      prevStep() {
        this.breaksOneWrapper = true
        this.breaksTwoWrapper = false
      },
      // 确认金额
      breaksSure() {
        this.breaksTwoWrapper = false
        axios.post('loan/mannualPayDo', this.paramNextStep).then(res => {
          if (res.data.code === 200) {
            this.breaksThreeWrapper = true
            this.transactionNumber = res.data.body
            this.getLoanDetailPlan({orderId: this.$route.query.orderId})
          } else if (Number.parseInt(res.data.code) === 511) {
            this.$message.error(res.data.message)
            this.breaksDialogFormVisible = false
            this.breaksThreeWrapper = false
            this.breaksFourWrapper = false
            this.breaksPostParam.userBreaksAmount = ''
            this.breaksPostParam.breaksTime = ''
          } else {
            this.breaksFourWrapper = true
            this.entryErrorReason = res.data.body
          }
        })
      },
      // 取消
      cancel(formName) {
        this.$refs[formName].resetFields()
        this.breaksDialogFormVisible = false
        this.breaksPostParam.userBreaksAmount = ''
        this.breaksPostParam.breaksTime = ''
      },
      // 关闭
      close(val) {
        this.dialogFormVisibleOne = false
        this.dialogWrapperOne = true
        this.dialogWrapperTwo = false
        this.dialogWrapperThree = false
        this.dialogWrapperFour = false
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
      // 获取状态结果后关闭弹框
      resultsClose(formName) {
        this.breaksDialogFormVisible = false
        this.breaksThreeWrapper = false
        this.breaksFourWrapper = false
        this.breaksPostParam.userBreaksAmount = ''
        this.breaksPostParam.breaksTime = ''
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

  .flex {
    display: flex;
    justify-content: space-between;
  }

  .jusc {
    justify-content: center;
  }

  .w200 {
    width: 180px;
  }

  .bm {
    border-bottom: 1px solid #E6E6E6;
  }

  .iconfont {
    font-size: 40px;
  }
  .pa_l100 {
    padding-left: 100px;
  }
  .pa_l80 {
    padding-left: 80px;
  }

  .inb_span{
    display: inline-block;
    width: 100px;
    text-align: right;
  }
</style>
