<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">催回记录</p>
    <el-card class="mb14 box-card">
      <el-row :gutter="20" class="mb14">
        <!--<el-col :span="6">-->
          <!--<span class="f14 label">用户ID:</span>-->
          <!--<el-input size="small" v-model="postParam.userId" placeholder="输入用户ID"-->
                    <!--@keyup.native="onkeyup($event)"-->
                    <!--class="input_with"></el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
          <!--<span class="f14 label">姓名:</span>-->
          <!--<el-input size="small" v-model="postParam.realName" placeholder="输入姓名" class="input_with"></el-input>-->
        <!--</el-col>-->
        <!--<el-col :span="6">-->
          <!--<span class="f14 label">手机号:</span>-->
          <!--<el-input size="small" v-model="postParam.mobile" placeholder="输入手机号" class="input_with"></el-input>-->
        <!--</el-col>-->
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
          <span class="f14 label">逾期天数:</span>
          <el-input size="small"
                    v-model="postParam.minOverdueDays"></el-input>
          <span class="split_line">—</span>
          <el-input size="small"
                    v-model="postParam.maxOverdueDays"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label f14">还清时间:</span>
          <el-date-picker
            v-model="timeRange" @change="changeTimeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
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
      <div class="tr pr">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table v-if="myCaseBackList" :data="myCaseBackList.records"
                border style="width: 100%">
        <el-table-column prop="userId" label="用户ID">
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" width="180px">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column prop="loanOrderNo" label="借款编号">
        </el-table-column>
        <el-table-column prop="phaseName" label="期次名称" width="180px">
        </el-table-column>
        <el-table-column label="已还金额">
          <template slot-scope="scope">
            <span>{{scope.row.repaidAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="还清时间">
          <template slot-scope="scope">
            <span>{{scope.row.settleTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="overdueDays" label="逾期天数">
        </el-table-column>
        <el-table-column prop="operator" label="催收员">
        </el-table-column>
      </el-table>

      <div class="tr pt30 rel" v-if="myCaseBackList">
        <p class="total_num">
          共 {{myCaseBackList.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="myCaseBackList.totalrecord">
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
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import {filterTime, validateMobilePhone, validateDay, judgeLimit, clearHistorySearch, isArray, setSearchValue} from '../../untils/common'
  import userDetailDialog from '../index/userManage/userDetailDialog'
  export default {
    data: function () {
      return {
        postParam: {
          userId: null, // 用户id
          realName: null, // 姓名
          mobile: null, // 手机号
          minOverdueDays: null,
          maxOverdueDays: null,
          settleBeginTime: null, // 开始注册时间
          settleEndTime: null, // 结束注册时间
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'settleTime, phaseId', // 排序字段名
          operatorId: null
        },
        statisticalData: null,
        timeRange: [], // 注册时间范围
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
      ...mapState(['myCaseBackList', 'fixedField', 'operatorIdList']),
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
      this.myCaseBack(this.postParam)
      this.statistical(this.postParam)
      // 催收员下拉列表
      this.getOperatorIdList()
    },
    methods: {
      ...mapActions(['myCaseBack', 'buttonLimit', 'getOperatorIdList']),
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
      // 表尾统计
      statistical(data) {
        axios.post('dun/dunCasePhaseCount', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          }
        })
      },
      // 选择放宽时间范围
      changeTimeRange(val) {
        if (this.timeRange) {
          if (isArray(this.timeRange)) {
            this.postParam.settleBeginTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.settleEndTime = filterTime(this.timeRange[1], 'dateTime')
          } else {
            this.timeRange = [this.timeRange, this.timeRange]
            this.postParam.settleBeginTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.settleEndTime = filterTime(this.timeRange[1], 'dateTime')
          }
        } else {
          this.postParam.settleBeginTime = this.postParam.settleEndTime = null
        }
        // if (val) {
        //   this.postParam.settleBeginTime = filterTime(val[0])
        //   this.postParam.settleEndTime = filterTime(val[1])
        // } else {
        //   this.postParam.settleBeginTime = this.postParam.settleEndTime = null
        // }
      },
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 改变条目大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.myCaseBack(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.myCaseBack(this.postParam)
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField' && key !== 'type') {
            param[key] = null
          }
        }
        this.searchConditionsContent = this.timeRange = ''
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
            this.$message.error('手机号码格式错误')
            return
          }
        }
        if (!param.maxOverdueDays && !param.minOverdueDays) {
          this.myCaseBack(param)
          this.statistical(param)
          return
        }
        if ((param.maxOverdueDays || param.minOverdueDays)) {
          if (validateDay(param.minOverdueDays, param.maxOverdueDays)) {
            this.myCaseBack(param)
            this.statistical(param)
          } else {
            this.$message.error('逾期天数输入有误')
          }
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../style/filterStyle';

  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .split_line {
    display: inline-block;
    line-height: 32px;
    padding: 0 5px;
    flex-shrink: 0;
  }
</style>
