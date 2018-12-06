<template>
  <div class="box-card">
    <el-table v-if="remarkRecordsData" style="width: 100%" class="mb14 mt20" size="small"
              :data="remarkRecordsData" border>
      <el-table-column prop="createTime" label="时间">
        <template slot-scope="scope">
          {{scope.row.createTime | dateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="审批人">
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <el-popover
            v-show="scope.row.remark.length > 12"
            placement="right" title=""
            width="300"
            popper-class="break"
            trigger="hover"
            :content="scope.row.remark">
            <span slot="reference" class="cur">{{scope.row.remark | minStr12}}</span>
          </el-popover>
          <span v-if="scope.row.remark"
                v-show="scope.row.remark.length<=12"
                class="cur">{{scope.row.remark | minStr12}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
             class="demo-ruleForm" v-show="showAddRemark">
      <el-form-item label="添加备注：" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item class="tr">
        <el-button  @click="cancel('ruleForm')"
                   size="small">取消
        </el-button>
        <el-button @click="sure" size="small" type="primary">确认</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'

  export default {
    props: ['orderId', 'showAddRemark', 'clearRemarkInfo', 'RemarkRecordMenuId'],
    data: function () {
      return {
        ruleForm: {
          orderId: null,
          remark: ''
        },
        rules: {
          remark: [
            {message: '请填写备注信息', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.ruleForm.orderId = !this.showAddRemark ? this.$route.query.orderId : this.orderId
      this.getRemarkRecordsList({orderId: this.ruleForm.orderId})
    },
    computed: {
      ...mapState(['remarkRecordsData', 'circulation'])
    },
    methods: {
      ...mapActions(['getRemarkRecordsList']),
      // 取消
      cancel(formName) {
        this.ruleForm.remark = ''
        this.$refs[formName].resetFields()
        this.$emit('closeRemarkRecord')
      },
      // 确定
      sure() {
        if (this.ruleForm.remark) {
          axios.post('audit/remark', this.ruleForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message || '添加备注成功')
              this.ruleForm.remark = ''
              // 更新数据
              this.getRemarkRecordsList({orderId: this.orderId})
              // 关闭弹框
              this.$emit('closeRemarkRecord')
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          this.$emit('closeRemarkRecord')
        }
      }
    },
    watch: {
      orderId(val) {
        this.ruleForm.orderId = this.orderId
        this.getRemarkRecordsList({orderId: this.orderId})
      },
      clearRemarkInfo() {
        this.$refs['ruleForm'].resetFields()
      },
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.getRemarkRecordsList({orderId: this.$route.query.orderId})
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
