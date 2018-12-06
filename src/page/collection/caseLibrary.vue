<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">案件库</p>
    <el-card class="mb14 box-card" style="width:100%;">

      <el-row :gutter="20" class="mb14">
        <el-col :span="6">
          <el-select v-model="searchConditions" placeholder="请选择" size="small" @change="selectConditions"
                     class="mr14" style="width:80px">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.searchConditions"
                       :key="item.code"
                       :label="item.value"searchConditions
                       :value="item.code">
            </el-option>
          </el-select>
          <el-input size="small" v-model="searchConditionsContent" :placeholder="placeHolder"
                    class="input_with"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">最后沟通时间:</span>
          <el-date-picker
            v-model="timeRange" @change="changeLendingTimeRange(1)"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">下次跟进时间:</span>
          <el-date-picker
            v-model="flowTimeRange" @change="changeLendingTimeRange(2)"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">催收员:</span>
          <el-select v-model="postParam.operatorId" size="small">
            <el-option v-if='operatorIdList'
                       v-for="item in operatorIdList"
                       :key="item.operatorId"
                       :label="item.operator"
                       :value="item.operatorId">
            </el-option>
          </el-select>
        </el-col>

      </el-row>

      <el-row class="mb14" :gutter="20">
        <el-col :span="6">
          <span class="label">案件状态:</span>
          <el-select v-model="postParam.caseState" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.caseType"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="label">逾期期数:</span>
          <el-input size="small" v-model="postParam.phaseNum"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">逾期天数:</span>
          <el-input size="small" v-model="postParam.minDays"></el-input>
          <span style="align-self:center;padding-left:5px;padding-right:5px;">-</span>
          <el-input size="small" v-model="postParam.maxDays"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">累计逾期天数:</span>
          <el-input size="small" v-model="postParam.minOverdueDays"></el-input>
          <span style="align-self:center;padding-left:5px;padding-right:5px;">-</span>
          <el-input size="small" v-model="postParam.maxOverdueDays"></el-input>
        </el-col>
      </el-row>

      <div class="tr pr">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card style="width:100%;">

      <div class="rel">
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane v-for="item in menuList" :key="item.name"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </div>
      <!---->
      <el-table v-if="caseDataList" @sort-change="sortChange"
                ref="clearSort"
                :default-sort="{prop: '', order: 'ascending'}"
                :data="caseDataList.records" border style="width: 100%">
        <el-table-column label="案件ID">
          <template slot-scope="scope">
            <span class="cur blue" @click="goToCaseDetail(scope.row)">{{scope.row.caseId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户ID">
          <template slot-scope="scope">
            <span class="cur blue" @click="goToUserDetail(scope.row)">{{scope.row.userId}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180px">
        </el-table-column>
        <el-table-column prop="waitRepayAmount" label="待还金额" sortable="custom">
          <template slot-scope="scope">
            <span>{{scope.row.waitRepayAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="phaseNum" label="逾期期数" sortable="custom">
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数" sortable="custom">
        </el-table-column>
        <el-table-column prop="totalOverdueDays" label="累计逾期天数" sortable="custom">
        </el-table-column>
        <el-table-column prop="dunTimes" label="跟进次数" sortable="custom">
        </el-table-column>
        <el-table-column prop="lastCallTime" label="最后沟通时间" sortable="custom" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.lastCallTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastCallTime" label="下次跟进时间" sortable="custom" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.nextCallTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="caseStateName" label="案件状态">

        </el-table-column>
        <el-table-column prop="operator" label="催收员">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="lookCaseRecord(scope.row)"
                       v-show="showCaseRecord">催记</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30 rel" v-if="caseDataList">
        <p class="total_num">
          共 {{caseDataList.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="caseDataList.totalrecord"
        >
        </el-pagination>
      </div>

    </el-card>

    <el-dialog title="催记" :visible.sync="caseRecordDialogTableVisible" width="80%"
    @close="closeCaseDialog">
      <collectionRecord
        :caseRecordDialogTableVisible="caseRecordDialogTableVisible"></collectionRecord>
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
  import {filterTime, judgeLimit, validateMobilePhone, validateDay, clearHistorySearch, isArray, setSearchValue} from '../../untils/common'
  import collectionRecord from './components/collectionRecord'
  import userDetailDialog from '../index/userManage/userDetailDialog'
  export default {
    data: function () {
      return {
        menuList: [
          {label: '催收中', name: '1'},
          {label: '已催回', name: '2'},
          {label: '所有', name: '-1'}
        ],
        auditList: [],
        postParam: {
          userId: null, // 用户Id
          realName: null, // 姓名
          mobile: null, // 手机号
          phaseNum: null, // 逾期期数
          minDays: null, // 最小逾期天数
          maxDays: null, // 最大逾期天数
          maxOverdueDays: null, // 最大累计逾期天数
          minOverdueDays: null, // 最小累计逾期天数
          maxLastCallTime: null, // 最大最后沟通时间
          minLastCallTime: null, // 最小最后沟通时间
          maxNextCallTime: null, // 最大最后跟进时间
          minNextCallTime: null, // 最小最后跟进时间
          caseState: null, // 案件状态
          operatorId: null, // 催收员
          dunState: 1, // tab类型
          sortField: 'totalOverdueDays, userId',
          sort: 'asc', // 排序(asc正序，desc倒序)
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
        id: null,
        timeRange: '', // 沟通时间范围
        flowTimeRange: '', // 跟进时间范围
        statisticalData: null,
        activeName: '1',
        caseRecordDialogTableVisible: false,
        CaseRecordMenuId: 96, // 催记按钮
        CaseDetailMenuId: 94, // 根据用户id跳转到催收详情
        // v_0.7.3
        userId: '',
        userDetailMenuId: 58, // 用户详情
        isShowDetail: false,
        searchConditionsContent: '', // 搜索内容
        searchConditions: 1, // 下拉框的选择
        placeHolder: '请输入姓名' // 提示信息
      }
    },
    components: {
      collectionRecord, userDetailDialog
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 初始化借款列表
      this.getCaseDataList(this.postParam)
      // 或取表尾统计数据
      this.statistical(this.postParam)
      // 催收员下拉列表、
      this.getOperatorIdList()
    },
    computed: {
      ...mapState(['fixedField', 'caseDataList', 'operatorIdList']),
      showCaseRecord: function() {
        return judgeLimit(this.$store.state.setButtonLimitData, this.CaseRecordMenuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    methods: {
      ...mapActions(['getCaseDataList', 'buttonLimit', 'getOperatorIdList']),
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      lookCaseRecord(row) {
        this.caseRecordDialogTableVisible = true
        this.$store.commit('setCaseRecordDialogTableVisible', true)
        this.userId = row.userId
        this.$store.commit('setCaseUserId', row.userId)
      },
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 表尾统计
      statistical(data) {
        axios.post('dun/dunCaseCount', data).then(res => {
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
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.dunState = parseInt(this.activeName)
        } else {
          this.postParam.dunState = null
        }
        this.postParam.pageNow = 1
        this.getCaseDataList(this.postParam)
        this.statistical(this.postParam)
        // 清空排序
        this.postParam.sort = 'asc'
        this.postParam.sortField = 'totalOverdueDays, userId'
        this.$refs['clearSort'].clearSort()
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getCaseDataList(this.postParam)
        this.statistical(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getCaseDataList(this.postParam)
        this.statistical(this.postParam)
      },
      // 选择放宽时间范围
      changeLendingTimeRange(val) {
        if (val === 1) {
          if (this.timeRange) {
            if (isArray(this.timeRange)) {
              this.postParam.minLastCallTime = filterTime(this.timeRange[0], 'dateTime')
              this.postParam.maxLastCallTime = filterTime(this.timeRange[1], 'dateTime')
            } else {
              this.timeRange = [this.timeRange, this.timeRange]
              this.postParam.minLastCallTime = filterTime(this.timeRange[0], 'dateTime')
              this.postParam.maxLastCallTime = filterTime(this.timeRange[1], 'dateTime')
            }
          } else {
            this.postParam.minLastCallTime = this.postParam.maxLastCallTime = null
          }
        } else {
          if (this.flowTimeRange) {
            if (isArray(this.flowTimeRange)) {
              this.postParam.minNextCallTime = filterTime(this.flowTimeRange[0], 'dateTime')
              this.postParam.maxNextCallTime = filterTime(this.flowTimeRange[1], 'dateTime')
            } else {
              this.timeRange = [this.flowTimeRange, this.flowTimeRange]
              this.postParam.minNextCallTime = filterTime(this.flowTimeRange[0], 'dateTime')
              this.postParam.maxNextCallTime = filterTime(this.flowTimeRange[1], 'dateTime')
            }
          } else {
            this.postParam.minNextCallTime = this.postParam.maxNextCallTime = null
          }
        }
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'pageSize' &&
            key !== 'pageNow' &&
            key !== 'state' &&
            key !== 'dunState' &&
            key !== 'sort' && key !== 'sortField') {
            param[key] = null
          }
        }
        this.searchConditionsContent = this.timeRange = this.flowTimeRange = ''
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
        // 验证累计逾期天数的输入格式
        if ((param.maxOverdueDays || param.minOverdueDays)) {
          if (!validateDay(param.minOverdueDays, param.maxOverdueDays)) {
            this.$message.error('累计逾期天数输入有误')
            return
          }
        }
        // 验证逾期期数
        if (param.phaseNum) {
          if (!validateDay(param.phaseNum)) {
            this.$message.error('逾期期数输入有误')
            return
          }
        }
        // 验证逾期天数的输入格式
        if ((param.minDays || param.maxDays)) {
          if (!validateDay(param.minDays, param.maxDays)) {
            this.$message.error('逾期天数输入有误')
            return
          }
        }
        this.getCaseDataList(param)
        this.statistical(param)
      },
      // 跳转到案件详情
      goToCaseDetail(row) {
        if (judgeLimit(this.$store.state.setButtonLimitData, this.CaseDetailMenuId)) {
          let url = `${window.location.origin + window.location.pathname}#nav/dun/caseDetail?userId=${row.userId}&operator=${row.operator}&caseState=${row.caseStateName}&dunState=${row.dunState}&caseId=${row.id}&nextCallTime=${row.nextCallTime}`
          window.open(url, '_blank')
        }
      },
      // 打开用户详情弹框
      // 排序方式
      sortChange(column) {
        if (column.prop) {
          this.postParam.sortField = column.prop
        } else {
          this.postParam.sortField = 'totalOverdueDays, userId'
        }
        if (column.order) {
          if (column.order === 'ascending') {
            this.postParam.sort = 'asc'
          } else if (column.order === 'descending') {
            this.postParam.sort = 'desc'
          }
        } else {
          this.postParam.sort = 'asc'
        }
        this.getCaseDataList(this.postParam)
      },
      closeCaseDialog() {
        this.caseRecordDialogTableVisible = false
        this.$store.commit('setCaseRecordDialogTableVisible', false)
        this.$store.commit('setCaseUserId', null)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "../../style/filterStyle";

  .el-col {
    .label {
      width: 100px;
    }
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


