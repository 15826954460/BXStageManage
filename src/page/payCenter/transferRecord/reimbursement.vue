<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">减免记录</p>
    <el-card class="mb14 box-card" style="width:100%;position: relative">
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
          <el-input size="small" v-model="postParam.loanOrderNo"
                    placeholder="输入借款编号"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">交易编号:</span>
          <el-input size="small" v-model="postParam.orderNo"
                    placeholder="输入交易编号"></el-input>
        </el-col>
        <el-col :span="6">
          <span class="label">减免类型:</span>
          <el-select v-model="postParam.remitType" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.reimburseType"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>

      </el-row>

      <el-row :gutter="20" class="mb14">
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
          <span class="label">操作人:</span>
          <el-select v-model="postParam.operatorId" size="small">
            <el-option v-if='OperationList'
                       v-for="item in OperationList"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <div class="tr pr button_rel">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card style="width:100%;">

      <div class="tr mb14">
        <el-button type="primary" size="small" class="cur"
                   v-show="showExportBtn"
                   @click="exportExcel">导出
        </el-button>
      </div>

      <div v-if="reimbursementListData">
        <el-table v-if="reimbursementListData.records"
                  :data="reimbursementListData.records"
                  border style="width: 100%">
          <el-table-column prop="orderNo" label="交易编号" width="200px">
          </el-table-column>
          <el-table-column prop="userId" label="用户ID" width="100px">
            <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
            </template>
          </el-table-column>
          <el-table-column prop="realName" label="姓名" width="100px">
          </el-table-column>
          <el-table-column prop="mobile" label="手机号">
          </el-table-column>
          <el-table-column prop="loanOrderNo" label="借款编号" width="170px">
          </el-table-column>
          <!--<el-table-column prop="phaseName" label="期次名称">-->
          <!--</el-table-column>-->
          <el-table-column prop="remitAmount" label="减免金额" width="150px">
            <template slot-scope="scope">
              {{scope.row.remitAmount | toThousands}}
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="操作人" width="100px">
          </el-table-column>
          <el-table-column label="提交时间" width="180px">
            <template slot-scope="scope">
              {{scope.row.createTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column label="减免类型">
            <template slot-scope="scope">
              {{scope.row.remitType}}
            </template>
          </el-table-column>
          <el-table-column label="减免原因">
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
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button @click="remimbursement(scope.row)"
                         type="text" class="cur">明细
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="tr pt30 rel" v-if="reimbursementListData && reimbursementListData.totalrecord">
        <p class="total_num">
          共 {{reimbursementListData.totalrecord}} 条，金额合计: {{statisticalData | toThousands}} 元
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="reimbursementListData.totalrecord">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="减免明细" :visible.sync="dialogTableVisible"

               @close="dialogTableVisible = false">
      <el-table v-if="entryDetail" :data="entryDetail">
        <el-table-column property="billNo" label="账单编号" width="200"></el-table-column>
        <el-table-column property="loanOrderNo" label="借款编号" width="200"></el-table-column>
        <el-table-column property="phaseName" label="期次名称"></el-table-column>
        <el-table-column label="本次交易金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount | toThousands}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <userDetailDialog
      :userId="userId"
      @listenChildEvent="hideUserDetail"
      v-if="isShowDetail"></userDetailDialog>

  </el-card>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import axios from 'axios'
  import {filterTime, judgeLimit, clearHistorySearch, isArray, validateMobilePhone, setSearchValue} from '../../../untils/common'
  import userDetailDialog from '../../index/userManage/userDetailDialog'
  export default {
    data: function () {
      return {
        postParam: {
          remitType: null, // 减免类型
          loanOrderNo: null,  // 借款编号
          sortField: 'orderNo',
          sort: 'desc', // 排序(asc正序，desc倒序)
          minCreateTime: null, // 时间范围开始
          maxCreateTIme: null, // 时间范围结束
          operatorId: null, // 操作人
          orderNo: null, // 交易编号
          userId: null, // 用户id
          realName: null,
          mobile: null,
          pageNow: 1,
          pageSize: 10
        },
        OperationList: [], // 操作人
        timeRange: '', // 提交时间范围
        activeName: '0',
        menuId: 47,
        statisticalData: null,
        dialogTableVisible: false,
        // v_0.7.3 userId: '',
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
    mounted() {
      // 初始化减免列表
      this.getRemitList(this.postParam)
      // 操作人列表
      this.getOperationList()
      // 统计接口
      this.statistical(this.postParam)
    },
    computed: {
      ...mapState(['fixedField', 'reimbursementListData', 'entryDetail']),
      showExportBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.menuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    methods: {
      ...mapActions(['getRemitList', 'getEntryDetail', 'buttonLimit']),
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      }, // 子组件监听父组件的事件
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
      // 减免统计接口
      statistical(data) {
        axios.post('chargeRecord/remitAmountCount', data).then(res => {
          if (res.data.code === 200) {
            this.statisticalData = res.data.body
          }
        })
      },
      // 获取提交人列表
      getOperationList() {
        axios.post('pay/listAuditors').then(res => {
          if (res.data.code === 200) {
            res.data.body.unshift({
              id: null,
              name: '全部'
            })
            this.OperationList = res.data.body
          }
        })
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getRemitList(this.postParam)
        this.statistical(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getRemitList(this.postParam)
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
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'pageSize' && key !== 'pageNow' && key !== 'sort' && key !== 'sortField') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.timeRange = ''
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
        this.getRemitList(this.postParam)
        this.statistical(this.postParam)
      },
      remimbursement(row) {
        this.dialogTableVisible = true
        this.getEntryDetail({orderNo: row.orderNo})
      },
      // 到处excel文件的参数
      filterParam() {
        let newParams = {}
        Object.keys(this.postParam).forEach(key => {
          if ((this.postParam[key] || Object.is(key, 0)) && !Object.is(key, 'pageSize') && !Object.is(key, 'pageNow')) {
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
        window.open(`${host}/api/chargeRecord/remitListExcel?${par}`)
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

  .button_rel {
    position:absolute;
    bottom: 32px;
  }
</style>

