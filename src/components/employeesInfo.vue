<template>
  <el-dialog :title="!employeesManage.addStatus ? '个人资料' : '新增员工'"
             :visible.sync="employeesManage.dialogFormVisible" width="400px"
             @close="close('ruleForm')">{{userInfo}}
    <el-form label-position="left" :rules="rules" ref="ruleForm" :model="form" label-width="80px">
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="form.realName" type="text" placeholder="请输入真实姓名，限20字内"></el-input>
      </el-form-item>
      <el-form-item label="登录名" prop="username">
        <el-input :disabled="!employeesManage.addStatus && 'disabled'" placeholder="请输入登录名，限20字内"
                  v-model="form.username"
                  type="text"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码，限20字内"
                  type="password"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号" type="text"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" type="email"></el-input>
      </el-form-item>
      <el-form-item label="入职时间" required>
        <el-date-picker @change="change" :editable="false" v-model="form.jointime" type="date"
                        placeholder="选择日期"></el-date-picker>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio class="radio" v-model="form.gender" label="0">男</el-radio>
        <el-radio class="radio" v-model="form.gender" label="1">女</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      <el-button type="primary" @click="dddd()">test</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import {filterTime} from '../untils/common'
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data: function () {
      const validateEmail = (rule, value, callback) => {
        // eslint-disable-next-line
        const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
        if (!value) {
          callback(new Error('请输入邮箱'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      const validateMobile = (rule, value, callback) => {
        const reg = /^1(3|4|5|7|8)\d{9}$/
        if (!value) {
          callback(new Error('请输入手机号'))
        } else if (!reg.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      return {
        form: {
          username: null,
          password: null,
          realName: null,
          email: null,
          mobile: null,
          jointime: null,
          gender: '0' // 性别 0:男，1:女
        },
        testO: {
          A: false,
          B: {
            S: 222
          }
        },
        rules: {
          username: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 4, max: 20, message: '长度在 4 到 20 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
          ],
          realName: [
            {required: true, message: '请输入真实姓名', trigger: 'blur'}
          ],
          email: [
            {required: true, validator: validateEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, validator: validateMobile, trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      ...mapState(['employeesManage']),
      userInfo() {
        return this.$store.state.employeesManage
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 新增员工
            axios.post('/security/addUser', this.form).then(res => {
              if (res.data.code === 200) {
                this.$message.success(res.data.message)
                this.$store.commit('setDialogFormVisible', false)
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        })
      },
      change(val) {
        if (val) {
          this.form.jointime = filterTime(val)
        }
      },
      // 充值表单内容
      resetForm() {
        let form = this.form
        for (let key in form) {
          if (key !== 'gender') {
            form[key] = null
          } else {
            form[key] = '0'
          }
        }
      },
      // 取消修改
      cancel(formName) {
        this.$refs[formName].resetFields()
        // 新建员工取消修改
        if (this.employeesManage.addStatus) {
          this.resetForm()
          return
        }
        // 个人资料取消修改
        if (!this.addStatus) {
          this.$store.commit('setUserInformation', null)
          this.$store.commit('setDialogFormVisible', false)
        }
      },
      dddd() {
        this.testO.A = !this.testO.A
      },
      // 关闭弹框
      close(formName) {
        this.$refs[formName].resetFields()
        this.$store.commit('setDialogFormVisible', false)
      }
    },
    watch: {
//      employeesManage: {
//        handle: function (newValue, oldValue) {
//          console.log(newValue)
//          this.form = {
//            username: newValue.userInformation.username,
//            password: newValue.userInformation.password,
//            realName: newValue.userInformation.realname,
//            email: newValue.userInformation.email,
//            jointime: newValue.userInformation.joinTime,
//            mobile: newValue.userInformation.mobile,
//            gender: newValue.userInformation.gender ? '1' : '0'
//          }
//        },
//        deep: true
//      }
      'testO.A': function () {
        console.log(this.testO.B.S++)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
