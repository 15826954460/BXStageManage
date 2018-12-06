<template>
  <div style="width:100%;"
           v-show="parseInt(type) === 1" class="mb14">
    <div slot="header" class="clearfix mb14">
      <span class="fw f20">补充信息</span>
    </div>
    <div v-if="supplementInfo" class="pd10 card_bg">
      <p class="mb14">GPS地址：{{supplementInfo.gps}}</p>
      <p class="mb14">IP地址：{{supplementInfo.ip}}</p>
      <p class="mb14">现居住地址：{{supplementInfo.addrDetail}}</p>
      <p class="mb14">可接受最高月还款(元)：{{supplementInfo.maxMonthlyRepay | formatToThree}}</p>
      <p class="mb14">车辆情况：{{supplementInfo.carAsset}}</p>
      <p class="mb14">教育程度：{{supplementInfo.eduLevel}}</p>
      <!--<p class="mb14">-->
        <!--<span class="yellow">学历认证结果：</span>-->
        <!--<span v-if="fixedField" v-for="item in fixedField.schoolingCertification"-->
              <!--:style="{color:item.color}"-->
              <!--:key="item.key" v-show="item.key === supplementInfo.educationDegree">-->
          <!--{{item.value}}-->
        <!--</span>-->
      <!--</p>-->
      <!--<p class="mb14">-->
        <!--<span class="yellow">学历类型：</span>-->
        <!--<span v-if="fixedField" v-for="item in fixedField.schoolingType"-->
              <!--:style="{color:item.color}"-->
              <!--:key="item.key" v-show="item.key === supplementInfo.studyStyle">-->
          <!--{{item.value}}-->
        <!--</span>-->
      <!--</p>-->
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data: function () {
      return {
        orderId: this.$route.query.orderId,
        type: this.$route.query.type,
        userId: this.$route.query.userId,
        supplementInfo: {} // 补充信息
      }
    },
    computed: {
      ...mapState(['circulation', 'fixedField'])
    },
    mounted() {
      this.getSupplementInfo()
    },
    methods: {
      // 获取公司信息
      getSupplementInfo() {
        axios.post('audit/attachInfo', {
          orderId: this.orderId,
          userId: this.userId
        }).then(res => {
          if (res.data.code === 200) {
            this.supplementInfo = res.data.body
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.orderId = this.$route.query.orderId
          this.userId = this.$route.query.userId
          this.getSupplementInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
