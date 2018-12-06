<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">开户</p>
    <el-card class="mb14 box-card">
      <el-row :gutter="20" class="mb14">
        <el-col :span="6">
          <el-select v-model="searchConditions" placeholder="请选择" size="small" @change="selectConditions"
                     class="mr14" style="width:80px">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.searchConditions"
                       :key="item.code"
                       :label="item.value" searchConditions
                       :value="item.code">
            </el-option>
          </el-select>
          <el-input size="small" v-model="searchConditionsContent" :placeholder="placeHolder"
                    class="input_with"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label f14">提交时间:</span>
          <el-date-picker
            v-model="pushTimeRange" @change="changePushTimeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label f14">回调时间:</span>
          <el-date-picker
            v-model="callTimeRange" @change="changeTimeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
          </el-date-picker>
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

      <el-table v-if="openAccountData" :data="openAccountData.records"
                border style="width: 100%">
        <el-table-column label="用户ID" prop="userId">
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
        <el-table-column prop="accountResult" label="交易结果">
        </el-table-column>
        <el-table-column label="提交时间" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.submitTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="回调时间" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.callbackTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="接口返回">
        </el-table-column>

      </el-table>

      <div class="tr pt30 rel" v-if="openAccountData">
        <p class="total_num">
          共 {{openAccountData.totalrecord}} 条
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="openAccountData.totalrecord"
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
  import {validateMobilePhone, filterTime, judgeLimit, clearHistorySearch, isArray, setSearchValue} from '../../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from './userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '待开户', name: '0'},
          {label: '成功', name: '1'},
          {label: '失败', name: '2'},
          {label: '所有', name: '-1'}
        ],
        postParam: {
          userId: null, // 用户id
          realName: null, // 姓名
          mobile: null, // 手机号
          beginSubmitTime: null, // 开始提交时间
          endSubmitTime: null, // 结束提交时间
          beginCallbackTime: null, // 结束回调时间
          endCallbackTime: null, // 结束回调时间
          state: 0,
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'userId' // 排序字段名
        },
        activeName: '0',
        statisticalData: null,
        callTimeRange: '', // 回调时间
        pushTimeRange: '',  // 提交时间
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
      ...mapState(['openAccountData', 'fixedField']),
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
      this.OpenAccount(this.postParam)
    },
    methods: {
      ...mapActions(['OpenAccount', 'buttonLimit']),
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
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
        this.OpenAccount(this.postParam)
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
        this.callTimeRange = this.pushTimeRange = ''
      },
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.state = parseInt(this.activeName)
        } else {
          this.postParam.state = null
        }
        this.OpenAccount(this.postParam)
        this.postParam.pageNow = 1
      },
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 选择放宽时间范围
      changeTimeRange(val) {
        if (this.callTimeRange) {
          if (isArray(this.callTimeRange)) {
            this.postParam.beginCallbackTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.endCallbackTime = filterTime(this.callTimeRange[1], 'dateTime')
          } else {
            this.callTimeRange = [this.callTimeRange, this.callTimeRange]
            this.postParam.beginCallbackTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.endCallbackTime = filterTime(this.callTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.beginCallbackTime = this.postParam.endCallbackTime = null
        }
        // if (val) {
        //   this.postParam.beginCallbackTime = filterTime(val[0])
        //   this.postParam.endCallbackTime = filterTime(val[1])
        // } else {
        //   this.postParam.beginCallbackTime = this.postParam.endCallbackTime = null
        // }
      },
      changePushTimeRange(val) {
        if (this.pushTimeRange) {
          if (isArray(this.pushTimeRange)) {
            this.postParam.beginSubmitTime = filterTime(this.pushTimeRange[0], 'dateTime')
            this.postParam.endSubmitTime = filterTime(this.pushTimeRange[1], 'dateTime')
          } else {
            this.pushTimeRange = [this.pushTimeRange, this.pushTimeRange]
            this.postParam.beginSubmitTime = filterTime(this.pushTimeRange[0], 'dateTime')
            this.postParam.endSubmitTime = filterTime(this.pushTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.beginSubmitTime = this.postParam.endSubmitTime = null
        }
        // if (val) {
        //   this.postParam.beginSubmitTime = filterTime(val[0])
        //   this.postParam.endSubmitTime = filterTime(val[1])
        // } else {
        //   this.postParam.beginSubmitTime = this.postParam.endSubmitTime = null
        // }
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.OpenAccount(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.OpenAccount(this.postParam)
      }
    }
  }
</script>

<style scoped lang="less">
  @import '../../../style/filterStyle';

  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .button_rel {
    bottom: 32px;
  }
</style>
