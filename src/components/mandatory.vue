<template>
  <el-dialog title="强制退出" :visible.sync="dialogVisibleMandatory"
             width="30%" @close="cancel()">
      <span>是否确认将手机号为 “{{mobile}}” 的订单，从 “审批中” 强制退出？ </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()" size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
  import axios from 'axios'
  import {mapActions} from 'vuex'
  import {judgeLimit} from '../untils/common'

  export default {
    props: ['orderId', 'mobile', 'ApprovalRecordMenuId'],
    data: function () {
      return {}
    },
    mounted() {
    },
    computed: {
      dialogVisibleMandatory: {
        get: function () {
          return this.$store.state.dialogVisibleMandatory
        },
        set: function () {
        }
      }
    },
    methods: {
      ...mapActions(['getLetterRecordsList']),
      // 验证权限
      buttonQuit(val) {
        return judgeLimit(this.$store.state.setButtonLimitData, val)
      },
      // 确认强制退出
      sure() {
        axios.post('auditOrder/auditOrderForcedExit', {orderId: this.orderId})
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              // 刷新审批列表
              if (this.buttonQuit(Number.parseInt(this.ApprovalRecordMenuId))) {
                this.getLetterRecordsList({orderId: this.orderId})
              }
              this.$emit('refresh')
            } else {
              this.$message.error(res.data.message)
            }
          })
        this.$store.commit('mandatoryDialog', false)
      },
      // 取消
      cancel() {
        this.$store.commit('mandatoryDialog', false)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
