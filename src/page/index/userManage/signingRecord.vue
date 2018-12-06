<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">签约</p>
    <el-card class="mb14 box-card" style="width:100%;">
      <el-row :gutter="20" class="mb14">
        <el-col :span="6" class="el-col">
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
          <span class="label">支付商户:</span>
          <el-select v-model="postParam.merchant"
                     size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.payMerchants"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">支付渠道:</span>
          <el-select v-model="postParam.signChannel" placeholder="请选择"
                     size="small">
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
        <el-col :span="6" class="el-col">
          <span class="label">签约类型:</span>
          <el-select v-model="postParam.signType" placeholder="请选择"
                     size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.signingType"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">提交时间:</span>
          <el-date-picker
            v-model="timeRange" @change="changeBackTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">回调时间:</span>
          <el-date-picker
            v-model="callTimeRange" @change="changeCallTimeRange"
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

    <el-card style="width:100%;">
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane v-for="item in menuList" :key="item.index"
                     :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <el-table v-if="signingRecordData"
                :data="signingRecordData.records" border style="width: 100%;">
        <el-table-column prop="userId" label="用户ID">
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column prop="bankName" label="开户行">
        </el-table-column>
        <el-table-column prop="bankCardMobile" label="预留手机号" width="120px">
        </el-table-column>
        <el-table-column prop="merchant" label="支付商户" width="120px">
        </el-table-column>
        <el-table-column prop="signChannelStr" label="支付渠道">
        </el-table-column>
        <el-table-column prop="signType" label="签约类型" width="120px">
        </el-table-column>
        <el-table-column label="提交时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.createTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="回调时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.signTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="errorCode" label="返回码">
        </el-table-column>
        <el-table-column label="签约备注" width="200px">
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
            <span
              v-if="scope.row.remark"
              v-show="scope.row.remark.length<=12"
              class="cur">{{scope.row.remark | minStr12}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tr pt30" v-if="signingRecordData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="signingRecordData.totalrecord">
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
  import {filterTime, judgeLimit, clearHistorySearch, isArray, setSearchValue, validateMobilePhone} from '../../../untils/common'
  import userDetailDialog from './userDetailDialog'
  export default {
    data: function () {
      return {
        menuList: [
          {label: '成功', name: '1'},
          {label: '失败', name: '0'},
          {label: '所有', name: '-1'}
        ],
        postParam: {
          userId: null, // 用户id
          realName: null, // 姓名
          idCard: null, // 身份证号
          bankCode: null, // 开户行code
          signChannel: null, // 支付渠道code
          beginCreateTime: null,
          endCreateTime: null,
          merchant: null,
          signType: null,
          beginSignTime: null,
          endSignTime: null,
          state: 1,
          code: null, // 签约状态code
          sort: 'desc', // 排序(asc正序，desc倒序)
          pageSize: 10, //
          pageNow: 1 //
        },
        // openBankList: [],
        timeRange: '',
        callTimeRange: '',
        activeName: '1',
        currentPage: 1,
        // v_0.7.3
        userId: '',
        userDetailMenuId: 58, // 用户详情
        isShowDetail: false,
        searchConditionsContent: '', // 搜索内容
        searchConditions: 1, // 下拉框的选择
        placeHolder: '请输入姓名' // 提示信息
      }
    },
    mounted() {
      // 初始签约记录数据
      this.getSigningRecord(this.postParam)
      this.getBankList()
    },
    components: {
      userDetailDialog
    },
    computed: {
      ...mapState(['fixedField', 'signingRecordData', 'openBankList']),
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    methods: {
      ...mapActions(['getSigningRecord', 'getBankList']),
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
      background() {
        return 'background'
      },
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 选择放宽时间范围
      changeBackTimeRange() {
        if (this.timeRange) {
          if (isArray(this.timeRange)) {
            this.postParam.beginCreateTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.endCreateTime = filterTime(this.timeRange[1], 'dateTime')
          } else {
            this.timeRange = [this.timeRange, this.timeRange]
            this.postParam.beginCreateTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.endCreateTime = filterTime(this.timeRange[1], 'dateTime')
          }
        } else {
          this.postParam.beginCreateTime = this.postParam.endCreateTime = null
        }
        // if (val) {
        //   this.postParam.beginCreateTime = filterTime(val[0])
        //   this.postParam.endCreateTime = filterTime(val[1])
        // } else {
        //   this.postParam.beginCreateTime = this.postParam.endCreateTime = null
        // }
      },
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.state = parseInt(this.activeName)
        } else {
          this.postParam.state = null
        }
        this.getSigningRecord(this.postParam)
        this.postParam.pageNow = 1
      },
      changeCallTimeRange(val) {
        if (this.callTimeRange) {
          if (isArray(this.callTimeRange)) {
            this.postParam.beginSignTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.endSignTime = filterTime(this.callTimeRange[1], 'dateTime')
          } else {
            this.callTimeRange = [this.callTimeRange, this.callTimeRange]
            this.postParam.beginSignTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.endSignTime = filterTime(this.callTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.beginSignTime = this.postParam.endSignTime = null
        }
        // if (val) {
        //   this.postParam.beginSignTime = filterTime(val[0])
        //   this.postParam.endSignTime = filterTime(val[1])
        // } else {
        //   this.postParam.beginSignTime = this.postParam.endSignTime = null
        // }
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getSigningRecord(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getSigningRecord(this.postParam)
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
        this.timeRange = this.callTimeRange = ''
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
        this.getSigningRecord(this.postParam)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../../style/filterStyle';

  .item {
    margin: 40px;
  }

  .el-tooltip__popper {
    padding: 8px 10px;
    width: 200px;
  }
  .button_rel {
    bottom: 32px;
  }
  .background {
    background: red;
  }
</style>
