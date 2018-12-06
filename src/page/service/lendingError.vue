<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">放款异常</p>
    <el-card class="mb14 box-card">
      <el-row :gutter="20" class="mb14">
        <el-col :span="6" class="el-col">
          <span class="label">用户ID:</span>
          <el-input size="small" v-model="postParam.userId" placeholder="输入用户ID"
                    @keyup.native="onkeyup($event)"></el-input>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">姓名:</span>
          <el-input size="small" v-model="postParam.realName" placeholder="输入姓名"></el-input>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">手机号:</span>
          <el-input size="small" v-model="postParam.mobile" placeholder="输入手机号"></el-input>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">身份证号:</span>
          <el-input size="small" v-model="postParam.idCard" placeholder="输入身份证号"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mb14">
        <el-col :span="6">
          <span class="label">处理人:</span>
          <el-select v-model="postParam.operatorId" size="small">
            <el-option v-if='handleListData'
                       v-for="item in handleListData"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">支付渠道:</span>
          <el-select v-model="postParam.payChannel" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.payChannelList"
                       :key="item.channelNum"
                       :label="item.channelName"
                       :value="item.channelNum">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">开户行:</span>
          <el-select v-model="postParam.bankCode" size="small">
            <el-option v-if='openBankList'
                       v-for="(item, index) in openBankList"
                       :key="index"
                       :label="item.bankName"
                       :value="item.bankWay">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">异常类型:</span>
          <el-select v-model="postParam.type" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.lendingErrorType"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
      </el-row>


      <p class="tr pr">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </p>
    </el-card>

    <el-card>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane v-for="item in menuList" :key="item.index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </template>

      <el-table v-if="errorList" :data="errorList.records"
                border style="width: 100%;">
        <el-table-column label="用户ID" prop="userId">
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120px">
        </el-table-column>
        <el-table-column prop="bankName" label="开户行">
        </el-table-column>
        <el-table-column label="交易金额" width="100px">
          <template slot-scope="scope">
            <span>{{scope.row.amount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="异常类型" width="150px">
          <template slot-scope="scope">
            <span v-if="fixedField" v-for="item in fixedField.errorType"
                  v-show="item.code === Number.parseInt(scope.row.type)"
                  :style="{color: item.color}">
              {{item.value}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="支付渠道" prop="payChannel">
        </el-table-column>
        <el-table-column label="支付单号" prop="payOrderId" width="200px">
        </el-table-column>
        <el-table-column label="回调时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.callbackTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="支付描述" width="180px">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.description"
              v-show="scope.row.description.length > 12"
              placement="right" title=""
              width="300"
              popper-class="break"
              trigger="hover"
              :content="scope.row.description">
              <span slot="reference" class="cur">{{scope.row.description | minStr12}}</span>
            </el-popover>
            <span v-if="scope.row.description"
                  v-show="scope.row.description.length<=12"
                  class="cur">{{scope.row.description | minStr12}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="处理人" v-if="Number.parseInt(activeName) !== 0">
        </el-table-column>
        <el-table-column prop="state" label="处理状态" width="100px" v-if="Number.parseInt(activeName) === 3">
        </el-table-column>
        <el-table-column v-if="Number.parseInt(activeName) === 1 || Number.parseInt(activeName) === 2 || Number.parseInt(activeName) === 3"
                         label="备注" width="180px">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.remark"
              v-show="scope.row.remark.length > 12"
              placement="right" title=""
              width="300"
              popper-class="break"
              trigger="hover"
              :content="scope.row.remark">
              <span slot="reference" class="cur">{{scope.row.remark | minStr12}}</span>
            </el-popover>
            <span v-if="scope.row.remark"
                  v-show="scope.row.remark.length<=12"
                  class="cur">{{scope.row.remark | minStr12}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260px">
          <template slot-scope="scope">
            <el-button v-show="false"></el-button>
            <el-button @click="look(scope.row)" type="text" class="cur"
                       v-show="parseInt(scope.row.queryButtonState) === 1 && Number.parseInt(activeName) !== 3 && Number.parseInt(activeName) !== 2"
                       >查询
            </el-button>
            <el-button @click="goToHandleDetail(scope.row)" type="text" class="cur"
                       v-show="parseInt(scope.row.handleButtonState) === 1 && Number.parseInt(activeName) !== 3 && Number.parseInt(activeName) !== 2"
                       >处理
            </el-button>
            <!-- -->
            <el-button @click="exit(scope.row)" type="text" class="cur"
                       v-show="parseInt(scope.row.quitButtonState) === 1 && Number.parseInt(activeName) !== 3 && Number.parseInt(activeName) !== 2 && showExportBtn">强制退出
            </el-button>
            <el-button @click="lookHandleRecord(scope.row)" type="text"
                       class="cur">处理记录
            </el-button>
            <el-button @click="goToHandleDetail(scope.row, true)" type="text"
                       v-show="Number.parseInt(activeName) === 3 || Number.parseInt(activeName) === 2 || Number.parseInt(activeName) === 3"
                       class="cur">详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30">
        <el-pagination v-if="errorList"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="postParam.pageNow"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="postParam.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="errorList.totalrecord">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="查询交易状态" :visible.sync="outerVisible" width="450px"
                @close="outerVisible = false">
      <p>主动查询交易状态？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="处理记录" :visible.sync="dialogTableVisible" width="800px"
                @close="outerVisible = false">
      <handleRecords :id="id" :height="true" :refresh="refresh"></handleRecords>
    </el-dialog>

    <el-dialog title="强制退出" :visible.sync="exitVisible" width="450px"
                @close="exitVisible = false">
      <p>是否确认将手机号为“{{telMobile}}”的订单，从“处理中”强制退出？</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="sureExit" size="small">确定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>
<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import {validateMobilePhone, judgeLimit} from '../../untils/common'
  import handleRecords from '../../components/handleRecords.vue'

  export default {
//    props: ['newsletterPopup'],
    data: function () {
      return {
        menuList: [
          {label: '待处理', name: '0'},
          {label: '处理中', name: '-1'},
          {label: '已挂起', name: '1'},
          {label: '已处理', name: '2'},
          {label: '所有', name: '3'}
        ],
        postParam: {
          userId: null, // 用户信息
          realName: null, // 姓名
          mobile: null, // 手机号
          idCard: null, // 身份证
          orderId: null, // 订单编号
          payChannel: null, // 支付渠道
          operatorId: null, // 处理人id
          bankCode: null, // 所属银行code
          type: null, // 异常类型   0 放款中超过30分钟 1 放款失败待定  2 退票
          state: 0, // 状态 （-1: 处理中， 0： 待处理， 1：已挂起， 2：已处理 ）
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'id', // 排序字段名
          pageSize: 10, // 分页条目数
          pageNow: 1, // 查询第几页
          method: 0
        },
        auditList: null,
        id: null,
        telMobile: null,
        dialogTableVisible: false,
        exitVisible: false,
        referenceId: null, // 关联id
        outerVisible: false,
        refresh: false,
        showFrcedOut: false, // 强制退出权限
        menuId: 28,
        // showExportBtn: false,
        activeName: '0'
      }
    },
    components: {
      handleRecords
    },
    computed: {
      ...mapState(['fixedField', 'errorList', 'openBankList', 'handleListData']),
      showExportBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.menuId)
      }
    },
    // 销毁事件
    beforeDestroy() {
      document.onkeydown = null
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 获取审批人
      this.getAuditList()
       // 获取列表接口
      this.getErrorList(this.postParam)
      // this.forcedOut()
      this.bindKeyDownEnter()
      this.getBankList()
    },
    methods: {
      ...mapActions(['getErrorList', 'buttonLimit', 'getBankList', 'getHandleList']),
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 绑定enter回车
      bindKeyDownEnter() {
        document.onkeydown = e => {
          const theEvent = e || window.event
          const code = theEvent.keyCode || theEvent.which || theEvent.charCode
          if (parseInt(code) === 13) {
            this.getErrorList(this.postParam)
          }
        }
      },
      // 强制退出按钮权限
      forcedOut() {
        axios.post('security/hasPrivilege', {model: 'cs', privilegeValue: 'releaseForceExit'})
          .then(res => {
            if (res.data.code === 200) {
              this.showFrcedOut = (parseInt(res.data.body) === 1)
            }
          })
      },
      // 切换tab
      handleClick(tab, event) {
        if (parseInt(this.activeName) === 3) {
          this.postParam.state = null
        } else {
          this.postParam.state = parseInt(this.activeName)
        }
        this.postParam.pageNow = 1
        this.getErrorList(this.postParam)
        this.forcedOut()
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getErrorList(this.postParam)
        this.forcedOut()
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getErrorList(this.postParam)
        this.forcedOut()
      },
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'method' && key !== 'sortField' && key !== 'state') {
            param[key] = null
          }
        }
      },
      // 查询按钮
      search() {
        let param = this.postParam
        if (!this.searchConditionsContent) {
          param.mobile = null
        }
        // 验证手机号格式
        if (param.mobile) {
          if (!validateMobilePhone(param.mobile)) {
            this.$message.error('手机号码格式错误，请重新输入')
            return
          }
        }
        this.getErrorList(this.postParam)
        this.forcedOut()
      },
      // 查看
      look(row) {
        this.outerVisible = true
        this.id = row.id
      },
      // 确定查询交易状态
      async sure() {
        axios.post('cs/csOperatorByType', {id: this.id, type: 204}).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
          // 跟新数据
          this.getErrorList(this.postParam)
          this.outerVisible = false
          this.forcedOut()
        })
      },
      // 强制退出
      exit(row) {
        this.id = row.id
        this.telMobile = row.mobile
        this.exitVisible = true
      },
      // 确认强制退出
      async sureExit() {
        axios.post('cs/releaseForceExit', {id: this.id}).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
          // 跟新数据
          this.getErrorList(this.postParam)
          this.exitVisible = false
          this.forcedOut()
        })
      },
      // 处理记录
      lookHandleRecord(row) {
        this.dialogTableVisible = true
        this.id = row.id
        this.refresh = !this.refresh
      },
      // 查看处理详情
      goToHandleDetail(row, permissions) {
        //  点击的详情，就直接跳转
        if (permissions) {
          this.$router.push({
            path: '/nav/service/handleDetail',
            query: {
              method: 0,
              type: 1,
              activeName: this.activeName,
              id: row.id
            }
          })
        } else {
          axios.post('cs/csOperator', {id: row.id}).then((res) => {
            if (res.data.code === 200) {
              this.$router.push({
                path: '/nav/service/handleDetail',
                query: {
                  method: 0,
                  activeName: this.activeName,
                  id: row.id
                }
              })
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      }
    }
  }
</script>
<style scoped lang="less">
  @import '../../style/filterStyle';
</style>
