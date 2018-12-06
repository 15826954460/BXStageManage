<template>
  <el-card style="width:100%;" class="big_background">
    <!--<p class="mb14 fw f18">放款记录</p>-->

      <el-tabs v-model="merchants" @tab-click="selectMerchants">
        <el-tab-pane label="荷包放款" name="2"></el-tab-pane>
        <el-tab-pane label="淮南放款" name="1"></el-tab-pane>
      </el-tabs>


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
          <el-input size="small" v-model="postParam.orderNo" placeholder="输入交易编号"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">借款编号:</span>
          <el-input size="small" v-model="postParam.loanOrderNo" placeholder="输入借款编号"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">支付单号:</span>
          <el-input size="small" v-model="postParam.payOrderId" placeholder="输入支付单号"
          ></el-input>
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
          <span class="label">支付渠道:</span>
          <el-select v-model="postParam.payChannel" placeholder="请选择" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.payChannelList"
                       :key="item.channelNum"
                       :label="item.channelName"
                       :value="item.channelNum">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
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


      </el-row>

      <div class="tr pr">
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
                   @click="exportExcel" v-show="showExportBtn"
                   style="top: 0;right: 0">导出
        </el-button>
      </div>

      <el-table v-if="lendingListData"
                :data="lendingListData.records" border style="width: 100%">
        <el-table-column prop="orderNo" label="交易编号" width="200px">
        </el-table-column>
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
        <el-table-column prop="bankCardNo" label="银行卡号" width="180px">
        </el-table-column>
        <el-table-column prop="bankName" label="开户行">
        </el-table-column>
        <el-table-column prop="amount" label="交易金额" width="100px">
          <template slot-scope="scope">
            {{scope.row.amount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column prop="merchant" label="支付商户">
        </el-table-column>
        <el-table-column prop="payChannel" label="支付渠道">
        </el-table-column>
        <el-table-column prop="payOrderId" label="支付单号" width="200px">
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.createTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="回调时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.callbackTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="支付描述" width="170px">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.descript"
              v-show="scope.row.descript.length > 12"
              placement="right" title=""
              width="300"
              popper-class="break"
              trigger="hover"
              :content="scope.row.descript">
              <span slot="reference" class="cur">{{scope.row.descript | minStr12}}</span>
            </el-popover>
            <span v-if="scope.row.descript"
                  v-show="scope.row.descript.length<=12">{{scope.row.descript | minStr12}}</span>
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
        <!--<el-table-column label="操作">-->
        <!--<template slot-scope="scope">-->
        <!--<el-button @click="searchSure(scope.row)"-->
        <!--type="text" class="cur"-->
        <!--v-show="parseInt(activeName) === 1">查询-->
        <!--</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
      </el-table>

      <div class="tr pt30 rel" v-if="lendingListData"
           v-show="showTransferType === 0">
        <p class="total_num">
          共 {{lendingListData.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postParam.pageNow"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :total="lendingListData.totalrecord"
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
  import {filterTime, judgeLimit, clearHistorySearch, isArray, validateMobilePhone, setSearchValue} from '../../../untils/common'
  import userDetailDialog from '../../index/userManage/userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
//          {label: '待放款', name: '0'},
          {label: '放款中', name: '1'},
          {label: '放款成功', name: '2'},
          {label: '放款失败', name: '3'},
          {label: '放款异常', name: '4'},
          {label: '所有订单', name: '-1'}
        ],
        auditList: [],
        postParam: {
          userId: null, // 用户Id
          realName: null,
          mobile: null,
          orderNo: null, // 交易编号
          loanOrderNo: null, // 借款编号
          payChannel: null, // 渠道null
          minCreateTime: null, // 开始时间
          maxCreateTime: null, // 开始时间
          minCallbackTime: null, // 初始回调时间
          maxCallbackTime: null, // 结束回调时间
          bankCode: null, // 开户行代码
          payOrderId: null, // 支付单号
          merchant: 2, // 1. 淮南  2. 荷包
          state: 1, // 放款状态
          sortField: 'orderNo',
          sort: 'desc', // 排序(asc正序，desc倒序)
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
        orderNo: null,
        outerVisible: false,
        showTransferType: 0, // 放款状态
        timeRange: '', // 时间范围
        callBackTimeRange: '', // 回掉时间范围
        statisticalData: null,
        activeName: '1',
        merchants: '2',
        menuId: 46,
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
      // 初始化借款列表
      this.getLendingList(this.postParam)
      // 或取表尾统计数据
      this.statistical(this.postParam)
      this.getBankList()
    },
    computed: {
      ...mapState(['fixedField', 'lendingListData', 'openBankList']),
      showExportBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.menuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    components: {
      userDetailDialog
    },
    methods: {
      ...mapActions(['getLendingList', 'buttonLimit', 'getBankList']),
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
          this.postParam.state = parseInt(this.activeName)
        } else {
          this.postParam.state = null
        }
        this.getLendingList(this.postParam)
        this.statistical(this.postParam)
        this.postParam.pageNow = 1
      },
      // 表尾统计
      statistical(data) {
        axios.post('release/releaseAmountCount', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          }
        })
      },
      // 获取导出excel文件的参数
      filterParam() {
        let newParams = {}
        Object.keys(this.postParam).forEach(key => {
          if (!Object.is(key, 'pageSize') && !Object.is(key, 'pageNow') && this.postParam[key]) {
            newParams[key] = this.postParam[key]
          }
        })
        return newParams
      },
      // 导出excel
      exportExcel() {
        let host = window.location.origin
        let filterParam = this.filterParam()
        let par = ''
        for (let key in filterParam) {
          par += `${key}=${filterParam[key]}&`
        }
        window.open(`${host}/api/release/releaseListExcel?${par}`)
      },
      selectMerchants(tab, event) {
        if (this.merchants) {
          this.postParam.merchant = parseInt(this.merchants)
        }
        this.postParam.pageNow = 1
        this.getLendingList(this.postParam)
        this.statistical(this.postParam)
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getLendingList(this.postParam)
        this.statistical(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getLendingList(this.postParam)
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
        // if (val) {
        //   this.postParam.minCreateTime = filterTime(val[0])
        //   this.postParam.maxCreateTime = filterTime(val[1])
        // } else {
        //   this.postParam.minCreateTime = this.postParam.maxCreateTime = null
        // }
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
        // if (val) {
        //   this.postParam.minCallbackTime = filterTime(val[0])
        //   this.postParam.maxCallbackTime = filterTime(val[1])
        // } else {
        //   this.postParam.minCallbackTime = this.postParam.maxCallbackTime = null
        // }
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'pageSize' &&
            key !== 'pageNow' &&
            key !== 'state' &&
            key !== 'sort' && key !== 'sortField' && key !== 'merchant') {
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
        this.getLendingList(this.postParam)
        this.statistical(this.postParam)
      },
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      // 查询
      searchSure(row) {
        this.outerVisible = true
        this.orderNo = row.orderNo
      },
      // 确定查询交易状态
      async sure() {
        axios.post('release/query', {tradeOrderNo: this.orderNo}).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
          this.getLendingList(this.postParam)
          this.statistical(this.postParam)
          this.outerVisible = false
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
</style>

