<template>
  <div class="head_wrapper">
    <span class="bixia_fenqi">币下分期后台</span>
    <span class="test_development">{{EnvironmentHeader}}</span>
    <el-menu
      :default-active="activeIndex" class="el-menu-demo menu_tab"
      mode="horizontal" background-color="#324157"
      @select="handleSelect" text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item v-for="item in headTitle"
                    :index="String(item.id)"
                    :key="item.index">{{item.name}}
      </el-menu-item>

      <el-dropdown trigger="click" class="drop_down">
        <span class="manage_name">{{userName}}</span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="updatePassword" class="cur">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="loginOut" class="cur">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </el-menu>
  </div>

</template>

<script>
  import {mapState} from 'vuex'
  import axios from 'axios'
  import updatePassword from '../components/updatePassword.vue'

  export default {
    data() {
      return {
        headTitle: [], // 系统化模块列表
        userName: '',
        activeIndex: '1',
        EnvironmentHeader: '测试环境'
      }
    },
    components: {
      updatePassword
    },
    computed: {
      ...mapState(['fixedField', 'topicType'])
    },
    created() {
      let key = window.sessionStorage.getItem('activeIndex')
      if (key) {
        this.activeIndex = key + ''
      }
    },
    mounted() {
      this.EnvironmentHeader = process.env.NODE_ENV === 'production' ? '' : '测试环境'
      // 获取用户登陆信息
      this.fetchUserInfo()
      // 获取系统模块列表
      this.getSysModule()
      // 根据当前环境判断是否显示提示文字
    },
    methods: {
      // 获取用户登录信息
      fetchUserInfo() {
        axios.post('/security/loginInfo').then((res) => {
          if (res.data.code === 200) {
            let name = res.data.body.realName
            this.$store.commit('userLoginInfo', res.data.body)
            this.userName = name.slice(-2)
          } else {
            this.$message.error(res.data.mesage)
          }
        })
      },
      // 获取系统模块
      getSysModule() {
        axios.post('/security/listUserApps', {applicationId: this.topicType})
          .then((res) => {
            if (res.data.code === 200) {
              this.headTitle = res.data.body
            }
          })
      },
      // 退出
      loginOut() {
        axios.post('/security/signOut').then((res) => {
          if (res.data.code === 200) {
            this.$router.push({path: '/'})
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      updatePassword() {
        this.$store.commit('updateShowDialog', true)
      },
      handleSelect(key, keyPath) {
        // if (Number.parseInt(key) === 3) {
        //   window.open('http://192.168.2.14:82/#/nav/index/welcome')
        // }
        this.$store.commit('changeTopicType', Number(key))
        this.$router.push({path: '/nav/index/welcome'})
        window.sessionStorage.setItem('activeIndex', key)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .head_wrapper {
    position: relative;
    background-color: #324157;
    width: 100%;
    /*border:1px solid red;*/
    /*z-index:100;*/
  }

  .menu_tab {
    padding-left: 120px !important;
  }

  .bixia_fenqi {
    line-height: 60px;
    position: absolute;
    left: 10px;
    z-index: 100;
    font-size: 18px;
    color: #F5CF62;
  }

  .drop_down {
    position: absolute;
    right: 20px;
    top: 10px;
  }

  .manage_name {
    background-color: #FF3399;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    float: right;
    color: #fff;
    border-radius: 50%;
    &:hover {
      cursor: pointer;
    }
  }

  .v-modal {
    z-index: 10 !important;
  }

  .test_development {
    font-size: 20px;
    font-weight: bold;
    color: red;
    position: absolute;
    top: 15px;
    left: 50%;
    z-index: 5000;
    transform: translateX(-50%);
  }
</style>
