<template>
  <el-card style="width:100%;" class="big_background">
    <el-card class="mb14 box-card">
      <el-tabs v-model="activeTypeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in menuListType" :key="index"
                     :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <div class="rel" v-show="Number.parseInt(activeTypeName) !== -1">
        <el-tabs v-model="switchTypeName" @tab-click="handleClickStatus" type="card">
          <el-tab-pane v-for="(item, index) in menuListSwitch" :key="index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" class="cur abs"
                   style="right:0; top:5px"
                   v-show="showAddNewWord"
                   @click="addNewWordBtn" size="small">添加新词
        </el-button>
      </div>


      <div v-show="Number.parseInt(activeTypeName) !== -1">
        <el-table v-if="wordListData"
                  :data="wordListData.records"
                  border style="width: 100%;">
          <el-table-column label="词汇名称" prop="word">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-switch
                v-show="showSwitch"
                @change="changeSwitch(scope.row)"
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
              <el-button @click="aduitWordType(scope.row)" type="text" class="cur ml14"
                         v-show="parseInt(scope.row.status) === 0 && showChangeType && showSwitch">修改分类
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="tr pt30" v-if="wordListData">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="postParam.PageNow"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="postParam.PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="wordListData.totalrecord">
          </el-pagination>
        </div>
      </div>

      <div v-show="Number.parseInt(activeTypeName) === -1">
        <el-table v-if="OperationLogData"
                  :data="OperationLogData.records"
                  border style="width: 100%;">
          <el-table-column label="操作时间" prop="word">
            <template slot-scope="scope">
              {{scope.row.createTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="typeText"></el-table-column>
          <el-table-column label="操作对象" prop="word"></el-table-column>
          <el-table-column label="词汇分类" prop="wordTypeText"></el-table-column>
          <el-table-column label="操作人" prop="operator"></el-table-column>
        </el-table>

        <div class="tr pt30" v-if="OperationLogData">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="operationLogParam.pageNow"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="operationLogParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="OperationLogData.totalrecord">
          </el-pagination>
        </div>
      </div>

      <el-dialog title="添加新词" width="500px" @close="closeAddNewWordDialog"

                 :visible.sync="addNewWordDialogFormVisible">

        <el-form :model="form" ref="ruleForm">
          <el-form-item label="词汇分类：" :label-width="formLabelWidth">
            <span v-for="(item, index) in menuListType" :key="index"
                  v-show="item.name === activeTypeName">{{item.label}}</span>
          </el-form-item>

          <el-form-item label="词汇名称：" :label-width="formLabelWidth">
            <el-input v-model="form.word" auto-complete="off"
                      placeHolder="请输入汉字或大写字母"></el-input>
          </el-form-item>

          <el-form-item class="tr">
            <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
            <el-button type="primary" @click="addNewWord('ruleForm')" size="small">确 定</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

      <el-dialog title="修改词汇" width="500px" @close="closeUpdateWordDialog"

                 :visible.sync="updateWordDialogFormVisible">

        <el-form :model="updateWordParam" ref="Form">

          <el-form-item label="修改分类：" :label-width="formLabelWidth">
            <el-select v-model="updateWordParam.type" size="mini">
              <el-option
                v-for="(item, index) in menuListType"
                v-show="Number.parseInt(item.name) !== -1"
                :key="index"
                :label="item.label"
                :value="Number.parseInt(item.name)">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="tr">
            <el-button @click="cancelUpdateWord('Form')" size="small">取 消</el-button>
            <el-button type="primary" @click="sureUpdate('Form')" size="small">确 定</el-button>
          </el-form-item>
        </el-form>

      </el-dialog>

    </el-card>

  </el-card>
</template>

<script>
  import axios from 'axios'
  import {mapActions} from 'vuex'
  import {judgeLimit} from '../../../untils/common'

  export default {
    data: function () {
      return {
        // 敏感词列表参数
        postParam: {
          type: 1, // 1:高危敏感词，2:中性敏感词，3:家庭词汇，4:亲情词汇
          status: 1, // 1为上线，0位下线
          PageNow: 1,
          PageSize: 10,
          sort: 'desc',
          sortField: null
        },
        // 修改接口参数
        updateConfigParam: {
          id: null,
          status: null
        },
        // 操作人参数
        operationLogParam: {
          pageNow: 1,
          pageSize: 10,
          sort: 'desc',
          sortField: 'createTime'
        },
        // 修改词汇参数
        updateWordParam: {
          id: null,
          type: null
        },
        // 添加词汇参数
        form: {
          type: null,
          word: null
        },
        menuListType: [
          {label: '高危敏感词', name: '1'},
          {label: '中性敏感词', name: '2'},
          {label: '家庭词库', name: '3'},
          {label: '亲戚词库', name: '4'},
          {label: '操作日志', name: '-1'}
        ],
        activeTypeName: '1',
        menuListSwitch: [
          {label: '开启', name: '1'},
          {label: '关闭', name: '0'},
          {label: '所有', name: '-1'}
        ],
        switchTypeName: '1',
        timerOne: null,
        timerTwo: null,
        wordListData: [],
        OperationLogData: [],
        formLabelWidth: '100px',
        addNewWordDialogFormVisible: false,
        updateWordDialogFormVisible: false,
        addNewWordMenuId: 88, // 添加新词
        switchMenuId: 89, // 开关
        changeTypeMenuId: 90 // 修改分类
      }
    },
    created() {
      this.buttonLimit()
    },
    computed: {
      showAddNewWord: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.addNewWordMenuId)
      },
      showSwitch: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.switchMenuId)
      },
      showChangeType: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.changeTypeMenuId)
      }
    },
    mounted() {
      this.getWordList()
    },
    methods: {
      ...mapActions(['buttonLimit']),
      async getWordList() {
        axios.post('word/listPageWord', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.wordListData = res.data.body
          } else {
            throw new Error('接口返回数据有异常')
          }
        })
      },
      // 请求词库操作开关接口
      async updateConfig() {
        axios.post('word/updateStatusById', this.updateConfigParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.timerOne = setTimeout(() => {
              this.getWordList()
            }, 1000)
            this.timerTwo = setTimeout(() => {
              this.timerOne = null
            }, 1500)
            return true
          } else {
            this.$message.error(res.data.message)
            return false
          }
        })
      },
      // 修改操作接口
      async changeSwitch(row) {
        this.updateConfigParam = {
          id: row.id,
          status: row.status
        }
        await this.updateConfig()
      },
      // 切换词库类型
      handleClick(tab, event) {
        if (parseInt(this.activeTypeName) !== -1) {
          this.postParam.type = this.form.type = Number.parseInt(this.activeTypeName)
          this.postParam.PageNow = 1
          this.getWordList(this.postParam)
        } else {
          this.operationLogParam.pageNow = 1
          this.getOperationLog(this.operationLogParam)
        }
      },
      // 获取操作日志接口
      async getOperationLog(data) {
        axios.post('word/listPageWordOperateRecord', data).then(res => {
          if (res.data.code === 200) {
            this.OperationLogData = res.data.body
          } else {
            throw new Error('接口返回数据失败')
          }
        })
      },
      //  切换状态开关
      handleClickStatus() {
        if (parseInt(this.switchTypeName) !== -1) {
          this.postParam.status = parseInt(this.switchTypeName)
        } else {
          this.postParam.status = null
        }
        this.operationLogParam.pageNow = 1
        this.getWordList(this.operationLogParam)
      },
      // 选择分页大小
      handleSizeChange(val) {
        if (Number.parseInt(this.activeTypeName) === -1) {
          this.operationLogParam.pageSize = val
          this.getOperationLog(this.operationLogParam)
        } else {
          this.postParam.PageSize = val
          this.getWordList(this.postParam)
        }
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        if (Number.parseInt(this.activeTypeName) === -1) {
          this.operationLogParam.pageNow = val
          this.getOperationLog(this.operationLogParam)
        } else {
          this.postParam.PageNow = val
          this.getWordList(this.postParam)
        }
      },
      async addNewWord() {
        axios.post('word/saveWordHit', this.form).then(res => {
          if (res.data.code === 200) {
            this.addNewWordDialogFormVisible = false
            this.$message.success(res.data.message)
            this.getWordList(this.postParam)
          } else {
            this.form.word = ''
            this.$message.error(res.data.message)
          }
        })
      },
      async upDataWordType(Form) {
        axios.post('word/updateWordTypeById', this.updateWordParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.$refs[Form].resetFields()
            this.getWordList(this.postParam)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 类型匹配
      async matchingWord() {
        this.menuListType.forEach((item) => {
          if (Number.parseInt(item.name) === Number.parseInt(this.activeTypeName)) {
            this.updateWordParam.type = Number.parseInt(item.name)
          }
        })
      },
      async aduitWordType(row) {
        this.updateWordParam.id = row.id
        await this.matchingWord()
        this.type = Number.parseInt(this.activeTypeName)
        this.updateWordDialogFormVisible = true
      },
      cancel(ruleForm) {
        this.addNewWordDialogFormVisible = false
        this.$refs[ruleForm].resetFields()
      },
      closeAddNewWordDialog() {
        this.form.word = ''
      },
      cancelUpdateWord() {
        this.updateWordDialogFormVisible = false
      },
      sureUpdate(Form) {
        this.updateWordDialogFormVisible = false
        this.upDataWordType(Form)
      },
      closeUpdateWordDialog() {
        this.updateWordDialogFormVisible = false
        this.updateWordParam.type = Number.parseInt(this.activeTypeName)
      },
      // 添加新词汇
      addNewWordBtn() {
        this.addNewWordDialogFormVisible = true
        this.form.type = Number.parseInt(this.activeTypeName)
      }
    }
  }
</script>

<style scoped lang="less">

</style>
