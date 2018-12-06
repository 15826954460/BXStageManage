<template>
  <el-card style="width:100%" class="big_background">
    <p class="mb14 f18 fw">银行卡</p>
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
        <el-col :span="6">
          <span class="label f14">绑卡时间:</span>
          <el-date-picker
            v-model="callTimeRange" @change="changeTimeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <span class="label">开户行:</span>
          <el-select v-model="postParam.bankCode" size="small" class="input_with">
            <el-option v-if='openBankList'
                       v-for="(item, index) in openBankList"
                       :key="index"
                       :label="item.bankName"
                       :value="item.bankWay">
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

      <el-table v-if="stickListData" :data="stickListData.records" border style="width: 100%">
        <el-table-column label="用户ID" >
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" >
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" >
        </el-table-column>
        <el-table-column prop="bankCardNo" label="银行卡号" >
        </el-table-column>
        <el-table-column prop="bankName" label="开户行" >
        </el-table-column>
        <el-table-column prop="bankCardMobile" label="预留手机号" >
        </el-table-column>
        <el-table-column prop="signDescription" label="签约情况" >
          <template slot-scope="scope">
            <p v-for="(item, index) in scope.row.signDescription" :key="index">{{item}}</p>
          </template>
        </el-table-column>
        <el-table-column label="绑卡时间">
          <template slot-scope="scope">
            {{scope.row.createTime | dateTime}}
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="stickListData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="stickListData.totalrecord">
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
  import {filterTime, judgeLimit, clearHistorySearch, isArray, setSearchValue, validateMobilePhone} from '../../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from './userDetailDialog'

  export default {
    data: function () {
      return {
        postParam: {
          userId: null,
          realName: null,
          idCard: null,
          bankCode: null,
          beginCreateTime: null,
          endCreateTime: null,
          sort: 'desc', // 排序(asc正序，desc倒序)
          pageSize: 10, //
          pageNow: 1 //
        },
        callTimeRange: '',
        signingData: [],
        currentPage: 1,
        activeName: 'first',
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
      // 初始化绑卡列表数据
      this.getStickList(this.postParam)
      this.getBankList()
    },
    components: {
      userDetailDialog
    },
    computed: {
      ...mapState(['fixedField', 'stickListData', 'openBankList']),
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    methods: {
      ...mapActions(['getStickList', 'getBankList', 'buttonLimit']),
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
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
      handleClick(tab, event) {
        this.postParam.pageNow = 1
      },
      // 选择放宽时间范围
      changeTimeRange(val) {
        if (this.callTimeRange) {
          if (isArray(this.callTimeRange)) {
            this.postParam.beginCreateTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.endCreateTime = filterTime(this.callTimeRange[1], 'dateTime')
          } else {
            this.callTimeRange = [this.callTimeRange, this.callTimeRange]
            this.postParam.beginCreateTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.endCreateTime = filterTime(this.callTimeRange[1], 'dateTime')
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
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getStickList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getStickList(this.postParam)
      },
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.callTimeRange = ''
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
        this.getStickList(this.postParam)
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
