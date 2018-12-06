<template>
  <el-card class="big_background" style="width:100%">
    <p class="mb14 f18 fw">黑名单</p>
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
          <span class="label">身份证号:</span>
          <el-input size="small" v-model="postParam.idCard"
                    placeholder="输入身份证号" class="input_with"></el-input>
        </el-col>
        <el-col :span="6" v-if="fixedField">
          <span class="label">来源:</span>
          <el-select v-model="postParam.source" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.resource"
                       :key="item.key"
                       :label="item.value"
                       :value="item.key">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="label">操作人:</span>
          <el-select v-model="postParam.operator" size="small">
            <el-option v-if='OperationList'
                       v-for="item in OperationList"
                       :key="item.userId"
                       :label="item.realName"
                       :value="item.userId">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" class="mb14">
        <el-col :span="6">
          <span class="label">操作时间:</span>
          <el-date-picker
            v-model="timeRange" @change="changeTimeRange"
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
      <div class="rel tr mb8">
        <el-button type="primary" size="small" class="cur"
                   v-show="newBuild"
                   @click="newAddBlack"
                   style="top: 0;right: 0">新建
        </el-button>
      </div>

      <el-table v-if="blackListData" :data="blackListData.records" border style="width: 100%">
        <el-table-column prop="id" label="黑名单ID" >
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" >
          <template slot-scope="scope">
            <span class="cur blue" @click="goToUserDetail(scope.row)">{{scope.row.userId}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="姓名" >
        </el-table-column>
        <el-table-column prop="mobile" label="手机号"  width="150px">
        </el-table-column>
        <el-table-column prop="idCard" label="身份证号" width="180px" >
        </el-table-column>
        <el-table-column prop="source" label="来源" >
        </el-table-column>
        <el-table-column prop="operator" label="操作人" >
        </el-table-column>
        <el-table-column label="操作时间" width="180px" >
          <template slot-scope="scope">
            {{scope.row.updateTime | dateTime}}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="加入原因" widht="200px">
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
              class="cur break">{{scope.row.remark | minStr12}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="blackListData">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="blackListData.totalrecord">
        </el-pagination>
      </div>
    </el-card>

    <!--todo: 添加黑名单-->
    <el-dialog title="新建" :visible.sync="dialogVisible"
               @close="cancel('ruleForm')"
              width="600px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="姓名：">
          <el-input v-model="ruleForm.realName" auto-complete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="身份证号：">
          <el-input v-model="ruleForm.idCard" auto-complete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="ruleForm.mobile" auto-complete="off" type="text"></el-input>
        </el-form-item>
        <el-form-item label="加入原因：" prop="remark">
          <el-input v-model="ruleForm.remark" auto-complete="off" type="textarea"
                    placeholder="输入原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
        <el-button type="primary" @click="sure('ruleForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
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
  import userDetailDialog from '../../index/userManage/userDetailDialog'

  export default {
    data: function () {
      const validateRemark = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('原因不能为空'))
        } else {
          callback()
        }
      }
      const validateRealName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('姓名必填'))
        } else {
          callback()
        }
      }
      return {
        menuList: [
          {label: '黑名单', name: '0'}
        ],
        OperationList: [],
        dialogVisible: false,
        timeRange: '', // 提交时间范围
        postParam: {
          userId: null,
          realName: null, // 姓名
          mobile: null, // 手机号
          idCard: null, // 身份证
          minUpdateTime: null, // 开始注册时间
          maxUpdateTime: null, // 结束注册时间
          source: null, // 来源
          operator: null, // 操作人
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'id' // 排序字段名
        },
        ruleForm: {
          realName: '', // 用户名
          idCard: '', // 身份证号
          mobile: '', // 手机号
          remark: '' // 原因
        },
        activeName: 'first',
        rules: {
          remark: [
            {required: true, trigger: 'blur', validator: validateRemark}
          ],
          realName: [
            {required: true, trigger: 'blur', validator: validateRealName}
          ]
        },
        newBuildId: 64,
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
      ...mapState(['blackListData', 'fixedField']),
      newBuild: function() {
        return judgeLimit(this.$store.state.setButtonLimitData, this.newBuildId)
      },
      showDetail: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.userDetailMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      this.getBlackList(this.postParam)
      this.getOperationList()
    },
    methods: {
      ...mapActions(['getBlackList', 'buttonLimit']),
      selectConditions() {
        clearHistorySearch(this.searchConditions, this.postParam, 'userId')
        this.searchConditionsContent = ''
        this.placeHolder = this.searchConditions === 1 ? '请输入姓名' : this.searchConditions === 2 ? '请输入手机号' : '请输入用户ID'
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
      // 获取操作人列表
      getOperationList() {
        axios.post('security/listUsers').then(res => {
          if (res.data.code === 200) {
            res.data.body.unshift({
              userId: null,
              realName: '全部'
            })
            this.OperationList = res.data.body
          }
        })
      },
      // 改变条目大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getBlackList(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getBlackList(this.postParam)
      },
      // 选择放宽时间范围
      changeTimeRange(val) {
        if (this.timeRange) {
          if (isArray(this.timeRange)) {
            this.postParam.minUpdateTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.maxUpdateTime = filterTime(this.timeRange[1], 'dateTime')
          } else {
            this.timeRange = [this.timeRange, this.timeRange]
            this.postParam.minUpdateTime = filterTime(this.timeRange[0], 'dateTime')
            this.postParam.maxUpdateTime = filterTime(this.timeRange[1], 'dateTime')
          }
        } else {
          this.postParam.minUpdateTime = this.postParam.maxUpdateTime = null
        }
        // if (val) {
        //   this.postParam.minUpdateTime = filterTime(val[0])
        //   this.postParam.maxUpdateTime = filterTime(val[1])
        // } else {
        //   this.postParam.minUpdateTime = this.postParam.maxUpdateTime = null
        // }
      },
      // 清空
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'sort' && key !== 'pageSize' && key !== 'pageNow' && key !== 'sortField') {
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
            this.$message.error('手机号码格式错误，请重新输入')
            return
          }
        }
        this.getBlackList(this.postParam)
      },
      // 新建黑名单
      newAddBlack() {
        this.dialogVisible = true
      },
      // 清除表单内容
      clearFormContent(val) {
        for (let key in val) {
          val[key] = ''
        }
      },
      // 取消
      cancel(formName, val) {
        this.dialogVisible = false
        this.clearFormContent(this.ruleForm)
        this.$refs[formName].resetFields()
      },
      // 确定
      sure(formName) {
        if (!this.ruleForm.mobile && !this.ruleForm.idCard) {
          this.$message.error('身份证号或手机号至少填写一项')
          return
        }
        if (this.ruleForm.mobile) {
          if (!validateMobilePhone(this.ruleForm.mobile)) {
            this.$message.error('手机号格式错误')
            return
          }
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            // 添加黑名单
            axios.post('blackList/add', this.ruleForm).then((res) => {
              if (res.data.code === 200) {
                this.$message.success(res.data.message)
                this.dialogVisible = false
                this.clearFormContent(this.ruleForm)
                this.$refs[formName].resetFields()
                this.getBlackList(this.postParam)
              } else {
                this.$message.error(res.data.message)
              }
            })
          } else {
          }
        })
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
