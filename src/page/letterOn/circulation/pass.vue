<template>
  <div class="pass" v-if="circulation.passShow">
    <el-card style="min-height:100vh;">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">通过</span>
        <i style="float:right;position:relative;top:10px;"
           class="el-icon-close" @click="hideContacts"></i>
      </div>
      <div class="text item">
        <el-form :model="passParam" :rules="rules" ref="passParam"
                 label-width="130px" class="demo-ruleForm">
          <el-form-item label="审批操作：">
            <el-button type="success" size="small">通过</el-button>
          </el-form-item>
          <el-form-item label="选择原因类型：" prop="remark">
            <el-checkbox-group v-if="circulation" v-model="codelist">
              <div v-for="(item, index) in circulation.codeTypeOptions">
                <el-checkbox @change="changeReason"
                             :label="item.code" :key="index">{{item.text}}
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="添加备注：">
            <el-input type="textarea" placeholder="请输入内容"
                      v-model="passParam.remark"></el-input>
          </el-form-item>
        </el-form>
        <div class="button_wrapper">
          <el-button @click="cancel()">取消</el-button>
          <el-button type="primary" @click="submitRemark">确定</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'

  export default {
    data: function () {
      return {
        codelist: [],
        // 通过接口参数
        passParam: {
          orderId: this.$route.query.orderId, // 借款编号
          codeStr: null, // 通过原因码
          remark: '' // 备注
        },
        rules: {
          remark: [
            {required: true, message: '请输入内容', trigger: 'blur'},
            {min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur'}
          ]
        },
        hrefType: this.$route.query.hrefType,
        pageType: this.$route.query.pageType
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
    },
    methods: {
      ...mapActions(['getLetterRecordsList']),
      // 关闭弹框
      hideContacts() {
        this.$store.commit('showContacts', false)
        this.passParam.remark = ''
        this.passParam.code = null
        this.codelist = []
      },
      // 选择原因
      changeReason() {
        console.log(this.codelist)
      },
      // 取消
      cancel() {
        this.passParam.remark = ''
        this.passParam.code = ''
        this.codelist = []
      },
      // 提交
      submitRemark() {
        if (this.codelist.length < 1) {
          this.$message.error('请选择通过原因')
          return
        }
        if (this.passParam.remark.length > 300) {
          this.$message.error('请输入5-300字以内的备注信息')
          return
        }
        if (this.codelist.length > 1) {
          this.passParam.codeStr = this.codelist.join(',')
        } else {
          this.passParam.codeStr = this.codelist[0]
        }
        this.fetch()
      },
      // 请求通过接口
      fetch() {
        axios.post('audit/pass', this.passParam)
          .then(res => {
            if (parseInt(res.data.code) === 200) {
              this.$message.success(res.data.message)
              this.codelist = []
              this.passParam.codeStr = ''
              this.passParam.remark = ''
              this.getLetterRecordsList({orderId: this.passParam.orderId})
              // 如果是通过点击接单进来的就进行分单操作
              if (parseInt(this.hrefType) === 2) {
                this.single()
                return
              }
              // 点击表单中的审批按钮，直接判断页面的跳转
              if (parseInt(this.pageType) === 2) {
                // 返回到审批订单池
                this.$router.push({path: '/nav/risk/auditList'})
              } else {
                // 返回到我的审批
                this.$router.push({path: '/nav/risk/myAuditList'})
              }
            } else {
              this.$message.error(res.data.message)
            }
          })
      },
      // 进件分单接口
      single() {
        axios.post('auditOrder/auditOrderSeperate').then(res => {
          if (res.data.code === 200) {
            //  授信订单
            if (parseInt(res.data.body.status) === 1) {
              // 刷新页面的 中间变量
              this.$store.commit('refreshAgain', !this.circulation.refreshAgain)
              this.$router.push({
                path: '/nav/risk/letterOrder',
                query: {
                  userId: res.data.body.userId,
                  orderId: res.data.body.orderId,
                  type: res.data.body.type
                }
              })
              // 重新显示通讯录
              this.$store.commit('showContacts', false)
              // 初始化基本信息的 tab
              if (this.circulation.tabType !== 1) {
                this.$store.commit('changeTabType', 1)
              }
              // 初始化订单记录的tab
              if (this.circulation.changeTabTypeInsert !== 1) {
                this.$store.commit('changeTabTypeInsert', 1)
              }
            } else {
              this.$message.error('不存在可审批的订单')
              this.$store.commit('refreshAgain', !this.circulation.refreshAgain)
              // 跳回列表
              if (parseInt(this.pageType) === 2) {
                // 返回到审批订单池
                this.$router.push({path: '/nav/risk/auditList'})
              } else {
                // 返回到我的审批
                this.$router.push({path: '/nav/risk/myAuditList'})
              }
            }
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.passParam.orderId = this.$route.query.orderId
//          alert(this.passParam.orderId)
        },
        deep: true
      },
      // 解决 流转 选择原因 切换到通过 提交 再次审批下一单流转类型依然存在的 bug
      'circulation.codeType': {
        handler: function (val, oldVal) {
          this.codelist = []
        },
        // 深度监听
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang=less>
  .button_wrapper {
    text-align: right;
  }
</style>
