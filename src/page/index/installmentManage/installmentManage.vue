<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">期次管理</p>
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
        <el-col :span="6" class="el-col">
          <span class="label">借款编号:</span>
          <el-input size="small" v-model="postParam.loanOrderNo" placeholder="输入借款编号"></el-input>
        </el-col>

        <el-col :span="6" class="el-col">
          <span class="label">还款日:</span>
          <el-date-picker
            v-model="backDateRange"
            type="daterange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">逾期天数:</span>
          <el-input size="small" v-model="postParam.minOverdueDays"></el-input>
          <span style="align-self:center;padding-left:5px;padding-right:5px;">-</span>
          <el-input size="small" v-model="postParam.maxOverdueDays"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mb14">

        <el-col :span="6" class="el-col">
          <span class="label">还清时间:</span>
          <el-date-picker
            @change="selectTime()"
            v-model="timeValue"
            type="datetimerange" size="small"
            start-placeholder="开始时间"
            end-placeholder="结束时间">
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

      <div class="tr pr button_rel">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card>
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane v-for="item in menuList" :key="item.index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </template>

      <el-table v-if="installmentManageData" :data="installmentManageData.records"
                @sort-change="sortChange"
                :default-sort="{prop: 'loanOrderNo', order: 'descending'}"
                border style="width: 100%;">
        <el-table-column prop="loanOrderNo" label="借款编号" width="180px">
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
        <el-table-column prop="phaseName" label="期次名称" width="150px">
        </el-table-column>
        <el-table-column label="还款日" width="150px">
          <template slot-scope="scope">
            {{scope.row.dueDate | date}}
          </template>
        </el-table-column>
        <el-table-column label="期次总金额">
          <template slot-scope="scope">
            {{scope.row.repayAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="待还金额" sortable="custom" prop="waitRepayAmount">
          <template slot-scope="scope">
            {{scope.row.waitRepayAmount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="逾期天数" sortable="custom" prop="overdueDays">
          <template slot-scope="scope">
            <span :class="{error: parseInt(scope.row.overdueDays) > 0}">
              {{scope.row.overdueDays}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="还清时间" width="160px" sortable="custom" prop="settleTime">
          <template slot-scope="scope">
            {{scope.row.settleTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="还清方式" prop="settleMethod">
          <!--<template slot-scope="scope">-->
          <!--<span :class="{error: parseInt(scope.row.overdueDays) > 0}">-->
          <!--{{scope.row.overdueDays}}-->
          <!--</span>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column label="期次状态">
          <template slot-scope="scope">
             <span v-for="(item, index) in fixedField.installmentStatus" :key="index"
                   v-show="item.statusCode === scope.row.state" :style="{color: item.color}">
                {{item.value}}
              </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button @click="look(scope.row)"
                       v-show="showLookButton"
                       type="text">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30">
        <el-pagination v-if="installmentManageData"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="postParam.pageNow"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="postParam.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="installmentManageData.totalrecord">
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
  import {
    filterTime, validateMobilePhone,
    judgeLimit, validateDay, clearHistorySearch, isArray, setSearchValue
  } from '../../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from '../userManage/userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '待还款', name: '0'},
          {label: '还款中', name: '1'},
          {label: '逾期中', name: '3'},
          {label: '已还清', name: '2'},
          {label: '所有', name: '-1'}
        ],
        postParam: {
          loanOrderNo: null, // 借款编号
          realName: null, // 姓名
          userId: null,
          mobile: null, // 手机号
          idCard: null, // 身份证号
          minDueDate: null, // 还款开始日
          maxDueDate: null, // 还款结束日
          minSettleTime: null, // 还清开始日
          maxSettleTime: null, // 还清结束日
          settleMethod: null, // 还清期次
          state: 0, // 还款状态
          channel: null, // 渠道
          sortField: 'loanOrderNo', // 排序字段名
          sort: 'desc', // 排序(asc正序，desc倒序)
          pageSize: 10, //
          pageNow: 1, //
          maxOverdueDays: null, // 最大累计逾期天数
          minOverdueDays: null // 最小累计逾期天数
        },
        pickerOptions2: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24)
                end.setTime(end.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近7天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '最近30天',
              onClick(picker) {
                const end = new Date()
                const start = new Date()
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
                picker.$emit('pick', [start, end])
              }
            }
          ]
        },
        timeValue: '', // 还清时间
        backDateRange: [], // 还款时间
        activeName: '0',
        lookMenuId: 66,
        // v_0.7.3
        userId: '',
        userDetailMenuId: 58, // 用户详情
        isShowDetail: false,
        searchConditionsContent: '', // 搜索内容
        searchConditions: 1, // 下拉框的选择
        placeHolder: '请输入姓名' // 提示信息
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 初始化期次管理数据
      this.installmentManage(this.postParam)
    },
    computed: {
      ...mapState(['fixedField', 'installmentManageData']),
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
    methods: {
      ...mapActions(['installmentManage', 'buttonLimit']),
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
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
      handleClick(tab, event) {
        if (parseInt(this.activeName) !== -1) {
          this.postParam.state = parseInt(this.activeName)
        } else {
          this.postParam.state = null
        }
        this.postParam.pageNow = 1
        this.installmentManage(this.postParam)
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.installmentManage(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.installmentManage(this.postParam)
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'state') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.applyTimeRange = this.backDateRange = []
        this.timeValue = ''
      },
      // 选择时间
      selectTime() {
        if (this.timeValue) {
          if (isArray(this.timeValue)) {
            this.postParam.minSettleTime = filterTime(this.timeValue[0], 'dateTime')
            this.postParam.maxSettleTime = filterTime(this.timeValue[1], 'dateTime')
          } else {
            this.timeValue = [this.timeValue, this.timeValue]
            this.postParam.minSettleTime = filterTime(this.timeValue[0], 'dateTime')
            this.postParam.maxSettleTime = filterTime(this.timeValue[1], 'dateTime')
          }
        } else {
          this.postParam.minSettleTime = this.postParam.maxSettleTime = null
        }
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
        if (!this.postParam.maxOverdueDays && !this.postParam.minOverdueDays) {
          this.installmentManage(this.postParam)
          return
        }
        if ((this.postParam.maxOverdueDays || this.postParam.minOverdueDays)) {
          if (validateDay(this.postParam.minOverdueDays, this.postParam.maxOverdueDays)) {
            this.installmentManage(this.postParam)
          } else {
            this.$message.error('逾期天数输入有误')
          }
        }
      },
      // 操作--查看
      look(row) {
        const url = `${window.location.origin + window.location.pathname}#/nav/index/loanDetail/?orderId=${row.loanOrderNo}`
        window.open(url, '_blank')
      },
      // 支付记录
      payRecord(row) {
        this.$router.push({path: '/nav/finance/transferDetail', query: {withholdOrderId: row.withholdOrderId}})
      },
      sortChange(column) {
        this.postParam.sort = (column.order === 'ascending' ? 'asc' : column.order === 'descending' ? 'desc' : null)
        this.postParam.sortField = column.prop
        this.installmentManage(this.postParam)
      }
    },
    watch: {
      backDateRange: {
        handler(val) {
          if (val) {
            this.postParam.minDueDate = filterTime(val[0])
            this.postParam.maxDueDate = filterTime(val[1])
          } else {
            this.postParam.minDueDate = this.postParam.maxDueDate = null
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

  .button_rel {
    bottom: 32px;
  }
</style>
