<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">账单管理</p>
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
          <span class="label">账单编号:</span>
          <el-input size="small" v-model="postParam.billNo" placeholder="输入账单编号"
          ></el-input>
        </el-col>

        <el-col :span="6" class="el-col">
          <span class="label">还清时间:</span>
          <el-date-picker
            v-model="clearDateRange"
            @change="backClearDateRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>

        <!--@change="changeBackTimeRange"-->
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
      </el-row>

      <div class="tr pr">
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

      <el-table v-if="billListData" :data="billListData.records"
                :header-row-style="background"
                border style="width: 100%;">
        <el-table-column prop="billNo" label="账单编号"  width="200px">
        </el-table-column>
        <el-table-column prop="userId" label="用户ID"  width="120px">
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" >
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"  width="120px">
        </el-table-column>
        <!--<el-table-column prop="idCard" label="身份证号"  width="180px">-->
        <!--</el-table-column>-->
        <el-table-column label="账单总额" >
          <template slot-scope="scope">
            {{scope.row.billAmount | toThousands }}
          </template>
        </el-table-column>
        <el-table-column label="待还金额" >
          <template slot-scope="scope">
            {{scope.row.waitRepayAmount | toThousands }}
          </template>
        </el-table-column>
        <el-table-column label="还款日"  width="160px">
          <template slot-scope="scope">
            {{scope.row.repayDate | date }}
          </template>
        </el-table-column>
        <el-table-column prop="settleTime" label="还清时间"  width="160px">
          <template slot-scope="scope">
            {{scope.row.settleTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="账单状态" >
          <template slot-scope="scope">
              <span v-for="item in fixedField.accountStatus"
                    v-show="item.value === scope.row.state"
                    :style="{color: item.color}">
                 {{scope.row.state}}
              </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button @click="lookDetail(scope.row)"
                       v-show="showLookButton"
                       type="text" class="cur">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="billListData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="billListData.totalrecord">
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
  import {filterTime, validateMobilePhone, judgeLimit, clearHistorySearch, isArray, setSearchValue} from '../../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from '../userManage/userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '待还款', name: '0'},
//          {label: '逾期中', name: '1'},
          {label: '已还清', name: '1'},
          {label: '所有', name: '-1'}
        ],
        fontSize: {
          'font-size': '12px',
          'height': '20px'
        },
        background: {
          'background-color': '#F7EDF0'
        },
        postParam: {
          billNo: null, // 借款编号
          realName: null, // 姓名
          mobile: null, // 手机号
          userId: null,
          idCard: null, // 身份证号
          minRepayDate: null, // 还款开始日
          maxRepayDate: null, // 还款结束日
          minSettleTime: null, // 还清开始日
          maxSettleTime: null, // 还清结束日
          state: 0, // 状态属性
          sortField: 'billNo', // 排序字段名
          sort: 'desc', // 排序(asc正序，desc倒序)
          pageSize: 10, //
          pageNow: 1 //
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
        backDateRange: [],
        clearDateRange: '',
        lookMenuId: 67,
        activeName: '0',
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
      ...mapState(['fixedField', 'billListData']),
      showLookButton: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.lookMenuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    components: {
      userDetailDialog
    },
    mounted() {
      // 初始化账单管理数据
      this.getBillList(this.postParam)
    },
    methods: {
      ...mapActions(['getBillList', 'buttonLimit']),
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
          this.postParam.state = null
        } else {
          this.postParam.state = parseInt(this.activeName)
        }
        this.postParam.pageNow = 1
        this.getBillList(this.postParam)
      },
      // 选择还款范围
      // changeBackTimeRange(val) {
      // },
      // 选择还清时间
      backClearDateRange(val) {
        if (this.clearDateRange) {
          if (isArray(this.clearDateRange)) {
            this.postParam.minSettleTime = filterTime(this.clearDateRange[0], 'dateTime')
            this.postParam.maxSettleTime = filterTime(this.clearDateRange[1], 'dateTime')
          } else {
            this.clearDateRange = [this.clearDateRange, this.clearDateRange]
            this.postParam.minSettleTime = filterTime(this.clearDateRange[0], 'dateTime')
            this.postParam.maxSettleTime = filterTime(this.clearDateRange[1], 'dateTime')
          }
        } else {
          this.postParam.minSettleTime = this.postParam.maxSettleTime = null
        }
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getBillList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getBillList(this.postParam)
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField' && key !== 'state') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.clearDateRange = ''
        this.backDateRange = []
      },
      // 查询
      search() {
        let param = this.postParam
        if (!this.searchConditionsContent) {
          param.mobile = null
        }
        // 验证手机号格式
        if (param.mobile) {
          if (!validateMobilePhone(param.mobile)) {
            this.$message.error('手机号码格式错误，请重新你输入')
            return
          }
        }
        let paramArr = [this.searchConditions, this.postParam, this.searchConditionsContent, 'userId']
        setSearchValue(...paramArr)
        this.getBillList(this.postParam)
      },
      // 查看详情
      lookDetail(row) {
        const url = `${window.location.origin + window.location.pathname}#/nav/index/accountDetail/?billNo=${row.billNo}`
        window.open(url, '_blank')
      }
    },
    watch: {
      backDateRange: {
        handler(val) {
          if (val) {
            this.postParam.minRepayDate = filterTime(val[0])
            this.postParam.maxRepayDate = filterTime(val[1])
          } else {
            this.postParam.minRepayDate = this.postParam.maxRepayDate = null
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
  .el-table .cell{
    height:20px;
    border:1px solid red;
  }
  .button_rel {
    bottom: 32px;
  }
</style>
