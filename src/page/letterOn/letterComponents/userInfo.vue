<template>
  <div style="width:100%;" class="mb14">
    <div slot="header" class="clearfix mb14">
      <span class="fw f20">用户信息</span>
      <el-button size="small" style="float: right;margin-left:10px" class="blue"
                 v-if="userInfo"
                 @click="goTo360(userInfo.phone)">360搜索
      </el-button>
      <el-button size="small" style="float: right;margin-left:10px" class="blue"
                 v-if="userInfo && onLineInfoData && onLineInfoData.hideButton === 1 && showExportBtn && Number.parseInt(type) === 1"
                 :disabled="disabled"
                 @click="onLineInfo(1)">重新查询
      </el-button>
    </div>
    <div v-if="userInfo" class="card_bg pd10">
      <p class="mb14"><span>姓名：</span>{{userInfo.realName}}
        <span @click="openContacts" class="cur iconfont">&#xe640;</span>
      </p>
      <p class="mb14"><span>身份证号：</span>{{userInfo.idCard}}</p>
      <p class="mb14"><span>性别：</span>{{userInfo.sex}}</p>
      <p class="mb14"><span>年龄：</span>{{userInfo.age}}</p>
      <p class="mb14">
        <span>注册手机：</span>{{userInfo.phone}}
        <span v-html="userInfo.address ? `（${userInfo.address}）` : '（暂无数据）'"></span>
      </p>
      <div v-show="parseInt(type) === 1">
        <div class="mb14">
          <span class="yellow">在网状态：</span>
          <span v-if="fixedField && onLineInfoData"
                v-for="item in fixedField.onlineList"
                :key="item.key" :style="{color: item.color}"
                v-show="item.key === onLineInfoData.onlineStatus">
            {{item.value}}
          </span>
          <span v-if="!onLineInfoData" style="color:#CCCBCA">暂无数据</span>
        </div>
        <p class="mb14">
          <span class="yellow">在网时长：</span>
          <span v-if="fixedField && onLineInfoData "
                v-for="item in fixedField.onlineTime"
                :key="item.key" :style="{color: item.color}"
                v-show="item.key === onLineInfoData.onlineTime">
            {{item.value}}
          </span>
          <span v-if="!onLineInfoData" style="color:#CCCBCA">暂无数据</span>
        </p>
        <p class="mb14">
          <span class="yellow">实名一致认证：</span>
          <span v-if="fixedField && onLineInfoData"
                v-for="item in fixedField.realName"
                :key="item.key" :style="{color: item.color}"
                v-show="item.key === onLineInfoData.identify">
            {{item.value}}
          </span>
          <span v-if="!onLineInfoData" style="color:#CCCBCA">暂无数据</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import {judgeLimit} from '../../../untils/common'

  export default {
    data: function () {
      return {
        showExportBtn: false,
        disabled: false,
        showBtn: false,
        menuId: 27,
        orderId: this.$route.query.orderId,
        userId: this.$route.query.userId,
        type: this.$route.query.type,
        userInfo: null, // 用户信息,
        onLineInfoData: null // 在网信息
      }
    },
    computed: {
      ...mapState(['circulation', 'fixedField', 'setButtonLimitData'])
      // showExportBtn: function () {
      //   return judgeLimit(this.$store.state.setButtonLimitData, this.menuId)
      // }
    },
    created() {
      this.buttonLimit()
    },
    beforeDestroy() {
      // this.$store.commit('setButtonLimit', null)
    },
    mounted() {
      this.getUserInfo()
      this.onLineInfo(0)
      // this.lookAgainBtnPribilege()
    },
    methods: {
      ...mapActions(['buttonLimit']),
      // 获取用户信息
      getUserInfo() {
        axios.post('audit/userInfo', {
          orderId: this.orderId,
          type: this.type
        }).then(res => {
          if (res.data.code === 200) {
            this.userInfo = res.data.body
            this.$emit('sendUserInfo', res.data.body.creditAmount)
          }
        })
      },
      // 按钮权限
      lookAgainBtnPribilege() {
        axios.post('security/hasPrivilege', {model: 'audit', privilegeValue: 'reQuery'})
          .then(res => {
            if (res.data.code === 200) {
              this.showBtn = (parseInt(res.data.body) === 1)
            }
          })
      },
      // 在网信息
      onLineInfo(label) {
        axios.post('audit/reOperatorIdentityInfo', {
          orderId: this.orderId,
          userId: this.userId,
          label: label
        }).then(res => {
          if (res.data.code === 200) {
            if (res.data.body) {
              this.onLineInfoData = res.data.body
            }
          } else {
            this.$message.error(res.data.message)
            return
          }
          if (label === 1) {
            this.disabled = true
          }
        })
      },
      goTo360(mobile) {
        const url = `https://www.so.com/s?ie=utf-8&shb=1&src=360sou_newhome&q=${mobile}`
        window.open(url, '_blank')
      },
      // 打开通讯弹框
      openContacts() {
        // 打开通讯录
        this.$store.commit('showContacts', false)
        this.$store.commit('changeRightWidth', false)
        this.$store.commit('fetchContact', !this.circulation.fetchContact)
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.orderId = this.$route.query.orderId
          this.userId = this.$route.query.userId
          this.type = this.$route.query.type
          this.getUserInfo()
          this.onLineInfo()
        },
        deep: true
      },
      'setButtonLimitData': {
        handler: function (val, oldVal) {
          this.showExportBtn = judgeLimit(this.$store.state.setButtonLimitData, this.menuId)
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
