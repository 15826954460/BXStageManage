<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">授信管理</p>
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
        <el-col :span="6" class="el-col">
          <span class="label">渠道:</span>
          <el-select v-model="postParam.channel" placeholder="请选择"
                     size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.IntoChannelList"
                       :key="item.channelNum"
                       :label="item.channelName"
                       :value="item.channelNum">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="el-col">
          <span class="label">审批人:</span>
          <el-select v-model="postParam.audit" placeholder="请选择"
                     size="small">
            <el-option v-if='auditorListData'
                       v-for="item in auditorListData"
                       :key="item.id"
                       :label="item.name"
                       :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="label">授信编号:</span>
          <el-input size="small" v-model="postParam.orderId" placeholder="输入授信编号" class="input_with"></el-input>
        </el-col>

      </el-row>

      <el-row :gutter="20" class="mb14">
        <el-col :span="6">
          <span class="label">申请时间:</span>
          <el-date-picker
            v-model="applyTimeRange" @change="changeApplyTimeRange"
            type="datetimerange" size="small"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>

        <el-col :span="6">
          <span class="label">审批时间:</span>
          <el-date-picker
            v-model="aduitTimeRange" @change="changeAduitTimeRange"
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
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
          <el-tab-pane v-for="item in menuList" :key="item.index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
      </template>

      <el-table v-if="creditListData"
                :data="creditListData.records" border style="width: 100%">
        <el-table-column prop="userId" label="用户ID" >
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
        <el-table-column prop="orderId" label="授信编号" width="180px">
        </el-table-column>
        <el-table-column prop="channel" label="渠道" >
        </el-table-column>
        <el-table-column label="申请时间"  width="160px">
          <template slot-scope="scope">
            {{scope.row.createTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column label="审批时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.auditTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="auditor" label="审批人" >
        </el-table-column>
        <el-table-column prop="status" label="授信状态"  v-if="parseInt(activeName) === -1">
        </el-table-column>
        <el-table-column prop="creditAmount" label="额度评估" >
          <template slot-scope="scope">
            {{scope.row.creditAmount | toThousands}}
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="creditListData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="creditListData.totalrecord">
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
  import {filterTime, validateMobilePhone, judgeLimit, clearHistorySearch, isArray, setSearchValue} from '../../untils/common'
  import {mapState, mapActions} from 'vuex'
  import userDetailDialog from './userManage/userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '审批中', name: '1'},
          {label: '已退回', name: '2'},
          {label: '未通过', name: '4'},
          {label: '已通过', name: '3'},
          {label: '所有订单', name: '-1'}
        ],
        postParam: {
          userId: null, // 用户id
          realName: null, // 姓名
          mobile: null, // 手机号
          idCard: null, // 身份证
          channel: null,
          minCreateTime: null, // 最小申请时间
          maxCreateTIme: null, // 最大申请时间
          minAuditTime: null, // 最小审批时间
          maxAuditTime: null, // 最大审批时间
          orderId: null, // 授信编号
          status: 1,
          audit: null, // 审批人
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'id' // 排序字段名
        },
        applyTimeRange: '',
        aduitTimeRange: '',
        activeName: '1',
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
      ...mapState(['creditListData', 'fixedField', 'auditorListData']),
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
      this.getCreditList(this.postParam)
      this.getAuditorList()
    },
    methods: {
      ...mapActions(['getCreditList', 'buttonLimit', 'getAuditorList']),
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
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
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      // 切换tab
      handleClick(tab, event) {
        if (parseInt(this.activeName) === -1) {
          this.postParam.status = null
        } else {
          this.postParam.status = parseInt(this.activeName)
        }
        this.postParam.pageNow = 1
        this.getCreditList(this.postParam)
      },
      // 改变条目大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getCreditList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getCreditList(this.postParam)
      },
      // 选择申请时间范围
      changeApplyTimeRange(val) {
        if (this.applyTimeRange) {
          if (isArray(this.applyTimeRange)) {
            this.postParam.minCreateTime = filterTime(this.applyTimeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.applyTimeRange[1], 'dateTime')
          } else {
            this.applyTimeRange = [this.applyTimeRange, this.applyTimeRange]
            this.postParam.minCreateTime = filterTime(this.applyTimeRange[0], 'dateTime')
            this.postParam.maxCreateTime = filterTime(this.applyTimeRange[1], 'dateTime')
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
      // 选择审批时间范围
      changeAduitTimeRange(val) {
        if (this.aduitTimeRange) {
          if (isArray(this.aduitTimeRange)) {
            this.postParam.minAuditTime = filterTime(this.aduitTimeRange[0], 'dateTime')
            this.postParam.maxAuditTime = filterTime(this.aduitTimeRange[1], 'dateTime')
          } else {
            this.aduitTimeRange = [this.aduitTimeRange, this.aduitTimeRange]
            this.postParam.minAuditTime = filterTime(this.aduitTimeRange[0], 'dateTime')
            this.postParam.maxAuditTime = filterTime(this.aduitTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minAuditTime = this.postParam.maxAuditTime = null
        }
        // if (val) {
        //   this.postParam.minAuditTime = filterTime(val[0])
        //   this.postParam.maxAuditTime = filterTime(val[1])
        // } else {
        //   this.postParam.minAuditTime = this.postParam.maxAuditTime = null
        // }
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField' && key !== 'status') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.applyTimeRange = this.aduitTimeRange = ''
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
        this.getCreditList(this.postParam)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../style/filterStyle';
  .button_rel {
    position: absolute;
    bottom: 32px;
  }
</style>
