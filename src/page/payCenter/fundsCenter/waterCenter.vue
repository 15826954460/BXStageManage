<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">流水中心</p>
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
          <span class="label">交易编号:</span>
          <el-input size="small"
                    v-model="postParam.tradeOrderNo" placeholder="输入交易编号"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">借款编号:</span>
          <el-input size="small"
                    v-model="postParam.loanOrderNo" placeholder="输入借款编号"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">流水类型:</span>
          <el-cascader v-if="fixedField" size="small"
                       :change-on-select="true"
                       :options="fixedField.waterType"
                       v-model="selectedOptions"
                       @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <el-row class="mb14" :gutter="20">
        <el-col :span="6">
          <span class="label">交易时间:</span>
          <el-date-picker
            v-model="timeRange" @change="changeLendingTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>

      </el-row>

      <div class="tr pr button_rel">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table v-if="waterCenter.records"
                :data="waterCenter.records" border style="width: 100%">
        <el-table-column label="用户ID"> <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
        </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column label="流水类型">
          <template slot-scope="scope">
            <span v-if="fixedField" v-for="item in fixedField.waterTypeShow"
                  :key="item.code"
                  v-show="scope.row.type === Number.parseInt(item.code)">
              {{item.value}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="交易金额">
          <template slot-scope="scope">
            <span v-html="(scope.row.assetType === 1 || scope.row.assetType === 2) ? '+' : '-'"></span>
            {{scope.row.amount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="tradeOrderNo" label="交易编号" width="200px">
        </el-table-column>
        <el-table-column prop="loanOrderNo" label="借款编号" width="180px">
        </el-table-column>
        <el-table-column prop="createTime" label="交易时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.tradeTime | dateTime}}
          </template>
        </el-table-column>

        <el-table-column label="备注" width="170px">
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
                  v-show="scope.row.remark.length<=12">{{scope.row.remark | minStr12}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30 rel" v-if="waterCenter">
        <p class="total_num">
          共 {{waterCenter.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="waterCenter.totalrecord"
        >
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
  import {filterTime, judgeLimit, clearHistorySearch, isArray, validateMobilePhone, setSearchValue} from '../../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from '../../index/userManage/userDetailDialog'
  export default {
    data: function () {
      return {
        timeRange: [], // 交易时间
        statisticalData: null,
        selectedOptions: [null], // 流水类型原因码
        postParam: {
          realName: null,
          mobile: null,
          userId: null, // 用户id
          loanOrderNo: null, // 借款订单号
          tradeOrderNo: null, // 交易单号
          startDate: null, // 开始时间
          endDate: null, // 结束时间
          assetType: null, // 资产类型
          type: null, // 资金类型
          sortField: 'tradeTime',
          sort: 'desc', // 排序(asc正序，desc倒序)
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
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
      ...mapState(['waterCenter', 'fixedField']),
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
      // 或取表尾统计数据
      this.statistical(this.postParam)
      // 获取流水中心的数据
      this.getWaterCenter(this.postParam)
    },
    methods: {
      ...mapActions(['getWaterCenter', 'buttonLimit']),
      selectConditions() {
        console.log(this.searchConditions)
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
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 表尾统计
      statistical(data) {
        axios.post('funds/statisticsFundsRecord', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          }
        })
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
        this.getWaterCenter(this.postParam)
        this.statistical(this.postParam)
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'pageSize' &&
            key !== 'pageNow' &&
            key !== 'sort' &&
            key !== 'sortField') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.timeRange = ''
        this.selectedOptions = [null]
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getWaterCenter(this.postParam)
        this.statistical(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getWaterCenter(this.postParam)
        this.statistical(this.postParam)
      },
      // 选择录入时间范围
      changeLendingTimeRange(val) {
        if (this.timeRange) {
          if (isArray(this.timeRange)) {
            this.postParam.startDate = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.endDate = filterTime(this.timeRange[1], 'dateTime')
          } else {
            this.timeRange = [this.timeRange, this.timeRange]
            this.postParam.startDate = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.endDate = filterTime(this.timeRange[1], 'dateTime')
          }
        } else {
          this.postParam.startDate = this.postParam.endDate = null
        }
        // if (val) {
        //   this.postParam.startDate = filterTime(val[0])
        //   this.postParam.endDate = filterTime(val[1])
        // } else {
        //   this.postParam.startDate = this.postParam.endDate = null
        // }
      },
      // 选择流水类型
      handleChange(value) {
        console.log(value[0] === null)
        if (value.length && value.length === 1 && value[0] !== null) {
          this.postParam.assetType = value[0]
        } else if (value.length && value.length === 2) {
          this.postParam.assetType = value[0]
          this.postParam.type = value[1]
        } else {
          this.postParam.assetType = null
          this.postParam.type = null
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../../style/filterStyle";

  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>
