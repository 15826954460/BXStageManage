<template>
  <div class="login-wrap">
    <el-card class="box-card">
      <form class="form">
        <div class="login-title">币下分期管理后台</div>
        <div class="el-form-item margin-bottom">
          <label class="el-form-item__label">用户</label>
          <div class="el-form-item__content">
            <div class="el-input">
              <input type="text" class="el-input__inner" v-model="loginForm.username">
            </div>
          </div>
        </div>
        <div class="el-form-item">
          <label class="el-form-item__label">密码</label>
          <div class="el-form-item__content">
            <div class="el-input">
              <input type="password" class="el-input__inner" v-model="loginForm.password">
            </div>
          </div>
        </div>
        <el-button type="success button" @click="login">登录</el-button>
      </form>
    </el-card>
  </div>
</template>
<script>
  import axios from 'axios'
  import {mapActions} from 'vuex'
  export default {
    data: function () {
      return {
        loginForm: {
          username: null,
          password: null
        }
      }
    },
    methods: {
      ...mapActions(['buttonLimit']),
      login() {
        if (!this.loginForm.username || !this.loginForm.password) {
          this.$message.error('账号或密码不能为空')
          return
        }
        // 登录接口
        axios.post('security/signIn', this.loginForm).then((res) => {
          if (res.data.code === 200) {
            this.$router.push({path: '/nav/index/welcome'})
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    }
  }
</script>
<style scope lang="less">
  .login-wrap {
    width: 100vw;
    height: 100vh;
    position: relative;
    background: #F2F2F2;
    .box-card {
      width: 300px;
      position: absolute;
      top: 25%;
      left: 50%;
      transform: translateX(-50%);
    }
    .form {
      width: 100%;
      .login-title {
        text-align: center;
        font-size: 14px;
        font-weight: bold;
        border-bottom: 1px solid #67C23A;
        padding-bottom: 10px;
      }
      .margin-bottom {
        margin-bottom: 15px;
      }
      .el-input__inner {
        height: 35px;
      }
      .button {
        width: 100%;
      }
    }
  }
</style>
