<template>
  <div style="width:100%;" class="mb14">
    <div slot="header" class="clearfix mb14">
      <span class="fw f20">紧急联系人</span>
      <el-button size="small" style="float: right;margin-left:10px" class="blue"
                 v-if="emergencyContactInfo"
                 @click="goTo360(emergencyContactInfo.contract1ANumber)">360搜索
      </el-button>
    </div>
    <div v-if="emergencyContactInfo" class="pd10 card_bg">
      <p class="mb14">与本人关系：
        <span v-if="fixedField" v-for="item in fixedField.relationShipList"
              :key="item.key"
              v-show="emergencyContactInfo.contract1ARelationship === item.key">
          {{item.value}}
        </span>
      </p>
      <p class="mb14">姓名：{{emergencyContactInfo.contract1AName}}</p>
      <p class="mb14">手机号码：
        {{emergencyContactInfo.contract1ANumber}}
      </p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'
  export default {
    data: function () {
      return {
        userId: this.$route.query.userId,
        orderId: this.$route.query.orderId,
        type: this.$route.query.type,
        emergencyContactInfo: {} // 订单信息
      }
    },
    computed: {
      ...mapState(['circulation', 'fixedField'])
    },
    mounted() {
      this.getEmergencyContactInfo()
    },
    methods: {
      // 获取订单信息
      getEmergencyContactInfo() {
        axios.post('user/emergencyContact', {userId: this.userId}).then(res => {
          if (res.data.code === 200) {
            this.emergencyContactInfo = res.data.body
          }
        })
      },
      goTo360(mobile) {
        const url = `https://www.so.com/s?ie=utf-8&shb=1&src=360sou_newhome&q=${mobile}`
        window.open(url, '_blank')
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.userId = this.$route.query.userId
          this.getEmergencyContactInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
