<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">昵称敏感词</p>
    <el-card class="mb14 box-card">
      <div class="rel">
        <el-tabs v-model="activeTypeName" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in menuListType" :key="index"
                       :label="item.label" :name="item.name"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" class="cur abs"
                   style="right:0; top:5px"
                   v-show="showAddBtn"
                   @click="addNewWordDialogFormVisible = true" size="small">添加新词
        </el-button>
      </div>
      <div v-show="Number.parseInt(activeTypeName) === 1">
        <el-table v-if="wordListData"
                  :data="wordListData.records"
                  border style="width: 100%;">
          <el-table-column label="词汇名称" prop="word">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                v-show="showDeleteBtn"
                @click="aduitWordType(scope.row)"
                type="text" class="cur ml14">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="tr pt30" v-if="wordListData">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="postParam.pageNow"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="postParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="wordListData.totalrecord">
          </el-pagination>
        </div>
      </div>

      <div v-show="Number.parseInt(this.activeTypeName) === -1">
        <el-table v-if="OperationLogData"
                  :data="OperationLogData.records"
                  border style="width: 100%;">
          <el-table-column label="操作时间">
            <template slot-scope="scope">
              {{scope.row.createTime | dateTime}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <span>{{Number.parseInt(scope.row.type) === 1 ? '添加' : '删除'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作对象" prop="word"></el-table-column>
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

      <el-dialog title="添加新词" width="500px" @close="form.word = ''"
                 :visible.sync="addNewWordDialogFormVisible">

        <el-form :model="form" ref="ruleForm">
          <el-form-item label="词汇名称：" label-width="120px">
            <el-input v-model="form.word" auto-complete="off"
                      placeholder="请输入汉字、字母、数字"></el-input>
          </el-form-item>

          <el-form-item class="tr">
            <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
            <el-button type="primary" @click="addNewWord('ruleForm')" size="small">确 定</el-button>
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
        menuListType: [
          {label: '词库', name: '1'},
          {label: '操作日志', name: '-1'}
        ],
        postParam: {
          sort: 'desc',
          sortField: 'updateTime',
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
        operationLogParam: {
          sort: 'desc',
          sortField: 'createTime',
          pageNow: 1,
          pageSize: 10
        },
        addMenuId: 111, // 添加新词
        deleteMenuId: 112, // 删除
        deleteWordParam: {
          id: null
        },
        form: {
          word: ''
        },
        deleteDialogVisible: false,
        addNewWordDialogFormVisible: false,
        activeTypeName: '1',
        wordListData: null, // 敏感词库
        OperationLogData: null // 操作日志
      }
    },
    computed: {
      showAddBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.addMenuId)
      },
      showDeleteBtn: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.deleteMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 获取词库列表
      this.getWordList()
      // 获取操作日志
      this.getOperationLog()
    },
    methods: {
      ...mapActions(['buttonLimit']),
      // 获取词库列表数据
      getWordList() {
        axios.post('word/list', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.wordListData = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      getOperationLog() {
        axios.post('word/operateRecord', this.operationLogParam).then(res => {
          if (res.data.code === 200) {
            this.OperationLogData = res.data.body
            console.log(res.data.body)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      handleSizeChange(val) {
        if (Number.parseInt(this.activeTypeName) === -1) {
          this.operationLogParam.pageSize = val
          this.getOperationLog(this.operationLogParam)
        } else {
          this.postParam.pageSize = val
          this.getWordList(this.postParam)
        }
      },
      handleCurrentChange(val) {
        if (Number.parseInt(this.activeTypeName) === -1) {
          this.operationLogParam.pageNow = val
          this.getOperationLog(this.operationLogParam)
        } else {
          this.postParam.pageNow = val
          this.getWordList(this.postParam)
        }
      },
      // 删除敏感词
      aduitWordType(row) {
        this.deleteDialogVisible = true
        this.deleteWordParam.id = row.id
      },
      cancel() {
        this.addNewWordDialogFormVisible = false
        this.form.word = ''
      },
      handleClick() {
        if (Number.parseInt(this.activeTypeName) === 1) {
          this.getWordList()
        } else {
          this.getOperationLog()
        }
      },
      // 确定删除词库
      sureDelete() {
        axios.post('word/delete', this.deleteWordParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.getWordList(this.postParam)
          } else {
            this.$message.error(res.data.message)
          }
          this.deleteDialogVisible = false
        })
      },
      // 添加新词
      addNewWord() {
        if (!this.form.word) {
          this.$message.error('词汇名称不能为空')
          return
        }
        axios.post('word/add', this.form).then(res => {
          if (res.data.code === 200) {
            this.addNewWordDialogFormVisible = false
            this.$message.success(res.data.message)
            this.getWordList(this.postParam)
          } else {
            this.form.word = ''
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">

</style>
