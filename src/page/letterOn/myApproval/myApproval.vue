<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">我的审批</p>
    <el-card class="mb14 box-card">
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
        <!--<el-col :span="6" class="el-col">-->
          <!--<span class="label">身份证号:</span>-->
          <!--<el-input size="small" v-model="postParam.idCard" placeholder="输入身份证号"></el-input>-->
        <!--</el-col>-->
        <el-col :span="6" class="el-col">
          <span class="label">订单类型:</span>
          <el-select v-model="postParam.type" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.orderType"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">订单编号:</span>
          <el-input size="small" v-model="postParam.orderId" placeholder="输入订单编号"></el-input>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">渠道:</span>
          <el-select v-model="postParam.channel" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.IntoChannelList"
                       :key="item.channelNum"
                       :label="item.channelName"
                       :value="item.channelNum">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mb14">

        <el-col :span="6" class="el-col">
          <span class="label">申请时间:</span>
          <el-date-picker
            v-model="applyDateRange" @change="applyTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>

        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">审批时间:</span>
          <el-date-picker
            v-model="approvalDateRange" @change="approvalTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>

        </el-col>
        <!--TODO: 该功能暂时废除-->
        <!--<el-col :span="6" class="el-col">-->
          <!--<span class="label">审批人:</span>-->
          <!--<el-select v-model="postParam.auditorId" size="small">-->
            <!--<el-option v-if='auditorListData'-->
                       <!--v-for="item in auditorListData"-->
                       <!--:key="item.id"-->
                       <!--:label="item.name"-->
                       <!--:value="item.id">-->
            <!--</el-option>-->
          <!--</el-select>-->
        <!--</el-col>-->
      </el-row>

      <p class="tr pr button_rel">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </p>


    </el-card>

    <el-card>
      <div class="rel">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane v-for="item in menuList" :key="item.index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" size="small" class="abs cur"
                   @click="intoAduit" v-show="showOrder"
                   style="top: 0;right: 0">接单
        </el-button>

        <el-table v-if="myAuditListData"
                  :data="myAuditListData.records"
                  border style="width: 100%;">
          <el-table-column label="订单编号" width="180px">
            <template slot-scope="scope">
            <span @click="goToLetterDetail(scope.row)" class="blue cur">
              {{scope.row.orderId}}
            </span>
            </template>
          </el-table-column>
          <el-table-column label="申请时间" width="160px">
            <template slot-scope="scope">
              {{scope.row.createTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column prop="userId" label="用户ID">
            <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" width="120px">
          </el-table-column>
          <el-table-column label="渠道" prop="channelName">
          </el-table-column>
          <el-table-column label="订单类型">
            <template slot-scope="scope">
            <span v-for="item in fixedField.orderType"
                  v-show="item.code === parseInt(scope.row.type)">
              {{item.value}}
            </span>
            </template>
          </el-table-column>
          <el-table-column label="审批状态" width="100px">>
            <template slot-scope="scope">
            <span v-for="item in fixedField.examinationStatus"
                  v-show="item.code === parseInt(scope.row.status)">
              {{item.value}}
            </span>
            </template>
          </el-table-column>
          <el-table-column v-if="parseInt(activeName) !== 101" label="审批人" prop="auditor"
          >
          </el-table-column>
          <el-table-column prop="times" label="退回次数" v-if="parseInt(activeName) === 103">
          </el-table-column>
          <el-table-column v-if="parseInt(activeName) !== 101 && parseInt(activeName) !== 1"
                           label="审批时间" width="160px">
            <template slot-scope="scope">
              <span>{{scope.row.auditTime | dateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="原因类型" width="160px"
                           v-if="parseInt(activeName) !== 1 && parseInt(activeName) !== 101">
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
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-button @click="aduit(scope.row)" type="text"
                         v-show="((parseInt(activeName) === 103) || (parseInt(activeName) === 2) || (parseInt(activeName) === 1)) && showApproval">审批
              </el-button>
              <!--TODO: 该功能暂时废除后台接口逻辑不变-->
              <!--<el-button @click="mandatory(scope.row)" type="text"-->
                         <!--v-show="(parseInt(activeName) === 1 || parseInt(activeName) === 2) && showExportBtn"-->
              <!--&gt;强制退出-->
              <!--</el-button>-->
              <el-button @click="openLetterRecord(scope.row)" type="text"
                         v-show="showApprovalRecord">审批记录</el-button>
              <el-button @click="openRemarkRecord(scope.row)" type="text"
                         v-show="showRemarkRecord">备注记录</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="tr pt30">
          <el-pagination v-if="myAuditListData"
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="postParam.pageNow"
                         :page-sizes="[10, 20, 50, 100]"
                         :page-size="postParam.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="myAuditListData.totalrecord">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!--审批记录-->
    <el-dialog title="" :visible.sync="dialogVisibleLetterRecords"
                @close="closeLetterRecord()"
               width="50%">
      <letter-record :orderId="orderId" :orderIdCurrentPage="orderId"></letter-record>
    </el-dialog>

    <!--备注记录-->
    <el-dialog title="" :visible.sync="dialogVisibleRemarkRecords" width="50%"
               @close="closeRemarkRecord('ruleForm')" >
      <remark-records :orderId="orderId" :showAddRemark="true"
                      :clearRemarkInfo="clearRemarkInfo"
                      @closeRemarkRecord="closeRemarkRecord"></remark-records>
    </el-dialog>

    <!--强制退出-->
    <mandatory-dialog
      :orderId="orderId"
      :ApprovalRecordMenuId="ApprovalRecordMenuId"
      :mobile="mobile" @refresh="refresh"></mandatory-dialog>

    <el-dialog title="提示" :visible.sync="dialogVisible"
               width="30%" @close="cancel()">
      <p>你已存在审批中的订单，需审批完该订单，才能审批其它订单。是否继续？ </p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <userDetailDialog
      :userId="userId"
      @listenChildEvent="hideUserDetail"
      v-if="isShowDetail"></userDetailDialog>

  </el-card>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import {filterTime, validateMobilePhone, judgeLimit, clearHistorySearch, isArray, setSearchValue} from '../../../untils/common'
  import letterRecord from '../../../components/aduitRecords.vue'
  import remarkRecords from '../../../components/remarkRecords.vue'
  import mandatoryDialog from '../../../components/mandatory.vue'
  import userDetailDialog from '../../index/userManage/userDetailDialog'
  export default {
    data: function () {
      return {
        menuList: [
          // {label: '待人工审批', name: '101'},
          {label: '审批中', name: '1'},
          {label: '重新提交', name: '103'},
          {label: '已挂起', name: '2'},
          {label: '已退回', name: '102'},
          {label: '已关闭', name: '400'},
          {label: '已拒绝', name: '300'},
          {label: '已通过', name: '200'},
          {label: '所有订单', name: '-1'}
        ],
        postParam: {
          userId: null,
          realName: null, // 姓名
          mobile: null, // 手机号
          idCard: null, // 姓名
          type: null, // 订单类型   1 授信订单 2 借款订单
          orderId: null, // 订单编号
          channel: null, // 渠道
          applyBeginTime: null, // 申请时间开始时间
          applyEndTime: null, // 申请时间结束时间
          auditorId: null, // 审批人
          auditBeginTime: null, // 审批时间开始时间
          auditEndTime: null, // 审批时间结束时间
          status: 1, // 状态
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'createTime', // 排序字段名
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
        showFrcedOut: false,
        menuId: 26,
        showExportBtn: false,
        clearRemarkInfo: false, // 是否清楚备注消息
        type: 0, // 锁定状态信息
        dialogVisibleLetterRecords: false, // 审批记录弹框
        dialogVisibleRemarkRecords: false, // 备注记录弹框
        dialogVisible: false,
        mobile: '',
        orderId: null, // 订单编号
        activeName: '1',
        applyDateRange: '',
        approvalDateRange: '',
        OrderMenuId: 79, // 接单
        approvalMenuId: 80, // 审批
        ApprovalRecordMenuId: 81, // 审批记录
        RemarkRecordMenuId: 82, // 备注记录
        // v_0.7.3
        userId: '',
        userDetailMenuId: 58, // 用户详情
        isShowDetail: false,
        searchConditionsContent: '', // 搜索内容
        searchConditions: 1, // 下拉框的选择
        placeHolder: '请输入姓名' // 提示信息
      }
    },
    components: {letterRecord, remarkRecords, mandatoryDialog, userDetailDialog},
    computed: {
      ...mapState(['fixedField', 'myAuditListData', 'auditorListData', 'setButtonLimitData']),
      showOrder: function() {
        return judgeLimit(this.$store.state.setButtonLimitData, this.OrderMenuId)
      },
      showApproval: function() {
        return judgeLimit(this.$store.state.setButtonLimitData, this.approvalMenuId)
      },
      showApprovalRecord: function() {
        return judgeLimit(this.$store.state.setButtonLimitData, this.ApprovalRecordMenuId)
      },
      showRemarkRecord: function() {
        return judgeLimit(this.$store.state.setButtonLimitData, this.RemarkRecordMenuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 获取审批列表
      this.getMyAuditList(this.postParam)
      // 获取审批人列表
      this.getAuditorList()
      // this.forcedOut()
    },
    beforeDestroy() {
      this.orderId = null
    },
    methods: {
      ...mapActions(['getMyAuditList', 'getAuditorList', 'buttonLimit']),
      // 子组件监听父组件的事件
      hideUserDetail() {
        this.isShowDetail = false
      },
      // 打开用户详情
      goToUserDetail(row) {
        if (this.showDetail) {
          this.isShowDetail = true
          this.userId = row.userId
          this.$store.commit('setUserDetailDialogTableVisible', true)
        } else {
          this.$message.error('您没有权限进行该操作')
        }
      },
      // 强制退出按钮权限
      forcedOut() {
        axios.post('security/hasPrivilege', {model: 'audit', privilegeValue: 'forceExit'})
          .then(res => {
            if (res.data.code === 200) {
              this.showFrcedOut = (parseInt(res.data.body) === 1)
            }
          })
      },
      // 选择分页大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getMyAuditList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getMyAuditList(this.postParam)
      },
      // 选择申请时间
      applyTimeRange(val) {
        if (this.applyDateRange) {
          if (isArray(this.applyDateRange)) {
            this.postParam.applyBeginTime = filterTime(this.applyDateRange[0], 'dateTime')
            this.postParam.applyEndTime = filterTime(this.applyDateRange[1], 'dateTime')
          } else {
            this.applyDateRange = [this.applyDateRange, this.applyDateRange]
            this.postParam.applyBeginTime = filterTime(this.applyDateRange[0], 'dateTime')
            this.postParam.applyEndTime = filterTime(this.applyDateRange[1], 'dateTime')
          }
        } else {
          this.postParam.applyBeginTime = this.postParam.applyEndTime = null
        }
        // if (this.applyDateRange) {
        //   this.postParam.applyBeginTime = filterTime(val[0])
        //   this.postParam.applyEndTime = filterTime(val[1])
        // } else {
        //   this.postParam.applyBeginTime = this.postParam.applyEndTime = null
        // }
      },
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      // 选择审批时间
      approvalTimeRange(val) {
        if (this.approvalDateRange) {
          if (isArray(this.approvalDateRange)) {
            this.postParam.auditBeginTime = filterTime(this.approvalDateRange[0], 'dateTime')
            this.postParam.auditEndTime = filterTime(this.approvalDateRange[1], 'dateTime')
          } else {
            this.approvalDateRange = [this.approvalDateRange, this.approvalDateRange]
            this.postParam.auditBeginTime = filterTime(this.approvalDateRange[0], 'dateTime')
            this.postParam.auditEndTime = filterTime(this.approvalDateRange[1], 'dateTime')
          }
        } else {
          this.postParam.auditBeginTime = this.postParam.auditEndTime = null
        }
        // if (val) {
        //   this.postParam.auditBeginTime = filterTime(val[0])
        //   this.postParam.auditEndTime = filterTime(val[1])
        // } else {
        //   this.postParam.auditBeginTime = this.postParam.auditEndTime = null
        // }
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField' && key !== 'status') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.applyDateRange = this.approvalDateRange = ''
      },
      // 查询
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
            this.$message.error('手机号码格式错误，请重新你输入')
            return
          }
        }
        this.getMyAuditList(param)
      },
      // 跳转到审批详情
      goToLetterDetail(row) {
        this.orderId = row.orderId
        this.$store.commit('closeCirculation', false)
        this.$store.commit('changeRightWidth', true)
        this.$store.commit('isShowBtn', false)
        let url = `${window.location.origin + window.location.pathname}#nav/risk/letterOrder?orderId=${row.orderId}&type=${row.type}&userId=${row.userId}&channelName=${row.channelName}&closeCirculation=${false}&ApprovalRecordMenuId=${this.ApprovalRecordMenuId}&RemarkRecordMenuId=${this.RemarkRecordMenuId}`
        window.open(url, '_blank')
      },
      // tab切换
      handleClick(tab, event) {
        if (parseInt(this.activeName) !== -1) {
          this.postParam.status = parseInt(this.activeName)
        } else {
          this.postParam.status = null
        }
        this.postParam.pageNow = 1
        this.getMyAuditList(this.postParam)
      },
      // 审批记录弹框
      openLetterRecord(row) {
        this.orderId = row.orderId
        this.dialogVisibleLetterRecords = true
        this.$store.commit('mandatoryDialog', false)
        this.dialogVisible = false
      },
      // 关闭审批记录弹框
      closeLetterRecord() {
        this.dialogVisibleLetterRecords = false
      },
      // 备注记录弹框
      openRemarkRecord(row) {
        this.orderId = row.orderId
        this.dialogVisibleRemarkRecords = true
        this.$store.commit('mandatoryDialog', false)
        this.dialogVisible = false
      },
      // 关闭备注记录
      closeRemarkRecord() {
        this.clearRemarkInfo = !this.clearRemarkInfo
        this.dialogVisibleRemarkRecords = false
      },
      // 强制退出弹框
      mandatory(row) {
        this.orderId = row.orderId
        this.mobile = row.mobile
        this.$store.commit('mandatoryDialog', true)
        this.dialogVisible = false
      },
      // 审批进件审核
      intoAduit() {
        axios.post('auditOrder/auditOrderSeperate').then(res => {
          if (res.data.code === 200) {
            // 授信订单
            if (parseInt(res.data.body.status) === 1) {
              this.$router.push({
                path: '/nav/risk/letterOrder',
                query: {
                  ApprovalRecordMenuId: this.ApprovalRecordMenuId, // 审批记录权限
                  RemarkRecordMenuId: this.RemarkRecordMenuId, // 备注记录权限
                  userId: res.data.body.userId,
                  orderId: res.data.body.orderId,
                  type: res.data.body.type,
                  channelName: res.data.body.channelName,
                  pageType: 1,
                  showBtn: true,
                  hrefType: 2 // 审批后页面的跳转类型判断 (2: 审批详情 1：审批列表)
                }
              })
              this.$store.commit('showContacts', false)
              this.$store.commit('isShowBtn', true)
              this.$store.commit('changeRightWidth', false)
            } else {
              this.$message.error('不存在可审批的订单')
            }
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 审批
      aduit(row) {
        axios.post('auditOrder/orderAuditLocking', {orderId: row.orderId, type: 1}).then(res => {
          if (res.data.code === 200) {
            if (parseInt(res.data.body.status) === 0) {
              // 判断该单是不是锁定状态 0 非锁定 1 锁定
              this.$router.push({
                path: '/nav/risk/letterOrder',
                query: {
                  ApprovalRecordMenuId: this.ApprovalRecordMenuId, // 审批记录权限
                  RemarkRecordMenuId: this.RemarkRecordMenuId, // 备注记录权限
                  userId: res.data.body.userId,
                  orderId: res.data.body.orderId,
                  type: res.data.body.type,
                  channelName: res.data.body.channelName,
                  // orderId: row.orderId,
                  // type: row.type,
                  // userId: row.userId,
                  // channelName: row.channelName,
                  // pageType: 1, // 审批订单池和我的审批页面的跳转判断 （2: 审批订单池， 1：我的审批）
                  showBtn: true,
                  hrefType: 1 // 审批后页面的回跳类型判断 (2: 审批详情 1：审批列表)
                }
              })
              this.$store.commit('showContacts', false) // 显示通讯录
              // this.$store.commit('isShowBtn', true) // 显示按钮
              this.$store.commit('changeRightWidth', false) // 不铺满全屏
            } else if (parseInt(res.data.body.status) === 1) {
              this.dialogVisible = true
              this.body = res.data.body
            }
            this.$store.commit('showContacts', false)
            this.$store.commit('changeRightWidth', false)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 取消
      cancel() {
        this.dialogVisible = false
      },
      // 确定 跳转到订单详情页面
      sure() {
        this.$router.push({
          path: '/nav/risk/letterOrder',
          query: {
            ApprovalRecordMenuId: this.ApprovalRecordMenuId, // 审批记录权限
            RemarkRecordMenuId: this.RemarkRecordMenuId, // 备注记录权限
            orderId: this.body.orderId,
            type: this.body.type,
            userId: this.body.userId,
            channelName: this.body.channelName,
            pageType: 1,
            showBtn: true,
            hrefType: 1 // 通过的后页面回跳类型判断
          }
        })
        this.$store.commit('showContacts', false) // 显示通讯录
        this.$store.commit('isShowBtn', true) // 显示按钮
        this.$store.commit('changeRightWidth', false) // 不铺满全屏
      },
      // 刷新列表
      refresh() {
        this.getMyAuditList(this.postParam)
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.getMyAuditList(this.postParam)
        },
        deep: true
      },
      'setButtonLimitData': {
        handler: function (newValue, oldValue) {
          this.showExportBtn = judgeLimit(this.setButtonLimitData, this.menuId)
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  @import '../../../style/filterStyle';
  .button_rel {
    bottom: 32px;
  }
</style>
