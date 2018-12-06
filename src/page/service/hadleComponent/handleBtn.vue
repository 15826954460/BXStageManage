<template>
  <div class="abs" style="right:0;top:0;"
       v-show="Number.parseInt(activeName) !== 3 && Number.parseInt(activeName) !== 2">
    <el-button v-if="Number.parseInt(method) === 0"
               v-for="(item, index) in lendingHandleList"
               :type="item.color" class="btn" size="small"
               style="min-width:80px" :disabled="handleDetail.releaseSusFlag === 0 && item.code === 201"
               @click.stop="handleBtn(item.code)" :key="index">
      {{item.value}}
    </el-button>
    <el-button v-if="Number.parseInt(method) === 1"
               v-for="(item, index) in backHandList"
               :type="item.color" class="btn" size="small"
               style="min-width:80px" :disabled="handleDetail.repaySusFlag === 0 && item.code === 301"
               @click.stop="handleBtn(item.code)" :key="index">
      {{item.value}}
    </el-button>

    <!--todo:置为放款成功-->
    <el-dialog title="置为放款成功" :visible.sync="lendingSuccess" width="500px"
               @close="lendingSuccess = false">
      <p class="success">是否确认将该笔订单，置为放款成功？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lendingSuccess = false" size="small">取 消</el-button>
        <el-button type="primary" @click="commonHandle" size="small">确定</el-button>
      </div>
    </el-dialog>

    <!--todo:重新放款-->
    <el-dialog title="重新放款" :visible.sync="lendingAgain" width="500px"
               @close="lendingAgain = false">
      <p class="yellow">是否确认对该笔订单关联的借款订单，进行重新放款？</p>
      <p>说明：重新放款后，如需查看交易结果，需到支付中心查看。</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lendingAgain = false" size="small">取 消</el-button>
        <el-button type="primary" @click="commonHandle" size="small">确定</el-button>
      </div>
    </el-dialog>

    <!--todo:置为放款失败-->
    <el-dialog title="置为放款失败" :visible.sync="lendingError" width="500px"

               @close="lendingError = false">
      <p class="mb14">
        <span style="width:100px" class="pr14">操作:</span>
        <el-button type="primary" size="small">结束订单</el-button>
      </p>
      <p class="danger mb8">
        <span class="iconfont danger" style="margin-right: 10px">&#xe644;</span>
        是否确认将该笔订单置为放款失败，并将借款订单置为已关单。
      </p>
      <p>说明：置为放款失败后，该笔订单不能再发起放款。</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lendingError = false" size="small">取 消</el-button>
        <el-button type="primary" @click="commonHandle" size="small">确定</el-button>
      </div>
    </el-dialog>

    <!--todo:置为还款成功-->
    <el-dialog title="置为还款成功" :visible.sync="backSuccess" width="500px"
               @close="backSuccess = false">
      <p class="success">是否确认将该笔订单，置为还款成功？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backSuccess = false" size="small">取 消</el-button>
        <el-button type="primary" @click="commonHandle" size="small">确定</el-button>
      </div>
    </el-dialog>

    <!--todo:置为还款失败-->
    <el-dialog title="置为还款失败" :visible.sync="backError" width="500px"
               @close="backError = false">
      <p class="danger">是否确认将该笔订单，置为还款失败？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="backError = false" size="small">取 消</el-button>
        <el-button type="primary" @click="commonHandle" size="small">确定</el-button>
      </div>
    </el-dialog>

    <!--todo: 备注弹框-->
    <el-dialog title="备注" :visible.sync="remarkVisible" width="500px"
                @close="cancelRemarkVisible('ruleForm')">
      <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm"
                 label-width="100px">
          <el-form-item label="添加备注：" prop="remark">
            <el-input type="textarea" placeholder="请输入内容" v-model="ruleForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelRemarkVisible('ruleForm')" size="small">取 消</el-button>
        <el-button type="primary" @click="sureRemarkVisible('ruleForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!--todo: 挂起弹框-->
    <el-dialog title="挂起" :visible.sync="hangVisible" width="500px"
                @close="cancelHangVisible">
      <el-form label-width="100px">
        <el-form-item label="操作：">
          <el-button type="primary" size="small">挂起</el-button>
        </el-form-item>
        <el-form-item label="添加备注：">
          <el-input type="textarea" v-model="remark" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelHangVisible" size="small">取 消</el-button>
        <el-button type="primary" @click="commonHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <!--todo: 发送短信-->
    <el-dialog title="发送短信" :visible.sync="sendMessageVisible" width="500px"
                @close="cancelSendMessage">
      <el-form label-width="100px">
        <el-form-item label="操作：">
          <el-button :type="Number.parseInt(messageModuleType) === 3 ? 'primary' : ''" size="small"
                     @click="messageModuleType = 3">对公短信
          </el-button>
          <el-button :type="Number.parseInt(messageModuleType) === 4 ? 'primary' : ''" size="small"
                     @click="messageModuleType = 4">超时短信
          </el-button>
        </el-form-item>
        <el-form-item label="短信内容：" prop="remark">
          <div style="background:#F9F9F9; width:100%;" class="pd10"
               v-html="Number.parseInt(messageModuleType) === 3 ? messageModule.companySms : messageModule.timeoutSms">
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelSendMessage" size="small">取 消</el-button>
        <el-button type="primary" @click="commonHandle" size="small">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'

  export default {
    data: function () {
      return {
        // 放款异常处理操作  501.退出， 201.置为放款成功,202.重新放款,203.置为放款失败 100.备注,101.挂起
        lendingHandleList: [
          {value: '置为放款成功', color: 'success', code: 201},
          {value: '重新放款', color: 'primary', code: 202},
          {value: '置为放款失败', color: 'danger', code: 203},
          {value: '备注', color: '', code: 100},
          {value: '挂起', color: '', code: 101},
          {value: '退出', color: '', code: 501}
        ],
        backHandList: [
          {value: '置为还款成功', color: 'success', code: 301},
          {value: '置为还款失败', color: 'danger', code: 302},
          {value: '发送短信', color: 'primary', code: 304},
          {value: '备注', color: '', code: 100},
          {value: '挂起', color: '', code: 101},
          {value: '退出', color: '', code: 501}
        ],
        ruleForm: {
          remark: ''
        },
        rules: {
          remark: [
            {required: true, message: '请输入备注信息', trigger: 'blur'},
            {min: 1, max: 500, message: '长度在 1 到 500 个字符之间', trigger: 'blur'}
          ]
        },
        lendingSuccess: false,
        lendingError: false,
        backSuccess: false,
        lendingAgain: false,
        backError: false,
        remarkVisible: false,
        hangVisible: false,
        sendMessageVisible: false,
        messageModuleType: 3, // 短信显示模板的控制变量
        method: this.$route.query.method,
        activeName: this.$route.query.activeName,
        id: this.$route.query.id,
        remark: '', // 备注
        handleCode: null, // 处理操作类型状态码
        messageModule: {} // 短信模板
      }
    },
    computed: {
      ...mapState(['handleDetail'])
    },
    mounted() {
      // 获取短信模板
      if (Number.parseInt(this.$route.query.method) === 1) {
        axios.post('cs/findTemplate', {id: this.$route.query.id}).then(res => {
          if (res.data.code === 200) {
            this.messageModule = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    methods: {
      ...mapActions(['getHandleRecordsList']),
      // 点击处理按钮
      handleBtn(code) {
        this.handleCode = code
        switch (code) {
          case 201:
            this.lendingSuccess = true
            break
          case 202:
            this.lendingAgain = true
            break
          case 203:
            this.lendingError = true
            break
          case 301:
            this.backSuccess = true
            break
          case 302:
            this.backError = true
            break
          case 304:
            this.sendMessageVisible = true
            axios.post('cs/findTemplate', {
              id: this.id
            }).then(res => {
              if (res.data.code === 200) {
//                this.$message.success(res.data.message)
                this.messageModule = res.data.body
              } else {
                this.$message.error(res.data.message)
              }
            })
            break
          case 100:
            this.remarkVisible = true
            break
          case 101:
            this.hangVisible = true
            break
          case 501:
            this.handle(code)
            break
        }
      },
      // 关闭所有弹框
      closeAllDialog() {
        this.lendingSuccess = false
        this.lendingError = false
        this.backSuccess = false
        this.lendingAgain = false
        this.backError = false
        this.remarkVisible = false
        this.hangVisible = false
        this.sendMessageVisible = false
      },
      // 确认处理操作
      handle(code) {
        this.closeAllDialog()
        axios.post('cs/csOperatorByType', {
          id: this.id,
          remark: this.remark,
          smsTemp: this.messageModuleType,
          type: code
        }).then(res => {
          if (res.data.code === 200) {
            if (this.handleCode !== 501) {
              this.$message.success(res.data.message)
            }
            // 发送短信
            if (this.handleCode === 304) {
              // 刷新页面中的处理数据
              this.getHandleRecordsList({id: this.$route.query.id})
            }
            // 备注
            if (this.handleCode === 100) {
              this.remark = this.ruleForm.remark = ''
              // 刷新页面中的处理数据
              this.getHandleRecordsList({id: this.$route.query.id})
            }
            // 挂起
            if (this.handleCode === 101) {
              this.remark = ''
            }
            // 除了备注和发送短信，处理成功跳回到列表页面
            if (this.handleCode !== 100 && this.handleCode !== 304) {
              if (Number.parseInt(this.$route.query.method) === 0) {
                this.$router.push({path: '/nav/service/releaseList'})
              } else {
                this.messageModuleType = 3 // 默认恢复显示对公短信
                this.$router.push({path: '/nav/service/repaymentList'})
              }
            }
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      commonHandle() {
        // 如果挂起备注超过500就不请求接口
        if (Number.parseInt(this.handleCode) === 101 && this.remark.length > 500) {
          this.$message.error('备注不能超过500字')
          this.remark = ''
          this.hangVisible = false
          return
        }
        this.handle(this.handleCode)
      },
      // 取消发送短信
      cancelSendMessage() {
        this.sendMessageVisible = false
        this.messageModule = {}
        this.messageModuleType = 3
      },
      // 取消挂起
      cancelHangVisible() {
        this.remark = ''
        this.hangVisible = false
      },
      // 确定备注
      sureRemarkVisible(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.handleCode === 100 && this.ruleForm.remark) {
              this.remark = this.ruleForm.remark
              this.handle(this.handleCode)
            }
          } else {
            return false
          }
        })
      },
      // 取消备注
      cancelRemarkVisible(formName) {
        this.remarkVisible = false
        this.$refs[formName].resetFields()
        this.remark = ''
      }
    }
  }
</script>
<style scoped lang="less">
</style>
