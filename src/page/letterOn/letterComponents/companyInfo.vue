<template>
  <div  style="width:100%;" class="mb14">
    <div slot="header" class="clearfix mb14">
      <span class="fw f20">公司信息</span>
      <el-button size="small" class="blue"
                 style="float: right" @click="qixinwang">企信网
      </el-button>
      <el-button size="small" @click="farenwang" class="blue"
                 style="float: right;margin-right: 10px;margin-left: 10px">法人网
      </el-button>
      <el-button size="small" class="blue"
                 style="float: right" @click="goTo360(companyInfo.companyTel)">360搜索
      </el-button>
    </div>
    <div v-if="companyInfo" class="card_bg pd10">
      <p class="mb14">职业类别：
        <span>{{companyInfo.industryType}}</span>
        <!--<span v-for="item in fixedField.enterpriseList"-->
        <!--v-show="item.code === companyInfo.industryType">-->
        <!--{{item.value}}-->
        <!--</span>-->
      </p>
      <p class="mb14">公司名称：{{companyInfo.companyName}}</p>
      <p class="mb14">公司电话：{{companyInfo.companyTel}}</p>
      <p class="mb14">公司地址：{{companyInfo.companyAddr}}</p>
      <p class="mb14">现单位工作年限：{{companyInfo.workPeriod}}</p>
      <p class="mb14">现单位是否缴纳社保：{{companyInfo.companySocial}}</p>
      <p class="mb14">月工资收入(元)：{{companyInfo.monthsSalary | formatToThree}}</p>
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
        companyInfo: {} // 公司信息
      }
    },
    computed: {
      ...mapState(['fixedField', 'circulation'])
    },
    mounted() {
      this.getCompanyInfo()
    },
    methods: {
      // 获取公司信息
      getCompanyInfo() {
        axios.post('audit/companyInfo', {orderId: this.orderId}).then(res => {
          if (res.data.code === 200) {
            this.companyInfo = res.data.body
          }
        })
      },
      // 条转到360
      goTo360(mobile) {
        const url = `https://www.so.com/s?ie=utf-8&shb=1&src=360sou_newhome&q=${mobile}`
        window.open(url, '_blank')
      },
      farenwang() {
        const url = `http://zhixing.court.gov.cn/search/`
        window.open(url, '_blank')
      },
      qixinwang() {
        const url = `http://www.gsxt.gov.cn/index.html`
        window.open(url, '_blank')
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.orderId = this.$route.query.orderId
          this.type = this.$route.query.type
          this.getCompanyInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
