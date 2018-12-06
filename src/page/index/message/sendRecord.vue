<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">短信发送记录</p>
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
          <span class="f14 label">短信类型:</span>
          <el-select v-model="postParam.type" size="small">
            <el-option v-if='MessageType'
                       v-for="item in MessageType"
                       :key="item.type"
                       :label="item.name"
                       :value="item.type">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="label f14">发送时间:</span>
          <el-date-picker
            v-model="callTimeRange" @change="changeTimeRange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
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
      <div class="tr pr">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane v-for="item in menuList" :key="item.index"
                     :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>

      <el-table v-if="messageRecordList" :data="messageRecordList.records"
                border style="width: 100%">
        <el-table-column label="用户ID" prop="userId">
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.userId}}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="realName">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column prop="title" label="短信类型">
        </el-table-column>
        <el-table-column prop="content" label="短信内容" width="400px">
        </el-table-column>
        <el-table-column label="发送渠道" prop="channel">
        </el-table-column>
        <el-table-column label="发送时间" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="result" label="发送状态">
        </el-table-column>
        <el-table-column prop="operator" label="操作人">
        </el-table-column>
        <!--<el-table-column prop="code" label="接口返回">-->
        <!--</el-table-column>-->

      </el-table>

      <div class="tr pt30 rel" v-if="messageRecordList">
        <p class="total_num">
          共 {{messageRecordList.totalrecord}} 条
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="messageRecordList.totalrecord"
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
  import {mapState, mapActions} from 'vuex'
  import {validateMobilePhone, filterTime, judgeLimit, clearHistorySearch, isArray, setSearchValue} from '../../../untils/common'
  import userDetailDialog from '../userManage/userDetailDialog'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '发送成功', name: '1'},
          {label: '发送失败', name: '0'},
          {label: '所有', name: '-1'}
        ],
        postParam: {
          userId: null, // 用户id
          operatorId: null,
          mobile: null, // 手机号
          realName: null,
          minSendTime: null,
          maxSendTime: null,
          type: null,
          result: 1,
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'userId' // 排序字段名
        },
        // messageRecord: null,
        activeName: '1',
        MessageType: [],
        OperationList: [],
        callTimeRange: [],
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
      ...mapState(['fixedField', 'messageRecordList']),
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    mounted() {
      // 获取操作人列表
      this.getOperationList()
      // 获取短信模块
      this.getMessageModel(this.postParam)
      // 获取短信类型列表
      this.getMessageType()
    },
    methods: {
      ...mapActions(['getMessageModel']),
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
      // 短信记录
      // getMessageModel() {
      //   axios.post('sms/smsRecordPage', this.postParam).then(res => {
      //     if (res.data.code === 200) {
      //       this.messageRecord = res.data.body
      //     }
      //   })
      // },
      // 获取短信类型接口
      getMessageType() {
        axios.post('sms/smsTemplateId').then(res => {
          if (res.data.code === 200) {
            res.data.body.unshift({
              type: null,
              name: '全部'
            })
            this.MessageType = res.data.body
          }
        })
      },
      // 获取操作人列表
      getOperationList() {
        axios.post('cs/listAuditors').then(res => {
          if (res.data.code === 200) {
            res.data.body.unshift({
              id: null,
              name: '全部'
            })
            this.OperationList = res.data.body
          }
        })
      },
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.result = parseInt(this.activeName)
        } else {
          this.postParam.result = null
        }
        this.getMessageModel(this.postParam)
        this.postParam.pageNow = 1
      },
      onkeyup(event) {
        this.postParam.userId = this.postParam.userId.replace(/\D/g, '')
      },
      // 选择放宽时间范围
      changeTimeRange(val) {
        if (this.callTimeRange) {
          if (isArray(this.callTimeRange)) {
            this.postParam.minSendTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.maxSendTime = filterTime(this.callTimeRange[1], 'dateTime')
          } else {
            this.callTimeRange = [this.callTimeRange, this.callTimeRange]
            this.postParam.minSendTime = filterTime(this.callTimeRange[0], 'dateTime')
            this.postParam.maxSendTime = filterTime(this.callTimeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minSendTime = this.postParam.maxSendTime = null
        }
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getMessageModel(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getMessageModel(this.postParam)
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
        this.getMessageModel(this.postParam)
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField' &&
            key !== 'result') {
            param[key] = null
          }
        }
        this.searchConditionsContent = ''
        this.callTimeRange = ''
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

  /*.button_rel {*/
  /*bottom: 32px;*/
  /*}*/
</style>
