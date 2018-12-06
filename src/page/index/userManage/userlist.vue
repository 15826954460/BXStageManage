<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">用户列表</p>

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
          <span class="label f14">注册时间:</span>
          <el-date-picker
            v-model="timeRange" @change="changeTimeRange(1)"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
          </el-date-picker>
        </el-col>

        <el-col :span="6">
          <span class="label f14">首次登录时间:</span>
          <el-date-picker
            v-model="firstLogin" @change="changeTimeRange(2)"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            type="datetimerange" size="small">
          </el-date-picker>
        </el-col>

        <el-col :span="6">
          <span class="label">身份证号:</span>
          <el-input size="small" v-model="postParam.idCard"
                    placeholder="输入身份证号" class="input_with"></el-input>
        </el-col>
      </el-row>

      <div class="tr pr">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>

    <el-card>
      <el-table v-if="userListData" :data="userListData.records"
                border style="width: 100%">
        <el-table-column label="用户ID">
          <template slot-scope="scope">
            <span @click="goToUserDetail(scope.row)" class="blue cur">
              {{scope.row.id}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号">
        </el-table-column>
        <el-table-column label="注册时间" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="首次登录时间" width="180px">
          <template slot-scope="scope">
            <span>{{scope.row.firstLoginTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="180px">
        </el-table-column>
        <el-table-column prop="state" label="账户状态">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="addToBlack(scope.row)" type="text"
                       v-show="showAddBlack">加入黑名单
            </el-button>
            <el-button @click="sendMessage(scope.row)" type="text"
                       v-show="showSendMessage">发短信
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="userListData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="userListData.totalrecord">
        </el-pagination>
      </div>
    </el-card>

    <el-dialog title="加入黑名单" :visible.sync="dialogVisible"
               @close="cancel('ruleForm',true)"
               width="600px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="姓名:">
          <span>{{ruleForm.realName}}</span>
        </el-form-item>
        <el-form-item label="身份证号:">
          <span>{{ruleForm.idCard}}</span>
        </el-form-item>
        <el-form-item label="加入原因:" prop="remark">
          <el-input v-model="ruleForm.remark" auto-complete="off" type="textarea" width="100%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="sure('ruleForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="sendMessageDialogVisible" width="600px"
               @close="cancelSendMessage">
      <el-form :model="sendMessageParams" label-width="100px" class="pt10"
               :rules="sendRules" ref="sendMessageParams">
        <el-form-item label="短信内容:" prop="content">
          <el-input type="textarea" v-model="sendMessageParams.content"></el-input>
        </el-form-item>
        <el-form-item class="tr">
          <el-button @click="cancelSendMessage" size="small">取消</el-button>
          <el-button @click="onSubmit" size="small" type="primary">发送</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
  import userDetailDialog from './userDetailDialog'

  export default {
    data: function () {
      const text = (rule, value, callback) => {
        if (!value) {
          callback(new Error('原因不能为空'))
        } else {
          callback()
        }
      }
      return {
        userId: '',
        activeName: 'first',
        ruleForm: {
          realName: '', // 用户名
          idCard: '', // 身份证号
          mobile: '', // 手机号
          remark: '' // 原因
        },
        rules: {
          remark: [
            {required: true, validator: text, trigger: 'blur'}
          ]
        },
        postParam: {
          id: null, // 用户id
          realName: null, // 姓名
          mobile: null, // 手机号
          idCard: null, // 身份证
          minFirstLoginTime: null, // 首次登录App最小时间
          maxFirstLoginTime: null, // 首次登录App最大时间
          minCreateTime: null, // 开始注册时间
          maxCreateTIme: null, // 结束注册时间
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'id' // 排序字段名
        },
        sendMessageDialogVisible: false,
        timeRange: '', // 提交时间范围
        firstLogin: '', // 首次登录时间
        dialogVisible: false,
        sendRules: {
          content: [
            {required: true, message: '短信内容不能为空', trigger: 'blur'},
            {min: 1, max: 300, message: '长度不能超过300个字符', trigger: 'blur'}
          ]
        },
        sendMessageParams: {
          userId: null,
          content: ''
        },
        isShowDetail: false,
        userDetailMenuId: 58, // 用户详情
        sendMessageMenuId: 75, // 发送短信
        addBackMenuId: 39,  // 添加黑名单权限
        // v_0.7.3
        searchConditionsContent: '', // 搜索内容
        searchConditions: 1, // 下拉框的选择
        placeHolder: '请输入姓名' // 提示信息
      }
    },
    created() {
      this.buttonLimit()
    },
    components: {
      userDetailDialog
    },
    computed: {
      ...mapState(['userListData', 'setButtonLimitData', 'fixedField']),
      showAddBlack: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.addBackMenuId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      },
      showSendMessage: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.sendMessageMenuId)
      }
    },
    mounted() {
      this.getUserList(this.postParam)
    },
    methods: {
      ...mapActions(['getUserList', 'buttonLimit']),
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'id')
        this.searchConditionsContent = ''
        // 清空非当前选项的内容
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
      },
      sendMessage(row) {
        this.sendMessageDialogVisible = true
        this.sendMessageParams.userId = row.id
      },
      // 取消发动短信
      cancelSendMessage() {
        this.sendMessageDialogVisible = false
        this.sendMessageParams.content = ''
        this.$refs['sendMessageParams'].resetFields()
      },
      // 发送短信
      onSubmit() {
        this.$refs['sendMessageParams'].validate((valid) => {
          if (valid) {
            axios.post('user/sendMessage', this.sendMessageParams).then(res => {
              if (res.data.code === 200) {
                this.$message.success(res.data.message)
                this.sendMessageDialogVisible = false
                this.$refs['sendMessageParams'].resetFields()
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      },
      onkeyup(event) {
        this.postParam.id = this.postParam.id.replace(/\D/g, '')
      },
      // 打开用户详情
      goToUserDetail(row) {
        if (this.showDetail) {
          this.isShowDetail = true
          this.userId = row.id
          this.$store.commit('setUserDetailDialogTableVisible', true)
        } else {
          this.$message.error('您没有权限进行该操作')
        }
      },
      hideUserDetail() {
        this.isShowDetail = false
      },
      // 加入黑名单
      addToBlack(row) {
        this.ruleForm = {
          realName: row.realName,
          idCard: row.idCard,
          mobile: row.mobile,
          remark: ''
        }
        this.dialogVisible = true
      },
      // 改变条目大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getUserList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getUserList(this.postParam)
      },
      // 选择放宽时间范围
      changeTimeRange(val) {
        if (Number.parseInt(val) === 1) {
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
        } else {
          if (this.firstLogin) {
            if (isArray(this.firstLogin)) {
              this.postParam.minFirstLoginTime = filterTime(this.firstLogin[0], 'dateTime')
              this.postParam.maxFirstLoginTime = filterTime(this.firstLogin[1], 'dateTime')
            } else {
              this.firstLogin = [this.firstLogin, this.firstLogin]
              this.postParam.minFirstLoginTime = filterTime(this.firstLogin[0], 'dateTime')
              this.postParam.maxFirstLoginTime = filterTime(this.firstLogin[1], 'dateTime')
            }
          } else {
            this.postParam.minFirstLoginTime = this.postParam.maxFirstLoginTime = null
          }
        }
      },
      // 取消
      cancel(formName, val) {
        this.dialogVisible = false
        this.ruleForm.remark = ''
        this.$refs[formName].resetFields()
      },
      // 确定
      sure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加黑名单
            axios.post('blackList/add', this.ruleForm).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(res.data.message)
                this.dialogVisible = false
                this.$refs[formName].resetFields()
                this.getUserList(this.postParam)
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField') {
            param[key] = null
          }
        }
        this.searchConditionsContent = this.timeRange = this.firstLogin = ''
        // 暂时保留，只清空内容不清空选择条件
        // this.searchConditions = 1
      },
      // 查询
      search() {
        let param = this.postParam
        if (!this.searchConditionsContent) {
          param.mobile = null
        }
        let paramArr = [this.searchConditions, this.postParam, this.searchConditionsContent, 'id']
        setSearchValue(...paramArr)
        // 验证手机号格式
        if (param.mobile) {
          if (!validateMobilePhone(param.mobile)) {
            this.$message.error('手机号码格式错误')
            return
          }
        }
        this.getUserList(this.postParam)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .el-col {
    display: flex;
    .label {
      display: inline-block;
      width: 100px;
      flex-shrink: 0;
      text-align: right;
      padding-right: 10px;
      line-height: 30px;
    }
    .el-input,
    .el-select,
    .el-cascader,
    .el-input__inner {
      flex: 1;
    }
  }

  .el-table .table-head-th {
    background-color: #ff0000;
    font-size: large;
  }
  .button_rel {
    bottom: 32px;
  }
</style>
<style lang="less">
  .el-select .mr14 .el-select--small{
    width: 60px
  }
</style>
