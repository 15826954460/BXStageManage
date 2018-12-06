<template>
  <el-dialog title="修改密码" :visible.sync="showDialogUpdatePassword"
             width="450px" @close="close('ruleForm')">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"
             label-width="100px" class="demo-ruleForm">
      <el-form-item label="原密码" prop="oldPassword">
        <el-input type="password" v-model="ruleForm.oldPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="ruleForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPasswordConfirm">
        <el-input type="password" v-model.number="ruleForm.newPasswordConfirm"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')" size="small">提交</el-button>
        <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      const oldPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else if (value.length < 6 || value.length > 16) {
          callback(new Error('请输入6-16密码'))
        } else {
          callback()
        }
      }
      const newPass = (rule, value, callback) => {
        if (value === '') {
          return callback(new Error('请输入新密码'))
        } else if (value.length < 6 || value.length > 16) {
          callback(new Error('请输入6-16密码'))
        } else {
          callback()
        }
      }
      const surePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (String(value) !== this.ruleForm.newPassword) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          oldPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        },
        rules: {
          oldPassword: [
            {required: true, validator: oldPass, trigger: 'blur'}
          ],
          newPassword: [
            {required: true, validator: newPass, trigger: 'blur'}
          ],
          newPasswordConfirm: [
            {required: true, validator: surePass, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      showDialogUpdatePassword: {
        set() {
        },
        get() {
          return this.$store.state.showDialogUpdatePassword
        }
      }
    },
    methods: {
      close(formName) {
        this.$store.commit('updateShowDialog', false)
        this.resetForm(formName)
      },
      // 确认修改密码
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            axios.post('/security/modifyPassword', this.ruleForm).then((res) => {
              if (res.data.code === 200) {
                this.$store.commit('updateShowDialog', false)
                this.$router.push({path: '/'})
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .dialog-footer {
    text-align: left;
    padding-left: 100px;
  }
</style>

