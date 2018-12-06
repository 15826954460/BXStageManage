<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">借款管理</p>
    <el-card class="mb14 box-card" style="width:100%;">
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
          <span class="label">借款编号:</span>
          <el-input size="small" v-model="postParam.orderId" placeholder="请输入借款编号"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">借款金额:</span>
          <el-input size="small"
                    v-model="postParam.minAmount"></el-input>
          <span class="split_line">—</span>
          <el-input size="small"
                    v-model="postParam.maxAmount"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">借款期数:</span>
          <el-select v-model="postParam.term" placeholder="请选择" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.loanInstallmentList"
                       :key="item.index"
                       :label="item.installment"
                       :value="item.index">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row class="mb14" :gutter="20">
        <el-col :span="6">
          <span class="label">申请时间:</span>
          <el-date-picker @change="changeApplyTimeRange"
                          v-model="applyTimeRange"
                          type="datetimerange" size="small"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">放款时间:</span>
          <el-date-picker
            v-model="lendingTimeRange" @change="changeLendingTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
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
        <el-col :span="6">
          <span class="label">审批人:</span>
          <el-select v-model="postParam.auditorId" size="small">
            <el-option v-if='auditorListData'
                       v-for="item in auditorListData"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row class="mb14" :gutter="20">
        <el-col :span="6">
          <span class="label">还清时间:</span>
          <el-date-picker
            v-model="backTimeRange" @change="changeBackTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">到期日:</span>
          <el-date-picker
            v-model="arriveTimeRange"
            type="daterange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">还清方式:</span>
          <el-select v-model="postParam.settleMethod" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.reimbursementWay"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <div class="tr pr">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card style="width:100%;">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane v-for="item in menuList" :key="item.index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </template>

      <div v-if="loanListData">
        <el-table v-if="loanListData.records" :data="loanListData.records"
                  border style="width: 100%">
          <el-table-column prop="userId" label="用户ID">
            <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" width="120x">
          </el-table-column>
          <el-table-column prop="orderId" label="借款编号" width="180px">
          </el-table-column>
          <el-table-column label="借款金额">
            <template slot-scope="scope">
              {{scope.row.amount | toThousands}}
            </template>
          </el-table-column>
          <el-table-column prop="term" label="借款期数">
          </el-table-column>
          <el-table-column label="申请时间" width="160x">
            <template slot-scope="scope">
              {{scope.row.createTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column label="放款时间" width="160x">
            <template slot-scope="scope">
              {{scope.row.loanTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column prop="dueDate" label="到期日" width="120x">
          </el-table-column>
          <el-table-column prop="settleTime" label="还清时间" width="180x">
            <template slot-scope="scope">
              {{scope.row.settleTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column prop="settleMethod" label="还清方式"></el-table-column>

          <el-table-column prop="channelName" label="渠道"></el-table-column>
          <el-table-column prop="auditor" label="审批人"></el-table-column>
          <el-table-column label="借款状态">
            <template slot-scope="scope">
              <span v-for="item in fixedField.loanStatus"
                    v-show="item.value === scope.row.status"
                    :style="{color: item.color}">
                 {{scope.row.status}}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="look(scope.row)"
                         v-show="showLookButton"
                         type="text" class="cur">查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tr pt30 rel" v-if="loanListData">
        <p class="total_num">
          共 {{loanListData.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="loanListData.totalrecord">
        </el-pagination>
      </div>
    </el-card>

    <userDetailDialog
      :userId="userId"
      @listenChildEvent="hideUserDetail"
      v-if="isShowDetail"></userDetailDialog>

  </el-card>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import {
    filterTime,
    validateMobilePhone,
    validateAccount,
    judgeLimit,
    clearHistorySearch,
    isArray,
    setSearchValue
  } from '../../../untils/common'
  import userDetailDialog from '../userManage/userDetailDialog'
  import axios from 'axios'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '审批中', name: '1'},
          {label: '已退回', name: '2'},
          {label: '未通过', name: '3'},
          {label: '放款中', name: '4'},
          {label: '已关单', name: '8'},
          {label: '待还款', name: '5'},
          {label: '逾期中', name: '6'},
          {label: '已结清', name: '7'},
//          {label: '已关闭', name: '0'},
          {label: '所有', name: '-1'}
        ],
        applyTimeRange: '',  // 申请时间范围
        lendingTimeRange: '',  // 放款时间范围
        backTimeRange: '',  // 还清时间
        arriveTimeRange: [],  // 到期日
        postParam: {
          orderId: null, // 借款编号
          realName: null, // 姓名
          mobile: null, // 手机号
          userId: null,
          idCard: null, // 身份证号
          minAmount: null, // 最小借款金额
          maxAmount: null, // 最大借款金额
          term: null, // 借款期数
          minCreateTime: null, // 申请开始日期
          maxCreateTime: null, // 申请结束日期
          minLoanTime: null, // 放款开始日期
          maxLoanTime: null, // 放款结束日期
          settleStartTime: null, // 还清开始时间
          settleEndTime: null, // 还清结束时间
          dueStartDate: null, // 到期日开始
          dueEndDate: null, // 到期日结束
          settleMethod: null, // 还清方式
          channel: null, // 渠道
          auditorId: null, // 审批人
          status: 1, // 借款状态
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'orderId', // 排序字段名
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
        activeName: '1',
        statisticalData: null,
        lookMenuId: 65,
        // v_0.7.3
        userId: '',
        userDetailMenuId: 58, // 用户详情
        isShowDetail: false,
        searchConditionsContent: '', // 搜索内容
        searchConditions: 1, // 下拉框的选择
        placeHolder: '请输入姓名' // 提示信息
      }
    },
    computed: {
      ...mapState(['fixedField', 'loanListData', 'auditorListData']),
      showLookButton: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.lookMenuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    components: {
      userDetailDialog
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 初始化借款列表
      this.getLoanList(this.postParam)
      this.statistical(this.postParam)
      // 获取审批人接口
      this.getAuditorList()
    },
    methods: {
      ...mapActions(['getLoanList', 'buttonLimit', 'getAuditorList']),
      // 表尾统计
      statistical(data) {
        axios.post('loan/loanStatistics', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          }
        })
      },
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
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      handleClick(tab, event) {
        if (parseInt(this.activeName) === -1) {
          this.postParam.status = null
        } else {
          this.postParam.status = parseInt(this.activeName)
        }
        this.postParam.pageNow = 1
        this.getLoanList(this.postParam)
        this.statistical(this.postParam)
      },
      // 选择分页大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getLoanList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getLoanList(this.postParam)
      },
      // 选择 申请 时间范围
      changeApplyTimeRange(val) {
        if (this.applyTimeRange) {
          if (isArray(this.applyTimeRange)) {
            this.postParam.minCreateTime = filterTime(this.applyTimeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.applyTimeRange[1], 'dateTime')
          } else {
            this.applyTimeRange = [this.applyTimeRange, this.applyTimeRange]
            this.postParam.minCreateTime = filterTime(this.applyTimeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.applyTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minCreateTime = this.postParam.maxCreateTime = null
        }
      },
      // 选择 放款 时间范围
      changeLendingTimeRange(val) {
        if (this.lendingTimeRange) {
          if (isArray(this.lendingTimeRange)) {
            this.postParam.minLoanTime = filterTime(this.lendingTimeRange[0], 'dateTime')
            this.postParam.maxLoanTime = filterTime(this.lendingTimeRange[1], 'dateTime')
          } else {
            this.lendingTimeRange = [this.lendingTimeRange, this.lendingTimeRange]
            this.postParam.minLoanTime = filterTime(this.lendingTimeRange[0], 'dateTime')
            this.postParam.maxLoanTime = filterTime(this.lendingTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minLoanTime = this.postParam.maxLoanTime = null
        }
      },
      // 还清时间
      changeBackTimeRange() {
        if (this.backTimeRange) {
          if (isArray(this.backTimeRange)) {
            this.postParam.settleStartTime = filterTime(this.backTimeRange[0], 'dateTime')
            this.postParam.settleEndTime = filterTime(this.backTimeRange[1], 'dateTime')
          } else {
            this.backTimeRange = [this.backTimeRange, this.backTimeRange]
            this.postParam.settleStartTime = filterTime(this.backTimeRange[0], 'dateTime')
            this.postParam.settleEndTime = filterTime(this.backTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.settleStartTime = this.postParam.settleEndTime = null
        }
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
        this.applyTimeRange = this.lendingTimeRange = this.backTimeRange = ''
        this.arriveTimeRange = []
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
            this.$message.error('手机号码格式错误，请重新输入')
            return
          }
        }
        if (param.minAmount || param.maxAmount) {
          // 验证输入金额格式
          if (!validateAccount(param.minAmount) || !validateAccount(param.maxAmount)) {
            this.$message.error('借款金额输入有误，请重新输入')
            return
          }
        }
        this.getLoanList(param)
        this.statistical(this.postParam)
      },
      // 操作--查看详情
      look(row) {
        const url = `${window.location.origin + window.location.pathname}#/nav/index/loanDetail/?orderId=${row.orderId}&activeName=${this.activeName}`
        window.open(url, '_blank')
      }
    },
    watch: {
      arriveTimeRange: {
        handler(val) {
          if (val) {
            this.postParam.dueStartDate = filterTime(val[0])
            this.postParam.dueEndDate = filterTime(val[1])
          } else {
            this.postParam.dueStartDate = this.postParam.dueEndDate = null
          }
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../../style/filterStyle';

  .split_line {
    display: inline-block;
    line-height: 32px;
    padding: 0 5px;
    flex-shrink: 0;
  }

  .button_rel {
    bottom: 32px;
  }

  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>

