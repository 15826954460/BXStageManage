<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">待放款列表</p>
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
          <span class="label">借款编号:</span>
          <el-input size="small" v-model="postParam.loanOrderNo" placeholder="输入借款编号" class="input_with"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">资金方:</span>
          <el-select v-model="postParam.funder" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.funderType"
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
      <el-table v-if="waitLendingListData" :data="waitLendingListData.records"
                border style="width: 100%">
        <el-table-column prop="loanOrderNo" label="借款编号" width="180px">
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" >
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" >
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" width="120px">
        </el-table-column>
        <el-table-column label="借款金额" >
          <template slot-scope="scope">
            {{scope.row.amount | toThousands}}
          </template>
        </el-table-column>
        <el-table-column label="借款期数" >
          <template slot-scope="scope">
            {{scope.row.term}}
          </template>
        </el-table-column>
        <el-table-column label="申请时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.createTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="channelName" label="渠道" >
        </el-table-column>
        <el-table-column label="审批时间" width="180px">
          <template slot-scope="scope">
            {{scope.row.auditTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="funderStr" label="资金方" >
        </el-table-column>
      </el-table>

      <div class="tr pt30 rel" v-if="waitLendingListData">
        <p class="total_num">
          共 {{waitLendingListData.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="waitLendingListData.totalrecord">
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
  import {filterTime, validateMobilePhone, judgeLimit, clearHistorySearch, setSearchValue} from '../../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from '../../index/userManage/userDetailDialog'
  import axios from 'axios'
  export default {
    data: function () {
      return {
        postParam: {
          funder: null, // 资金方
          userId: null, // 用户id
          realName: null, // 姓名
          mobile: null, // 手机号
          idCard: null, // 身份证
          loanOrderNo: null, // 借款编号
          state: 0, // 借款状态
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'createTime' // 排序字段名
        },
        statisticalData: null,
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
    components: {
      userDetailDialog
    },
    created() {
      this.buttonLimit()
    },
    computed: {
      ...mapState(['waitLendingListData', 'fixedField']),
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    mounted() {
      this.getWaitLendingList(this.postParam)
      this.statistical(this.postParam)
    },
    methods: {
      ...mapActions(['getWaitLendingList', 'buttonLimit']),
      // 表尾统计
      statistical(data) {
        axios.post('release/waitReleaseCount', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          } else {
            this.$message.error(res.data.message)
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
      // 改变条目大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getWaitLendingList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getWaitLendingList(this.postParam)
      },
      // 选择申请时间范围
      changeApplyTimeRange(val) {
        if (val) {
          this.postParam.minCreateTime = filterTime(val[0])
          this.postParam.maxCreateTime = filterTime(val[1])
        } else {
          this.postParam.minCreateTime = this.postParam.maxCreateTime = null
        }
      },
      // 选择审批时间范围
      changeAduitTimeRange(val) {
        if (val) {
          this.postParam.minAuditTime = filterTime(val[0])
          this.postParam.maxAuditTime = filterTime(val[1])
        } else {
          this.postParam.minAuditTime = this.postParam.maxAuditTime = null
        }
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField' && key !== 'state') {
            param[key] = null
          }
          if (key === 'state') {
            param[key] = 0
          }
        }
        this.searchConditionsContent = ''
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
        this.getWaitLendingList(this.postParam)
        this.statistical(this.postParam)
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
  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>
