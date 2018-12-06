<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 f18 fw">自动放款配置</p>
    <el-card class="rel mb14" style="background:#fff">
      <!--<el-tabs v-model="activeName">-->
      <!--<el-tab-pane v-for="item in menuList" :key="item.index"-->
      <!--:label="item.label" :name="item.name"></el-tab-pane>-->
      <!--</el-tabs>-->

      <p class="mb14"><span>自动放款开关：</span>
        <span v-html="parseInt(status) === 1? '已开启' : '已关闭'"
              :class="{success:parseInt(status) === 1, error:status === 0}"></span>
      </p>
      <p class="mb14" v-show="parseInt(status) === 1">开启时间：
        <span>
          {{startTime | lendTimeJoin}} 到 {{endTime | lendTimeJoin}}
        </span>
      </p>
      <p class="mb14" v-if="fixedField && ruleForm.rate && parseInt(status) === 1">提交频率：
        <span v-for="(item, index) in fixedField.submitTimes"
              v-show="item.key === parseInt(rate)" :key="item.key">
          {{item.value}}
        </span>
      </p>

      <el-button type="primary" size="small" class="cur abs" @click="editor"
                 style="right:20px;top:13px" v-show="audit">
        编辑
      </el-button>
    </el-card>

    <el-dialog title="编辑" :visible.sync="dialogVisible"
               @close="cancel('ruleForm',true)"
                width="600px">
      <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="150px">
        <el-form-item label="自动放款开关：">
          <el-switch @change="change"
                     v-model="switchValue"
                     active-color="#13ce66"
                     inactive-color="#999">
          </el-switch>
        </el-form-item>
        <el-form-item label="开启时间：" v-show="switchValue" class="item_input">
          <el-select v-model="ruleForm.startTime" placeholder="请选择"
                     v-if="fixedField" size="small">
            <el-option
              v-for="item in fixedField.lendingTime"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
          到
          <el-select v-model="ruleForm.endTime" placeholder="请选择" v-if="fixedField" size="small">
            <el-option
              v-for="item in fixedField.lendingTime"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="提交频率：" v-show="switchValue" placeholder="请选择">
          <el-select v-model="ruleForm.rate" size="small">
            <el-option
              v-for="item in fixedField.submitTimes"
              :key="item.key"
              :label="item.value"
              :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('ruleForm')" size="small">取 消</el-button>
        <el-button type="primary" @click="sure('ruleForm')" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import {judgeLimit} from '../../../untils/common'
  import axios from 'axios'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '自动放款配置', name: '1'}
//          {label: '放款中', name: '1'},
//          {label: '放款成功', name: '2'},
//          {label: '放款失败', name: '3'}
        ],
        ruleForm: {
          state: 0, // 状态（0：关闭，1: 开启）
          startTime: '', // 开启时间
          endTime: '', // 结束时间
          rate: '' // 频率
        },
        switchValue: false,
        startTime: null,
        endTime: null,
        rate: null,
        status: null, // 放宽开关的状态
        activeName: '1',
        dialogVisible: false,
        auditMenuId: 76
      }
    },
    computed: {
      ...mapState(['fixedField']),
      audit: function() {
        return judgeLimit(this.$store.state.setButtonLimitData, this.auditMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      this.getLendingStatus()
    },
    methods: {
      ...mapActions(['buttonLimit']),
      // 放宽开关的关闭打开
      change() {
        this.ruleForm.state = (this.switchValue ? 1 : 0)
        if (this.switchValue) {
          this.ruleForm.startTime = this.startTime
          this.ruleForm.endTime = this.endTime
        }
      },
      // 获取放宽状态
      getLendingStatus() {
        axios.post('release/getAutoExpendConfig').then(res => {
          if (res.data.code === 200) {
            if (parseInt(res.data.body.state) === 1) {
              this.switchValue = true
            } else {
              this.switchValue = false
            }
            this.ruleForm.state = this.status = res.data.body.state
            this.ruleForm.startTime = this.startTime = res.data.body.startTime
            this.ruleForm.endTime = this.endTime = res.data.body.endTime
            this.ruleForm.rate = this.rate = res.data.body.rate
          }
        })
      },
      editor() {
        this.dialogVisible = true
        this.getLendingStatus()
      },
      // 选择放款时间
      selectTime(val) {
      },
      // 取消
      cancel() {
        this.dialogVisible = false
        if (parseInt(this.ruleForm.state) === 0) {
          this.switchValue = false
        }
        if (parseInt(this.ruleForm.state) === 1) {
          this.switchValue = true
        }
      },
      // 确定
      sure() {
        if (this.ruleForm.startTime >= this.ruleForm.endTime) {
          this.$message.error('结束时间必须大于开始时间')
          return
        }
        axios.post('release/autoExpendSwitch', this.ruleForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.getLendingStatus()
            this.dialogVisible = false
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .item_input {
    .el-select {
      width: 100px;
    }
  }
</style>
