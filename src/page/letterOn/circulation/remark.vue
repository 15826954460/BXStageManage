<template>
  <div class="remark" v-if="circulation.remarkShow">
    <el-card style="min-height:100vh;">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">备注</span>
        <i style="float:right;position:relative;top:10px;"
           class="el-icon-close" @click="hideContacts"></i>
      </div>
      <div class="text item">
        <el-form :model="remarkParam" :rules="rules" ref="ruleForm"
                 label-width="100px" class="demo-ruleForm">
          <el-form-item label="审批操作：">
            <el-button type="warning" size="small">备注</el-button>
          </el-form-item>
          <el-form-item label="添加备注：" prop="remark">
            <el-input type="textarea" placeholder="请输入内容"
                      v-model="remarkParam.remark"></el-input>
          </el-form-item>
        </el-form>
        <div class="button_wrapper">
          <el-button @click="cancel('ruleForm')" size="small">取消</el-button>
          <el-button type="primary" @click="submitRemark" size="small">确定</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'

  export default {
    data() {
      return {
        // 备注接口的参数
        remarkParam: {
          orderId: this.$route.query.orderId, // 借款编号
          remark: '' // 备注
        },
        rules: {
          remark: [
            {required: true, message: '请输入内容', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    methods: {
      ...mapActions(['getRemarkRecordsList']),
      // 关闭弹框
      hideContacts() {
        this.$store.commit('showContacts', false)
        this.remarkParam.remark = ''
      },
      cancel(formName) {
        this.remarkParam.remark = ''
        this.$refs[formName].resetFields()
      },
      // 提交
      submitRemark() {
        if (!this.remarkParam.remark) {
          this.$message.error('备注内容不能为空')
          return
        }
        if (this.remarkParam.remark.length > 500) {
          this.$message.error('您的输入500字以内的备注信息')
          return
        }
        this.remarkParam.orderId = this.$route.query.orderId
        this.fetch()
      },
      // 添加备注接口
      fetch() {
        axios.post('audit/remark', this.remarkParam)
          .then(res => {
            if (parseInt(res.data.code) === 200) {
              this.$message.success(res.data.message)
              this.remarkParam.remark = ''
//              this.$router.push({path: '/nav/risk/auditList'})
              this.getRemarkRecordsList(this.remarkParam)
            } else {
              this.$message.error(res.data.message)
            }
          })
      }
    },
    watch: {
      // 解决 流转 选择原因 切换到通过 提交 再次审批下一单流转类型依然存在的 bug
      'circulation.codeType': {
        handler: function (val, oldVal) {
          this.remarkParam.remark = ''
        },
        // 深度监听
        deep: true
      }
    }
  }
</script>
<style scoped lang="less">
  .button_wrapper {
    text-align: right;
  }
</style>
