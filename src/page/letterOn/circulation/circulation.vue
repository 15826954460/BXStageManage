<template>
  <div class="circulation"
       v-if="circulation.circulationShow">
    <el-card style="min-height:100vh;">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">流转</span>
        <i style="float:right;position:relative;top:10px;"
           class="el-icon-close" @click="hideContacts"></i>
      </div>
      <div class="text item">
        <el-form :model="parameter" :rules="rules" ref="parameter"
                 label-width="125px" class="demo-ruleForm">
          <el-form-item label="审批操作：">
            <el-button v-for="(item, index) in operationList" :key="index" size="small"
                       :type="index === activeButton ? 'primary' : ''"
                       @click="clickNegativeButton(index,item.codeType)">{{item.type}}
            </el-button>
          </el-form-item>
          <!-- 退回 -->
          <div v-show="activeButton === 0" v-if="circulation">
            <el-form-item label="选择原因类型：" prop="remark">
              <el-checkbox-group v-model="codelist">
                <div v-for="(item, index) in circulation.codeTypeOptions">
                  <el-checkbox size="small"
                               :label="item.code" :key="index"
                               :disabled="item.disabled">
                    <span class="f12">{{item.text}}</span>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <!-- 拒绝 -->
          <div v-show="activeButton === 1" v-if="circulation">
            <el-form-item label="选择原因类型：" prop="remark">
              <el-cascader :props="props" v-if="circulation.codeTypeOptions"
                           :change-on-select="false"
                           filterable
                           placeholder="试试搜索："
                           :options="circulation.codeTypeOptions"
                           v-model="selectedOptions"
                           @change="mselectedOptions">
              </el-cascader>
            </el-form-item>
          </div>

          <!-- 关闭 -->
          <div v-show="activeButton === 2" v-if="circulation">
            <el-form-item label="选择原因类型：" prop="remark">
              <el-cascader :props="props" v-if="circulation.codeTypeOptions"
                           :change-on-select="false"
                           filterable
                           placeholder="试试搜索："
                           :options="circulation.codeTypeOptions" v-model="selectedOptions"
                           @change="mselectedOptions">
              </el-cascader>
            </el-form-item>
          </div>

          <!-- 挂起 -->
          <div v-show="activeButton === 3" v-if="circulation">
            <el-form-item label="选择原因类型：" prop="remark">
              <el-checkbox-group v-model="codelist">
                <div v-for="(item, index) in circulation.codeTypeOptions">
                  <el-checkbox
                    :label="item.code" :key="index">
                    <span class="f12">{{item.text}}</span>
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <el-form-item label="添加备注：">
            <el-input type="textarea" placeholder="请输入内容"
                      v-model="parameter.remark"></el-input>
          </el-form-item>
        </el-form>
        <div class="button_wrapper">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="submit">确定</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import axios from 'axios'

  export default {
    data() {
      return {
        orderId: this.$route.query.orderId,
        channelName: this.$route.query.channelName,
        currentIndex: null,
        codelist: [],
        index: 0,
        hrefType: this.$route.query.hrefType,
        pageType: this.$route.query.pageType,
        props: {
          label: 'text',
          value: 'code',
          children: 'child'
        },
        // 接口参数
        parameter: {
          orderId: this.$route.query.orderId, // 借款编号
          codeStr: '', // 通过原因码
          remark: '', // 备注
          code: null
        },
        // 退回和挂起参数
        paramZeroAndThree: {
          orderId: null,
          codeStr: '',
          remark: ''
        },
        // 拒绝和关闭参数
        paramOneAndTwo: {
          orderId: null,
          remark: '',
          code: null
        },
        timer: null, // 定义定时器变量
        isCollapse: true,
        activeButton: 0,
        operationList: [
          {
            type: '退回',
            codeType: 3
          },
          {
            type: '拒绝',
            codeType: 2
          },
          {
            type: '关闭',
            codeType: 4
          },
          {
            type: '挂起',
            codeType: 5
          }
        ],
        selectedOptions: [],
        value: '',
        clickStraight: true, // 控制单位时长点击 按钮的有效次数
        rules: {
          remark: [
            {required: true, message: '请输入内容', trigger: 'blur'},
            {min: 5, max: 500, message: '长度在 5 到 500 个字符', trigger: 'blur'}
          ]
        },
        ApprovalRecordMenuId: Number.parseInt(this.$route.query.ApprovalRecordMenuId),
        RemarkRecordMenuId: Number.parseInt(this.$route.query.RemarkRecordMenuId)
      }
    },
    mounted() {
//      console.log(this.$route.query.orderId)
    },
    computed: {
      ...mapState(['circulation'])
    },
    // 清楚定时器
    beforeDestroy() {
      clearTimeout(this.timer)
    },
    methods: {
      ...mapActions(['getLetterRecordsList']),
      mselectedOptions() {
        this.parameter.code = this.selectedOptions[(this.selectedOptions.length - 1)]
      },
      // 关闭通讯录
      hideContacts() {
        this.$store.commit('showContacts', false)
        this.$store.commit('changeRightWidth', false)
        this.cancel()
      },
      // 切换tag
      clickNegativeButton(index, codeType) {
        if (Object.is(this.clickStraight, true)) {
          this.clickStraight = false
          if (parseInt(this.index) !== parseInt(index)) {
            this.index = index
            this.activeButton = index
            // 清空所有原因选项
            this.cancel()
            this.$store.commit('setCodeType', codeType)
          }
          // 定时改变状态
          this.timer = setTimeout(() => {
            this.clickStraight = true
          }, 500)
        }
      },
      // 取消
      cancel() {
        this.codelist = []
        this.selectedOptions = []
        this.parameter.codeStr = ''
        this.parameter.remark = ''
        this.parameter.code = ''
      },
      // 提交
      submit() {
        // 验证
        if (this.codelist.length < 1 && (this.index === 0 || this.index === 3)) {
          this.$message.error('请选择原因类型')
          return
        }
        if (this.parameter.remark.length > 500) {
          this.$message.error('请输入5-300字以内的备注信息')
          return
        }
        if (this.selectedOptions.length === 0 && (this.index === 1 || this.index === 2)) {
          this.$message.error('请选择原因类型')
          return
        }
        // 退回和挂起
        if (this.codelist.length > 1) {
          this.parameter.codeStr = this.codelist.join(',')
        } else {
          this.parameter.codeStr = this.codelist[0]
        }
        // 拒绝和关闭
        if (this.selectedOptions.length > 1) {
          this.parameter.code = this.selectedOptions[(this.selectedOptions.length - 1)]
        } else {
          this.parameter.code = this.selectedOptions[0]
        }
        // 设置请求接口的参数 (退回和挂起)
        let [param, field] = [null, null]
        if (this.index === 3 || this.index === 0) {
          this.paramZeroAndThree.orderId = this.parameter.orderId
          this.paramZeroAndThree.remark = this.parameter.remark
          this.paramZeroAndThree.codeStr = this.parameter.codeStr
//          console.log('0和3')
        }
        // 拒绝和关闭
        if (this.index === 1 || this.index === 2) {
          this.paramOneAndTwo.orderId = this.parameter.orderId
          this.paramOneAndTwo.remark = this.parameter.remark
          this.paramOneAndTwo.code = this.parameter.code
//          console.log('1和2')
        }
        // 四个接口的不同的参数
        if (this.index === 0) {
          field = 'return'
          param = this.paramZeroAndThree
        } else if (this.index === 1) {
          field = 'reject'
          param = this.paramOneAndTwo
        } else if (this.index === 2) {
          field = 'close'
          param = this.paramOneAndTwo
        } else if (this.index === 3) {
          field = 'hang'
          param = this.paramZeroAndThree
        }
        this.fetch(param, field)
      },
      // 请求接口 (流转中的操作接口，判断是否可以自动进件审核)
      fetch(param, field) {
        param.orderId = this.$route.query.orderId
        axios.post(`/audit/${field}`, param)
          .then(res => {
            if (parseInt(res.data.code) === 200) {
              this.codelist = []
              this.parameter.remark = ''
              this.$message.success(res.data.message)
              this.getLetterRecordsList({orderId: this.parameter.orderId})
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
              // 解决审批成功后，按钮的显示状态出现的bug
              this.index = this.activeButton = 0
            } else {
              this.$message.error(res.data.message)
            }
          })
      },
      // 进件分单接口
      single() {
        axios.post('auditOrder/auditOrderSeperate').then(res => {
          if (res.data.code === 200) {
            // 根据status来判断是继续审核页面还是返回审批列表
            if (parseInt(res.data.body.status) === 1) {
              this.$store.commit('refreshAgain', !this.circulation.refreshAgain)
              // 重新加载页面
              this.$router.push({
                path: '/nav/risk/letterOrder',
                query: {
                  ApprovalRecordMenuId: this.ApprovalRecordMenuId, // 审批记录权限
                  RemarkRecordMenuId: this.RemarkRecordMenuId, // 备注记录权限
                  orderId: res.data.body.orderId,
                  type: res.data.body.type,
                  userId: res.data.body.userId,
                  showBtn: true,
                  pageType: this.pageType,
                  channelName: res.data.body.channelName,
                  hrefType: 2
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
      codelist(val) {
        if (val.length) {
          this.circulation.codeTypeOptions.forEach(item => {
            if (val[0] === 'p101001') {
              if (item.code !== 'p101001') {
                item.disabled = true
              }
            } else {
              if (item.code === 'p101001') {
                item.disabled = true
              }
            }
          })
        } else if (this.circulation.codeTypeOptions) {
          this.circulation.codeTypeOptions.forEach(item => {
            if (this.channelName !== '融360') {
              item.disabled = false
            }
          })
        }
//        this.$store.commit('initCodeTypeOptions', this.codeTypeOptions)
      },
      // 解决 流转 选择原因 切换到通过 提交 再次审批下一单流转类型依然存在的 bug
      'circulation.codeType': {
        handler: function (val, oldVal) {
          this.codelist = []
        },
        // 深度监听
        deep: true
      },
      // 每次打开流转页面重置流转源码码和类型的匹配
      'circulation.resetCirculationType': {
        handler: function (val, oldVal) {
          this.index = this.activeButton = 0
        },
        // 深度监听
        deep: true
      }
    }
  }
</script>
<style scoped lang="less">
  .button_wrapper {
    text-align: right;
  }

  .background {
    background: #20A0FF;
    color: #fff;
  }

  .waring {
    background: #F7BA2A;
    color: #fff;
    border: none;
  }

  .line {
    word-wrap: break-word;
    /*word-break: normal;*/
    word-break: break-all;
  }

  .el-form-item__label {
    padding: 0;
  }
</style>
