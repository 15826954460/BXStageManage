<template>
  <el-card style="width:100%;" class="big_background">
    <el-tabs v-model="merchants" @tab-click="selectMerchants">
      <el-tab-pane label="荷包还款" name="2"></el-tab-pane>
      <el-tab-pane label="淮南还款" name="1"></el-tab-pane>
    </el-tabs>
    <el-card class="mb14" style="width:100%;position:relative">
      <el-row :gutter="20" class="mb14">
        <el-col :span="6">
          <el-select v-model="searchConditions" placeholder="请选择" size="small" @change="selectConditions"
                     class="mr14" style="width:80px">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.searchConditions"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
          <el-input size="small" v-model="searchConditionsContent" :placeholder="placeHolder"
                    class="input_with"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">交易编号:</span>
          <el-input size="small" v-model="postParam.orderNo" placeholder="请输入交易编号"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">支付单号:</span>
          <el-input size="small" v-model="postParam.withholdOrderId" placeholder="请输入支付单号"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">支付渠道:</span>
          <el-select v-model="postParam.paymentChannel" placeholder="请选择" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.payChannelList"
                       :key="item.channelNum"
                       :label="item.channelName"
                       :value="item.channelNum">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="mb14" :gutter="20">
        <el-col :span="6">
          <span class="label">提交时间:</span>
          <el-date-picker
            v-model="timeRange" @change="changeLendingTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">回调时间:</span>
          <el-date-picker
            v-model="callBackTimeRange" @change="changeCallBackTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label f14">还款类型:</span>
          <el-select v-model="postParam.repayType" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.breaksType"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="label f14">操作人:</span>
          <el-select v-model="postParam.operatorId" size="small">
            <el-option v-if='payhandleListData'
                       v-for="item in payhandleListData"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>

      </el-row>

      <el-row class="mb14" :gutter="20">
        <el-col :span="6">
          <span class="label f14">开户行:</span>
          <el-select v-model="postParam.bankCode" size="small">
            <el-option v-if='openBankList'
                       v-for="(item, index) in openBankList"
                       :key="index"
                       :label="item.bankName"
                       :value="item.bankWay">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <span class="label f14">渠道:</span>
          <el-select v-model="postParam.channel" size="small">
            <el-option v-for="item in channelList"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <div class="tr pr button_rel">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card style="width:100%;">
      <div class="rel">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane v-for="item in menuList" :key="item.index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" size="small" class="abs cur"
                   v-show="showExportBtn"
                   @click="exportExcel"
                   style="top: 0;right: 0">导出
        </el-button>
      </div>

      <div v-if="breaksListData">
        <el-table v-if="breaksListData.records"
                  :data="breaksListData.records" border style="width: 100%">
          <el-table-column label="交易编号" width="90px">
            <template slot-scope="scope">
              <span class="cur blue OrderNo"
                    :data-clipboard-text="scope.row.orderNo">
                {{scope.row.orderNo | fliterNum}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="用户ID">
            <template slot-scope="scope">
              <span class="cur blue" @click="goToUserDetail(scope.row)">{{scope.row.userId}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" width="120px">
          </el-table-column>
          <!--<el-table-column prop="bankCardNo" label="银行卡号"  width="180px">-->
          <!--</el-table-column>-->
          <el-table-column prop="bankName" label="开户行">
          </el-table-column>
          <el-table-column label="交易金额">
            <template slot-scope="scope">
              {{scope.row.amount | toThousands}}
            </template>
          </el-table-column>
          <el-table-column prop="merchant" label="支付商户">
          </el-table-column>
          <el-table-column prop="withholdChannel" label="支付渠道">
          </el-table-column>
          <el-table-column label="支付单号" width="90px">
            <template slot-scope="scope">
              <span class="cur blue withholdOrderId"
                    :data-clipboard-text="scope.row.withholdOrderId">
                {{scope.row.withholdOrderId | fliterNum}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="channel" label="渠道">
          </el-table-column>
          <el-table-column prop="repayType" label="还款类型">
          </el-table-column>
          <el-table-column prop="operator" label="操作人">
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" width="160px">
            <template slot-scope="scope">
              {{scope.row.createTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column prop="callBackTime" label="回调时间" width="160px">
            <template slot-scope="scope">
              {{scope.row.callBackTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column prop="code" label="返回码">
          </el-table-column>
          <el-table-column label="支付描述" width="120px">
            <template slot-scope="scope">
              <el-popover
                v-if="scope.row.descript"
                v-show="scope.row.descript.length > 12"
                placement="right"
                width="400"
                popper-class="break"
                trigger="hover"
                :content="scope.row.descript">
                <span slot="reference" class="cur">{{scope.row.descript | minStr12}}</span>
              </el-popover>
              <span v-if="scope.row.descript"
                    v-show="scope.row.descript.length<=12">{{scope.row.descript | minStr12}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <span @click="lookDetail(scope.row)"
                    v-show="showDetailMenuId"
                    class="cur mr14 blue">明细
              </span>
              <span @click="lookLog(scope.row)"
                    v-show="Number.parseInt(activeName) !== 0 && Number.parseInt(activeName) !== -1 && showLogMenuId"
                    class="cur mr14 blue">日志
              </span>
              <span @click="sendMessage(scope.row)" v-show="Number.parseInt(activeName) === 2 && showSendMessageMenuId"
                    class="cur mr14 blue">发短信
              </span>
              <span @click="handleStatus(1, scope.row)"
                    v-show="(Number.parseInt(activeName) === 3 || Number.parseInt(activeName) === 4) && showSuccessMenuId"
                    class="cur success mr14">成功
              </span>
              <span @click="handleStatus(3, scope.row)"
                    v-show="Number.parseInt(activeName) === 3 && showHungMenuId"
                    class="cur mr14 blue">挂起
              </span>
              <span @click="handleStatus(2, scope.row)"
                    v-show="(Number.parseInt(activeName) === 3 || Number.parseInt(activeName) === 4) && showErrorMenuId"
                    class="cur error">失败
              </span>
              <!--<el-button @click="searchSure(scope.row)" type="text" class="cur"-->
              <!--v-show="activeName === '0'">查询-->
              <!--</el-button>-->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pt30 tr rel" v-if="breaksListData && breaksListData.totalrecord">
        <p class="total_num">
          共 {{breaksListData.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="breaksListData.totalrecord"
        >
        </el-pagination>
      </div>

      <el-dialog title="查询交易状态" :visible.sync="outerVisible" width="450px"
                 @close="outerVisible = false">
        <p>主动查询交易状态？</p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false" size="small">取 消</el-button>
          <el-button type="primary" @click="sure" size="small">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="还款明细" :visible.sync="dialogTableVisible"
                 @close="dialogTableVisible = false">
        <el-table v-if="entryDetail" :data="entryDetail">
          <el-table-column prop="billNo" label="账单编号" width="200px"></el-table-column>
          <el-table-column prop="loanOrderNo" label="借款编号" width="200px"></el-table-column>
          <el-table-column prop="phaseName" label="期次名称"></el-table-column>
          <el-table-column label="本次交易金额">
            <template slot-scope="scope">
              <span>{{scope.row.amount | toThousands}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>

      <!--TODO: 流转处理-->
      <el-dialog :visible.sync="handleResultDialogVisible"

                 width="550px"
                 @close="cancelHandleMessage">
        <el-form :model="handleResultParams" label-width="100px" class="pt10"
                 ref="handleResultParams">
          <el-form-item label="处理结果:">
            <span>{{handleResult}}</span>
          </el-form-item>

          <el-form-item label="发送短信:" v-if="Number.parseInt(handleResultParams.type) === 2">
            <el-checkbox v-model="radioSendMessage" @change="sendMessageSelect">发短信</el-checkbox>
          </el-form-item>

          <el-form-item label="短信模板:"
                        v-show="radioSendMessage && Number.parseInt(handleResultParams.type) === 2">
            <el-select v-model="handleResultParams.smstemplete" size="small">
              <el-option
                v-if='fixedField.messageModel'
                v-for="item in fixedField.messageModel"
                :key="item.code"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="短信内容:" v-show="radioSendMessage && Number.parseInt(handleResultParams.type) === 2">
            <el-input type="textarea" v-model="messageModel" :rows="6"
                      :disabled="true" auto-complete="true"></el-input>
          </el-form-item>

          <el-form-item label="备注:" prop="content">
            <el-input type="textarea"
                      v-model="handleResultParams.remark" placeholder="300字以内，非必填项">
            </el-input>
          </el-form-item>

          <el-form-item class="tr">
            <el-button @click="cancelHandleMessage" size="small">取消</el-button>
            <el-button @click="onSubmit" size="small" type="primary">提交</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!--TODO：查看日志-->
      <el-dialog :visible.sync="LogDialogTableVisible"

                 @close="LogDialogTableVisible = false">
        <el-table v-if="logList" :data="logList" class="mt14">
          <el-table-column label="时间">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | dateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="处理人"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span
                v-if="fixedField"
                v-for="item in fixedField.logModal" v-show="item.code === scope.row.type">
                {{item.value}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="短信模板">
            <template slot-scope="scope">
              <span
                v-if="fixedField"
                v-for="item in fixedField.lookMessageModal" v-show="item.code === scope.row.smsTemplate">
                {{item.value}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark">
          </el-table-column>
        </el-table>
      </el-dialog>

      <!--todo:发送短信-->
      <el-dialog :visible.sync="sendMessageDialogVisible"

                 width="450px"
                 @close="sendMessageDialogVisible = false">
        <el-form :model="messageModelParam" label-width="100px" class="pt10"
                 ref="handleResultParams">

          <el-form-item label="短信模板:">
            <el-select v-model="messageModelParam.smstemplete" size="small">
              <el-option
                v-if='fixedField.messageModel'
                v-for="item in fixedField.messageModel"
                :key="item.code"
                :label="item.value"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>

          <p style="padding-left:30px">{{messageModel}}</p>
          <el-form-item class="tr">
            <el-button @click="sendMessageDialogVisible = false" size="small">取消</el-button>
            <el-button @click="onSubmitSendMessage" size="small" type="primary">提交</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

      <userDetailDialog
        :userId="userId"
        @listenChildEvent="hideUserDetail"
        v-if="isShowDetail"></userDetailDialog>
    </el-card>
  </el-card>
</template>
<script>
  import axios from 'axios'
  import ClipboardJS from 'clipboard'
  import {mapState, mapActions} from 'vuex'
  import {filterTime, judgeLimit, validateMobilePhone, clearHistorySearch, isArray, setSearchValue} from '../../../untils/common'
  import userDetailDialog from '../../index/userManage/userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '还款中', name: '0'},
          {label: '还款成功', name: '1'},
          {label: '还款失败', name: '2'},
          {label: '还款异常', name: '3'},
          {label: '已挂起', name: '4'},
          {label: '所有订单', name: '-1'}
        ],
        channelList: [
          {value: '全部', code: null},
          {value: '融360', code: 1},
          {value: '币下分期App', code: 2}
        ],
        bankName: null, // 开户行
        channel: null, // 渠道
        postParam: {
          userId: null,
          orderNo: null, // 交易编号
          realName: null,
          mobile: null,
          channel: null,
          // idCard: null,
          paymentChannel: null,
          bankCode: null,
          minCreateTime: null,
          maxCreateTime: null,
          minCallbackTime: null,
          maxCallbackTime: null,
          withholdOrderId: null,
          repayType: null, // 还款类型
          operatorId: null, // 操作人
          merchant: 2,
          // sortField: 'orderNo',
          // sort: 'desc', // 排序(asc正序，desc倒序)
          state: 0, // 还款状态
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
        orderNo: null,
        outerVisible: false,
        timeRange: '',
        callBackTimeRange: '',
        activeName: '0',
        merchants: '2',
        dialogTableVisible: false,
        statisticalData: null, // 底部的数据统计
        menuId: 45,
        // v_0.7.2
        handleResultDialogVisible: false,
        LogDialogTableVisible: false,
        handleResultParams: {
          type: null, // 1、置为成功 2、置为失败 3、挂起
          tradeOrderNo: null,
          remark: '',
          sendflag: 1,
          currentState: null,
          smstemplete: 3 // 1, "提醒用户接听手机" 2, "放款失败结束订单提醒" 3,"通知用户还款失败，建议对公转账" 4,"通知用户处理超时，还款失败" 5, "自定义短信" 6, "还款提醒"
        },
        handleResult: '',
        radioSendMessage: true,
        sendMessageDialogVisible: false,
        messageModel: '',
        // 发送短信
        messageModelParam: {
          tradeOrderNo: null,
          smstemplete: null
        },
        userId: '',
        isShowDetail: false,
        userDetailMenuId: 58, // 用户详情
        logList: [],
        detailMenuId: 97, // 明细
        successMenuId: 98, // 成功
        errorMenuId: 99, // 失败
        sendMessageMenuId: 100, // 发短信
        hungMenuId: 101, // 挂起
        logMenuId: 102, // 日志
        type: '', // 置为成功和失败和挂起的按钮权限
        // v_0.7.3
        searchConditionsContent: '', // 搜索内容
        searchConditions: 1, // 下拉框的选择
        placeHolder: '请输入姓名' // 提示信息
      }
    },
    components: {
      userDetailDialog
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      let [copyOrderNo, copyWithholdOrderId] = [new ClipboardJS('.OrderNo'), new ClipboardJS('.withholdOrderId')]
      copyOrderNo.on('success', (e) => {
        this.$message.success('已复制到剪切板')
        e.clearSelection()
      })
      copyOrderNo.on('error', function (e) {
        this.$message.error('复制到剪切板失败')
      })
      copyWithholdOrderId.on('success', (e) => {
        this.$message.success('已复制到剪切板')
      })
      copyWithholdOrderId.on('error', function (e) {
        this.$message.error('复制到剪切板失败')
        e.clearSelection()
      })
      // 初始化还款列表
      this.getBreaksList(this.postParam)
      // 获取操作人接口
      this.getPayHandleList()
      // 获取总数接口
      this.statistical(this.postParam)
      this.getBankList()
    },
    computed: {
      ...mapState(['fixedField', 'breaksListData', 'entryDetail', 'openBankList', 'payhandleListData']),
      showExportBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.menuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      },
      showDetailMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.detailMenuId)
      },
      showSuccessMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.successMenuId)
      },
      showErrorMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.errorMenuId)
      },
      showSendMessageMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.sendMessageMenuId)
      },
      showHungMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.hungMenuId)
      },
      showLogMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.logMenuId)
      }
    },
    methods: {
      ...mapActions(['getBreaksList', 'buttonLimit', 'getEntryDetail', 'getBankList', 'getPayHandleList']),
      // 表尾统计
      statistical(data) {
        axios.post('chargeRecord/chargeAmountCount', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          } else {
            throw new Error('请求接口错误')
          }
        })
      },
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      // 到处excel文件的参数
      filterParam() {
        let newParams = {}
        Object.keys(this.postParam).forEach(key => {
          if ((this.postParam[key] || Object.is(key, 0)) && !Object.is(key, 'pageSize') && !Object.is(key, 'pageNow')) {
            newParams[key] = this.postParam[key]
          }
        })
        return newParams
      },
      // 打开用户详情
      goToUserDetail(row) {
        if (this.showDetail) {
          this.isShowDetail = true
          this.userId = row.userId
          // 展示用户详情的变量
          this.$store.commit('setUserDetailDialogTableVisible', true)
        } else {
          this.$message.error('您没有权限进行该操作')
        }
      },
      hideUserDetail() {
        this.isShowDetail = false
      },
      // 导出excel
      exportExcel() {
        let host = window.location.origin
        let filterParam = this.filterParam()
        let par = ''
        for (let key in filterParam) {
          par += `${key}=${filterParam[key]}&`
        }
        window.open(`${host}/api/chargeRecord/chargeListExcel?${par}`)
      },
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.state = parseInt(this.activeName)
        } else {
          this.postParam.state = null
        }
        this.postParam.pageNow = 1
        this.$store.commit('getBreaksList', {records: []})
        this.getBreaksList(this.postParam)
        this.statistical(this.postParam)
      },
      selectMerchants(tab, event) {
        if (this.merchants) {
          this.postParam.merchant = parseInt(this.merchants)
        }
        this.postParam.pageNow = 1
        this.getBreaksList(this.postParam)
        this.statistical(this.postParam)
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getBreaksList(this.postParam)
        this.statistical(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getBreaksList(this.postParam)
        this.statistical(this.postParam)
      },
      // 选择放宽时间范围
      changeLendingTimeRange(val) {
        if (this.timeRange) {
          if (isArray(this.timeRange)) {
            this.postParam.minCreateTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.timeRange[1], 'dateTime')
          } else {
            this.timeRange = [this.timeRange, this.timeRange]
            this.postParam.minCreateTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.timeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minCreateTime = this.postParam.maxCreateTime = null
        }
      },
      // 选择回掉时间范围
      changeCallBackTimeRange(val) {
        if (this.callBackTimeRange) {
          if (isArray(this.callBackTimeRange)) {
            this.postParam.minCallbackTime = filterTime(this.callBackTimeRange[0], 'dateTime')
            this.postParam.maxCallbackTime = filterTime(this.callBackTimeRange[1], 'dateTime')
          } else {
            this.callBackTimeRange = [this.callBackTimeRange, this.callBackTimeRange]
            this.postParam.minCallbackTime = filterTime(this.callBackTimeRange[0], 'dateTime')
            this.postParam.maxCallbackTime = filterTime(this.callBackTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minCallbackTime = this.postParam.maxCallbackTime = null
        }
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'pageSize' &&
            key !== 'pageNow' &&
            key !== 'state' && key !== 'merchant'
          ) {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.timeRange = this.callBackTimeRange = ''
      },
      search() {
        let param = this.postParam
        if (!this.searchConditionsContent) {
          param.mobile = null
        }
        let paramArr = [this.searchConditions, this.postParam, this.searchConditionsContent, 'userId']
        setSearchValue(...paramArr)
        // 验证手机号格式
        if (param.mobile) {
          if (!validateMobilePhone(param.mobile)) {
            this.$message.error('手机号码格式错误')
            return
          }
        }
        // 用户id大小做限制
        if (Number.parseInt(this.postParam.userId) > 9223372036854775807) {
          this.$message.error('用户ID输入有误')
          // 提示报错之后清空数据，解决tab切换时的bug
          this.postParam.userId = null
          return
        }
        this.getBreaksList(this.postParam)
        this.statistical(this.postParam)
      },
      // 查询
      searchSure(row) {
        this.outerVisible = true
        this.orderNo = row.orderNo
      },
      lookDetail(row) {
        this.dialogTableVisible = true
        this.getEntryDetail({orderNo: row.orderNo})
        // this.$router.push({path: '/nav/finance/transferDetail', query: {withholdOrderId: row.withholdOrderId}})
      },
      // 确定查询交易状态
      sure(row) {
        axios.post('chargeRecord/query', {tradeOrderNo: this.orderNo}).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
          this.getBreaksList(this.postParam)
          this.statistical(this.postParam)
          this.outerVisible = false
        })
      },
      // 获取短信模板
      getSmeTemplate() {
        axios.post('charge/smsTemplete', this.messageModelParam).then(res => {
          if (res.data.code === 200) {
            this.messageModel = res.data.body
            return true
          } else {
            // if (this.type !== 2) {
            this.$message.error(res.data.message)
            // }
            // this.handleResultParams.sendflag = 0
            return false
          }
        })
      },
      // 查看日志
      lookLog(row) {
        axios.post('chargeOperatorRecord/list', {tradeOrderNo: row.orderNo}).then(res => {
          if (res.data.code === 200) {
            this.logList = res.data.body
            this.LogDialogTableVisible = true
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 发送短信
      sendMessage(row) {
        this.messageModelParam.tradeOrderNo = row.orderNo
        this.messageModelParam.smstemplete = 3
        this.getSmeTemplate()
        // if (!this.getSmeTemplate()) return
        this.sendMessageDialogVisible = true
      },
      // 置为成功、失败、挂起
      handleStatus(type, row) {
        // 只有点击失败按钮的时候才请求短信的接口
        if (type === 2) {
          this.getSmeTemplate()
          // this.type = 2
        }
        this.messageModelParam.tradeOrderNo = row.orderNo
        this.messageModelParam.smstemplete = 3
        this.handleResultDialogVisible = true
        this.handleResultParams.type = type
        this.handleResultParams.tradeOrderNo = row.orderNo
        this.handleResult = (type === 1 ? '还款成功' : type === 2 ? '还款失败' : '挂起')
        // 避免多个人同时对一个单的状态进项更改
        if (Number.parseInt(this.activeName) === 3 || Number.parseInt(this.activeName) === 4) {
          this.handleResultParams.currentState = Number.parseInt(this.activeName)
        }
      },
      // 是否发送短信模板
      sendMessageSelect(val) {
        this.radioSendMessage = val
        this.handleResultParams.sendflag = val ? 1 : 0
      },
      // 取消发动短信
      cancelHandleMessage() {
        this.handleResultDialogVisible = false
        this.handleResultParams.remark = ''
        if (this.handleResultParams.type === 2) {
          this.radioSendMessage = true
        }
      },
      onSubmit() {
        if (this.handleResultParams.remark.length > 300) {
          this.$message.error('备注字符长度不能超过300')
          return
        }
        axios.post('charge/operate', this.handleResultParams).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.cancelHandleMessage()
            this.getBreaksList(this.postParam)
            this.handleResultDialogVisible = false
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 确定发送短信
      onSubmitSendMessage() {
        axios.post('charge/tradeFail2SendSMS', this.messageModelParam).then(res => {
          if (res.data.code === 200) {
            this.sendMessageDialogVisible = false
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../../../style/filterStyle";

  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .button_rel {
    display: inline-block;
    position: absolute;
    bottom:35px;
  }
</style>
