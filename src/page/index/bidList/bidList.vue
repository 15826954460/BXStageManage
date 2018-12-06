<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">标的</p>

    <el-card class="mb14 box-card" style="position:relative">
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
          <span class="label f14">标的生成时间:</span>
          <el-date-picker
            v-model="createTimeRange" @change="changeTimeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label f14">回调时间:</span>
          <el-date-picker
            v-model="callTimeRange" @change="changeCallTimeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="f14 label">借款编号:</span>
          <el-input size="small" v-model="postParam.loanOrderNo" placeholder="输入借款编号" class="input_with"></el-input>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mb14">
        <el-col :span="6" class="el-col">
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

      <div class="tr pr button_rel">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane v-for="item in menuList" :key="item.index"
                     :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>

      <el-table v-if="bidListInfoInfoData" :data="bidListInfoInfoData.records"
                border style="width: 100%">
        <el-table-column label="用户ID">
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="realName">
        </el-table-column>
        <el-table-column label="手机号" prop="mobile">
        </el-table-column>
        <el-table-column label="借款编号" prop="loanOrderNo" width="180px">
        </el-table-column>
        <el-table-column label="借款金额">
          <template slot-scope="scope">
            <span>{{scope.row.loanAmount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="借款期数">
          <template slot-scope="scope">
            <span>{{scope.row.term}}期</span>
          </template>
        </el-table-column>
        <el-table-column label="标的状态" width="180px">
          <template slot-scope="scope">
          <span v-if="fixedField" v-for="item in fixedField.bidType"
                :key="item.code"
                v-show="item.code === scope.row.state">{{item.value}}</span>
          </template>
        </el-table-column>
        <el-table-column label="标的生成时间" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="回调时间" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.callbackTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="接口返回" prop="description">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
        </el-table-column>

      </el-table>

      <div class="tr pt30 rel" v-if="bidListInfoInfoData">
        <p class="total_num">
          共 {{bidListInfoInfoData.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="bidListInfoInfoData.totalrecord"
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
  import {filterTime, validateMobilePhone, judgeLimit, clearHistorySearch, isArray, setSearchValue} from '../../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from '../userManage/userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '待建标', name: '1'},
          {label: '已建标', name: '2'},
          {label: '建标失败', name: '3'},
          {label: '已撤标', name: '4'},
          {label: '撤标失败', name: '5'},
          {label: '待提交发标', name: '6'},
          {label: '提交发标成功', name: '7'},
          {label: '提交发标失败', name: '8'},
          {label: '融资成功', name: '9'},
          {label: '已流标', name: '10'},
          {label: '所有', name: '-1'}
        ],
        postParam: {
          userId: null, // 用户id
          realName: null, // 姓名
          mobile: null,
          loanOrderNo: null, // 借款编号
          minCreateTime: null, // 开始注册时间
          maxCreateTIme: null, // 结束注册时间
          minCallBackTime: null,
          maxCallBackTime: null,
          term: null, // 借款期数
          state: 1, // 1、待建标 ，2、建标成功 ，3、建标失败  4、撤标成功 ，5、撤标失败 ，6、待发标，7、发标成功 8、发标失败 ，9、满标(融资成功)，10、已流标
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'createTime' // 排序字段名
        },
        activeName: '1',
        statisticalData: null,
        createTimeRange: '', // 提交时间范围
        callTimeRange: '',
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
      userDetailDialog
    },
    computed: {
      ...mapState(['bidListInfoInfoData', 'fixedField']),
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      this.bidListInfo(this.postParam)
      this.statistical(this.postParam)
    },
    methods: {
      ...mapActions(['bidListInfo', 'buttonLimit']),
      // 表尾统计
      statistical(data) {
        axios.post('bid/getTotalAmount', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          }
        })
      },
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
        this.bidListInfo(this.postParam)
        this.statistical(this.postParam)
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
        this.createTimeRange = this.callTimeRange = ''
      },
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 选择放宽时间范围
      changeTimeRange(val) {
        if (this.createTimeRange) {
          if (isArray(this.createTimeRange)) {
            this.postParam.minCreateTime = filterTime(this.createTimeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.createTimeRange[1], 'dateTime')
          } else {
            this.createTimeRange = [this.createTimeRange, this.createTimeRange]
            this.postParam.minCreateTime = filterTime(this.createTimeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.createTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minCreateTime = this.postParam.maxCreateTime = null
        }
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.bidListInfo(this.postParam)
        this.statistical(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.bidListInfo(this.postParam)
        this.statistical(this.postParam)
      },
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.state = parseInt(this.activeName)
        } else {
          this.postParam.state = null
        }
        this.bidListInfo(this.postParam)
        this.statistical(this.postParam)
        this.postParam.pageNow = 1
      },
      changeCallTimeRange(val) {
        if (this.callTimeRange) {
          if (isArray(this.callTimeRange)) {
            this.postParam.minCallBackTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.maxCallBackTime = filterTime(this.callTimeRange[1], 'dateTime')
          } else {
            this.callTimeRange = [this.callTimeRange, this.callTimeRange]
            this.postParam.minCallBackTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.maxCallBackTime = filterTime(this.callTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minCallBackTime = this.postParam.maxCallBackTime = null
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../../style/filterStyle';

  .el-col {
    .label {
      width: 100px;
    }
  }

  .button_rel {
    position:absolute;
    bottom: 32px;
  }

  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>
