<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">常见问题</p>
    <el-card class="mb14 box-card">
      <div class="rel">
        <el-tabs v-model="switchTypeName" @tab-click="handleClickStatus" type="card">
          <el-tab-pane v-for="(item, index) in menuListSwitch" :key="index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
        <el-button type="success" class="cur abs"
                   style="right:80px; top:5px"
                   v-show="showSaveBtn && showSaveBtnSort && Number.parseInt(switchTypeName) !== -1"
                   @click="saveSort" size="small">保存排序
        </el-button>
        <el-button type="primary" class="cur abs"
                   style="right:0; top:5px"
                   v-show="showAddBtn && Number.parseInt(switchTypeName) !== -1"
                   @click="aduitAudit(1)" size="small">添加
        </el-button>
      </div>

      <div v-if="commonProblemList && Number.parseInt(switchTypeName) !== -1">
        <ul class="width_100 bd_e4 td_br h30" style="display: flex;margin-top:10px">
          <li style="flex: 1" class="bg_e4"> 排序</li>
          <li style="flex: 3" class="bg_e4"> 问题</li>
          <li style="flex: 1" class="bg_e4"> 访问量</li>
          <li style="flex: 1" class="bg_e4"> 有用</li>
          <li style="flex: 1" class="bg_e4"> 没用</li>
          <li style="flex: 3" class="bg_e4"> 操作</li>
        </ul>
        <ul class="color-list">
          <li class="color-item" style="display: flex"
              v-for="(item, index) in commonProblemList" :key="index"
              v-dragging="{item: item, list: commonProblemList, group: 'member'}"
          >
            <p class="h30" style="flex: 1;border:1px solid #EEF1F6;border-top:none;border-right:0">{{index + 1}}</p>
            <p class="h30" style="flex: 3;border:1px solid #EEF1F6;border-top:none;border-right:0">{{item.title}}</p>
            <p class="h30" style="flex: 1;border:1px solid #EEF1F6;border-top:none;border-right:0">
              {{item.viewCount}}</p>
            <p class="h30" style="flex: 1;border:1px solid #EEF1F6;border-top:none;border-right:0">
              {{item.usefulCount}}</p>
            <p class="h30" style="flex: 1;border:1px solid #EEF1F6;border-top:none;border-right:0">
              {{item.uselessCount}}</p>
            <p class="h30" style="flex: 3;border:1px solid #EEF1F6;border-top:none;border-right:0">
              <span @click="aduitLook(item)" class="cur ml14 blue">
              查看
              </span>
              <span @click="aduitAudit(2, item)" class="cur ml14 success" v-show="showAuditBtn">
              编辑
              </span>
              <span @click="aduitDelete(3, item)" class="cur ml14 error" v-show="showDeleteBtn">
              删除
              </span>
            </p>
          </li>
        </ul>
      </div>

      <div v-show="Number.parseInt(switchTypeName) === -1">
        <el-table v-if="handleLogData"
                  :data="handleLogData.records"
                  border style="width: 100%;">
          <el-table-column label="操作时间" prop="word">
            <template slot-scope="scope">
              {{scope.row.createTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="typeName"></el-table-column>
          <el-table-column label="操作对象" prop="title"></el-table-column>
          <el-table-column label="问题分类" prop="problemTypeName"></el-table-column>
          <el-table-column label="操作人" prop="operator"></el-table-column>
        </el-table>

        <div class="tr pt30" v-if="handleLogData">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="handleLogParam.pageNow"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="handleLogParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="handleLogData.totalrecord">
          </el-pagination>
        </div>
      </div>
    </el-card>

    <!--TODO：删除-->
    <el-dialog
      @close="deleteDialogVisible = false"
      title="确认删除？"
      :visible.sync="deleteDialogVisible"
      width="500px">
          <span slot="footer" class="dialog-footer">
             <el-button @click="deleteDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="sureDelete">确 定</el-button>
          </span>
    </el-dialog>

    <!--TODO：编辑-->
    <el-dialog :title="handleType === 2 ? '编辑问题' : '添加问题'" width="500px" @close="closeAddNewWordDialog"

               :visible.sync="AuditDialogFormVisible">

      <el-form :model="form" ref="ruleForm">
        <el-form-item label="问题类型：" :label-width="formLabelWidth">
          <el-select v-model="form.type" size="small"
                     class="mr14">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.questionType"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="问题名称：" :label-width="formLabelWidth">
          <el-input v-show='handleType === 2' v-model="form.title" placeholder="请输入问题名称"></el-input>
          <el-input v-show='handleType === 1' v-model="form.title" placeholder="请输入问题名称"></el-input>
        </el-form-item>

        <el-form-item label="问题回答：" :label-width="formLabelWidth">
          <el-input v-model="form.content" type="textarea" :rows="5"
                    placeholder="请输入300字以内的问题回答"></el-input>
        </el-form-item>

        <el-form-item class="tr">
          <el-button @click="cancelAudit('ruleForm')" size="small">取 消</el-button>
          <el-button type="primary" @click="sureAudit('ruleForm')" size="small">确 定</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>


    <!--todo: 查看-->
    <el-dialog
      @close="lookDialogVisible = false"
      :visible.sync="lookDialogVisible"
      width="500px">
      <h3 class="mb14"> Q: {{lookContent.title}}</h3>
      <el-input v-model="lookContent.content" :rows="6" type="textarea" disabled></el-input>
      <!--<span slot="footer" class="dialog-footer">-->
      <!--<el-button @click="lookDialogVisible = false">取 消</el-button>-->
      <!--<el-button type="primary" @click="sureDelete">确 定</el-button>-->
      <!--</span>-->
    </el-dialog>
  </el-card>
</template>

<script>
  import axios from 'axios'
  import {mapActions, mapState} from 'vuex'
  import {judgeLimit} from '../../../untils/common'

  export default {
    data: function () {
      return {
        // 1:账号问题；2:审批问题；3:还款放款；4:产品介绍）
        menuListSwitch: [
          {label: '账户问题', name: '1'},
          {label: '审批问题', name: '2'},
          {label: '放款还款', name: '3'},
          {label: '产品介绍', name: '4'},
          {label: '操作日志', name: '-1'}
        ],
        switchTypeName: '1',
        postParam: {
          type: 1
        },
        handleLogParam: {
          pageSize: 10,
          pageNow: 1
        },
        deleteParam: {
          id: null
        },
        deleteDialogVisible: false, // 删除对话框
        form: {
          type: null,
          title: null,
          content: null,
          id: null
        },
        AuditDialogFormVisible: false, // 编辑对话框
        handleType: 1, // 编辑 1， 添加 2
        lookDialogVisible: false, // 查看对话框
        lookContent: {
          id: null,
          title: null,
          content: null
        },
        // 排序字段的参数
        sortParam: {
          type: null,
          sortIdList: null
        },
        sortEndData: [],
        showSaveBtnSort: false, // 是否显示保存按钮
        sortEndIdList: [],
        formLabelWidth: '100px',
        addMenuId: 115, // 添加
        deleteMenuId: 116, // 删除
        auditMenuId: 117, // 编辑
        saveMenuId: 118, // 保存排序
        handleLogData: null // 获取操作日志列表
      }
    },
    components: {},
    computed: {
      ...mapState(['fixedField', 'commonProblemList']),
      showAddBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.addMenuId)
      },
      showDeleteBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.deleteMenuId)
      },
      showAuditBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.auditMenuId)
      },
      showSaveBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.saveMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      this.getCommonProblemList(this.postParam)
      // 开始拖拽事件
      this.$dragging.$on('dragged', ({value}) => {
        this.sortEndData = value.list
      })
      // 拖拽结束事件
      this.$dragging.$on('dragend', () => {
        this.showSaveBtnSort = true
        this.sortEndIdList = [] // 清空数据
        this.sortEndData.map(item => {
          this.sortEndIdList.push(item.id)
        })
        console.log(this.sortEndIdList)
      })
    },
    methods: {
      ...mapActions(['buttonLimit', 'getCommonProblemList']),
      // 获取操作日志列表
      getHandleLog() {
        axios.post('common/problemOperatorLog', this.handleLogParam).then(res => {
          if (res.data.code === 200) {
            this.handleLogData = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 切换tab
      handleClickStatus() {
        this.showSaveBtnSort = false
        // 解决表格不重新渲染的问题，每一次切换tab，将数据初始化为null,让整个页面的布局进行layout
        this.$store.commit('setCommonProblemList', null)
        if (Number.parseInt(this.switchTypeName) !== -1) {
          this.postParam.type = Number.parseInt(this.switchTypeName)
          this.getCommonProblemList(this.postParam)
        } else {
          this.getHandleLog()
        }
      },
      // 选择分页大小
      handleSizeChange(val) {
        this.handleLogParam.pageSize = val
        this.getHandleLog()
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.handleLogParam.pageNow = val
        this.getHandleLog()
      },
      // 保持排序
      saveSort() {
        this.sortParam.type = Number.parseInt(this.switchTypeName)
        this.sortParam.sortIdList = JSON.stringify(this.sortEndIdList)
        axios.post('common/sortCommonProblem', this.sortParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.sortParam.sortIdList = null
            this.sortEndData = []
            this.showSaveBtnSort = false // 排序成功后隐藏保存按钮
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 删除
      aduitDelete(type, row) {
        this.deleteDialogVisible = true
        this.deleteParam.id = row.id
      },
      // 确认删除
      sureDelete() {
        axios.post('common/deleteCommonProblem', this.deleteParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.getCommonProblemList(this.postParam)
          } else {
            this.$message.error(res.data.message)
          }
          this.deleteDialogVisible = false
          this.form.title = ''
          this.form.content = ''
        })
      },
      // 编辑 添加
      aduitAudit(type, row) {
        this.AuditDialogFormVisible = true
        this.handleType = type
        if (type === 2) {
          this.form.title = row.title
          this.form.id = row.id
          this.form.content = row.content
        } else {
          this.form.title = ''
          this.form.content = ''
        }
        this.form.type = Number.parseInt(this.switchTypeName)
      },
      closeAddNewWordDialog() {
      },
      // 结束编辑
      cancelAudit() {
        this.AuditDialogFormVisible = false
        this.form.content = ''
        if (this.handleType === 2) {
          this.form.title = ''
        }
      },
      // 编辑 添加
      sureAudit() {
        if (!this.form.title) {
          this.$message.error('问题名称不能为空')
          return
        }
        if (!this.form.content) {
          this.$message.error('问题回答不能为空')
          return
        }
        if (this.form.content.length > 300) {
          this.$message.error('内容长度超过300字')
          return
        }
        // 确认编辑
        if (this.handleType === 2) {
          axios.post('common/editCommonProblem', this.form).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.getCommonProblemList(this.postParam)
            } else {
              this.$message.error(res.data.message)
            }
            this.AuditDialogFormVisible = false
          })
        } else if (this.handleType === 1) {
          axios.post('common/addCommonProblem', this.form).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.getCommonProblemList(this.postParam)
            } else {
              this.$message.error(res.data.message)
            }
            this.AuditDialogFormVisible = false
          })
        }
      },
      // 点击查看
      aduitLook(row) {
        this.lookDialogVisible = true
        this.lookContent.id = row.id
        this.lookContent.title = row.title
        this.lookContent.content = row.content
      }
    }
  }
</script>

<style scoped lang="less">
  .width_100 {
    width: 100%;
  }

  .bg_e4 {
    background: #EEF1F6;
  }

  .td_br {
    border: 1px solid #EEF1F6;
  }

  .b_collapse {
    border-collapse: collapse;
  }

  .h30 {
    height: 40px;
    line-height: 40px;
  }

  .pl10 {
    padding-left: 10px;
  }

  .color-item:hover {
    background: rgba(239, 241, 246, 0.8);
  }
</style>
