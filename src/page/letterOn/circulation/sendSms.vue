<template>
  <div class="sms" v-if="circulation.smsShow">
    <el-card style="min-height:100vh;">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">发送短信</span>
        <i style="float:right;position:relative;top:10px;"
           class="el-icon-close" @click="hideContacts"></i>
      </div>
      <div class="text item">
        <el-form :model="remarkParam" ref="ruleForm"
                 label-width="100px" class="demo-ruleForm">
          <el-form-item label="短信类型：">
            <el-button type="primary" size="small">接听提醒</el-button>
          </el-form-item>
          <el-form-item label="短信内容：">
            <div style="background: #F9F9F9; padding: 8px; border-radius: 3px;">
              {{remarkParam.content}}
            </div>
          </el-form-item>
        </el-form>
        <div class="button_wrapper">
          <el-button size="small">取消</el-button>
          <el-button type="primary" @click="sure" size="small">确定</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'

  export default {
    data: function () {
      return {
        remarkParam: {
          orderId: this.$route.query.orderId,
          content: ''
        }
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
    },
    methods: {
      ...mapActions(['getLetterRecordsList']),
      // 获取短信模板
      getSmstemplate() {
        axios.post('audit/findTemplate', {orderId: this.$route.query.orderId}).then(res => {
          if (res.data.code === 200) {
            this.remarkParam.content = res.data.body.template
            // this.remarkParam.remark = res.data.body.template
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 确定发送短信
      sure() {
        axios.post('audit/sendMessage', this.remarkParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.getLetterRecordsList({orderId: this.$route.query.orderId})
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 关闭弹框
      hideContacts() {
        this.$store.commit('showContacts', false)
        // this.passParam.remark = ''
      }
    },
    watch: {
      'circulation.smsShow': {
        handler(val) {
          this.remarkParam.orderId = this.$route.query.orderId
          if (val) {
            this.getSmstemplate()
          }
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .button_wrapper {
    text-align: right;
  }
</style>
