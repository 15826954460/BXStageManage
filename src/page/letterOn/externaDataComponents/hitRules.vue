<template>
  <el-card :gutter="10" style="width:100%;" v-if="hitRules">
    <div slot="header" class="clearfix">
      <span class="fw f20 error">规则命中情况</span>
    </div>
    <!--<p class="error mb8">-->
      <!--1天内设备关联手机号数：-->
      <!--<span v-if="hitRules.relaCount">-->
        <!--{{hitRules.relaCount.relaCellCount}}-->
      <!--</span>-->
      <!--<span v-else class="gray">-->
        <!--暂无数据-->
      <!--</span>-->
    <!--</p>-->
    <!--<p class="error mb8">1天内设备关联身份证数：-->
      <!--<span v-if="hitRules.relaCount">-->
        <!--{{hitRules.relaCount.relaIdCount}}-->
      <!--</span>-->
      <!--<span v-else class="gray">-->
        <!--暂无数据-->
      <!--</span>-->
    <!--</p>-->
    <p class="error mb8">多平台申请借款详情：</p>
    <table class="b_collapse mb8 width_100 bd_e4">
      <thead>
      <tr class="bg_e4 h30">
        <td style="width:30%">统计时间</td>
        <td style="width:70%">申请次数</td>
      </tr>
      </thead>
      <tbody>
      <tr class="h30">
        <td class="bd_e4">7天内</td>
        <td class="bd_e4">
          <span v-if="hitRules.mulApply && JSON.stringify(hitRules.mulApply) !== '{}' && hitRules.mulApply.sevenDayCount">
            {{hitRules.mulApply.sevenDayCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">1个月内</td>
        <td class="bd_e4">
          <span v-if="hitRules.mulApply && JSON.stringify(hitRules.mulApply) !== '{}' && hitRules.mulApply.monthCount">
            {{hitRules.mulApply.monthCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">3个月内</td>
        <td class="bd_e4">
           <span v-if="hitRules.mulApply && JSON.stringify(hitRules.mulApply) !== '{}' && hitRules.mulApply.threeMonthCount">
            {{hitRules.mulApply.threeMonthCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      </tbody>
    </table>
    <p class="error mb8">设备、身份证、手机号申请详情：</p>
    <table class="b_collapse mb8 width_100 bd_e4">
      <thead>
      <tr class="bg_e4 h30">
        <td class="bd_e4">统计时间</td>
        <td class="bd_e4">设备申请次数</td>
        <td class="bd_e4">身份证申请次数</td>
        <td class="bd_e4">手机号申请次数</td>
      </tr>
      </thead>
      <tbody>
      <tr class="h30">
        <td class="bd_e4">7天内</td>
        <td class="bd_e4">
            <span v-if="hitRules.infoApply && JSON.stringify(hitRules.infoApply) !== '{}' && hitRules.infoApply.sevenDayDeviceCount">
            {{hitRules.infoApply.sevenDayDeviceCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
            <span v-if="hitRules.infoApply && JSON.stringify(hitRules.infoApply) !== '{}' && hitRules.infoApply.sevenDayIdCount">
            {{hitRules.infoApply.sevenDayIdCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
              <span v-if="hitRules.infoApply && JSON.stringify(hitRules.infoApply) !== '{}' && hitRules.infoApply.sevenDayCellCount">
            {{hitRules.infoApply.sevenDayCellCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">1个月内</td>
        <td class="bd_e4">
               <span v-if="hitRules.infoApply && JSON.stringify(hitRules.infoApply) !== '{}' && hitRules.infoApply.monthDeviceCount">
            {{hitRules.infoApply.monthDeviceCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
               <span v-if="hitRules.infoApply && JSON.stringify(hitRules.infoApply) !== '{}' && hitRules.infoApply.monthIdCount">
            {{hitRules.infoApply.monthIdCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
                 <span v-if="hitRules.infoApply && JSON.stringify(hitRules.infoApply) !== '{}' && hitRules.infoApply.monthCellCount">
            {{hitRules.infoApply.monthCellCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      </tbody>
    </table>
    <p class="error mb8">关联邮箱、 手机、身份证详情：</p>
    <table class="b_collapse mb8 width_100 bd_e4">
      <thead>
      <tr class="bg_e4 h30">
        <td class="bd_e4" style="width:50%">规则内容</td>
        <td class="bd_e4" style="width:25%">命中数量</td>
        <td class="bd_e4" style="width:25%">命中详情</td>
      </tr>
      </thead>
      <tbody>
      <tr class="h30">
        <td class="bd_e4">3个月内借款人身份证关联邮箱</td>
        <td class="bd_e4">
               <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.idRelaEmailCount">
           {{hitRules.releInfo.idRelaEmailCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
               <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.idRelaEmailDetail">
           {{hitRules.releInfo.idRelaEmailDetail}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">3个月内借款人身份证关联借款人手机</td>
        <td class="bd_e4">
               <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.idRelaCellCount">
           {{hitRules.releInfo.idRelaCellCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
              <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.idRelaCellDetail">
           {{hitRules.releInfo.idRelaCellDetail}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">3个月内邮箱关联身份证</td>
        <td class="bd_e4">
                 <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.emailRelaIdCount">
           {{hitRules.releInfo.emailRelaIdCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
              <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.emailRelaIdDetail">
           {{hitRules.releInfo.emailRelaIdDetail}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">3个月手机号关联身份证</td>
        <td class="bd_e4">
              <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.cellRelaIdCount">
           {{hitRules.releInfo.cellRelaIdCount}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
        <td class="bd_e4">
             <span v-if="hitRules.releInfo && JSON.stringify(hitRules.releInfo) !== '{}' && hitRules.releInfo.cellRelaIdDetail">
           {{hitRules.releInfo.cellRelaIdDetail}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      </tbody>
    </table>
    <p class="error mb8">命中中风险关注名单详情：</p>
    <table class="b_collapse mb8 width_100 bd_e4">
      <thead>
      <tr class="bg_e4 h30">
        <td class="bd_e4">规则内容</td>
        <td class="bd_e4">命中详情</td>
      </tr>
      </thead>
      <tbody>
      <tr class="h30">
        <td class="bd_e4">身份证</td>
        <td class="bd_e4">
             <span v-if="hitRules.riskInfo && JSON.stringify(hitRules.riskInfo) !== '{}' && hitRules.riskInfo.idRiskInfo">
           {{hitRules.riskInfo.idRiskInfo}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">手机</td>
        <td class="bd_e4">
            <span v-if="hitRules.riskInfo && JSON.stringify(hitRules.riskInfo) !== '{}' && hitRules.riskInfo.cellRiskInfo">
           {{hitRules.riskInfo.cellRiskInfo}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">邮箱</td>
        <td class="bd_e4">
             <span v-if="hitRules.riskInfo && JSON.stringify(hitRules.riskInfo) !== '{}' && hitRules.riskInfo.emailRiskInfo">
           {{hitRules.riskInfo.emailRiskInfo}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">座机</td>
        <td class="bd_e4">
              <span v-if="hitRules.riskInfo && JSON.stringify(hitRules.riskInfo) !== '{}' && hitRules.riskInfo.teleRiskInfo">
           {{hitRules.riskInfo.teleRiskInfo}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      <tr class="h30">
        <td class="bd_e4">QQ</td>
        <td class="bd_e4">
             <span v-if="hitRules.riskInfo && JSON.stringify(hitRules.riskInfo) !== '{}' && hitRules.riskInfo.qqRiskInfo">
           {{hitRules.riskInfo.qqRiskInfo}}
          </span>
          <span v-else class="gray">
           ——
          </span>
        </td>
      </tr>
      </tbody>
    </table>
  </el-card>

</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'
  export default {
    data: function () {
      return {
        postParam: {
          orderId: this.$route.query.orderId
        },
        hitRules: {}
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      // 获取命中规则数据
      this.getHitRulesData()
    },
    components: {},
    methods: {
      // 获取命中规则数据
      getHitRulesData() {
        axios.post('thirddata/hitRules', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.hitRules = res.data.body
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.postParam.orderId = this.$route.query.orderId
          this.getHitRulesData()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .width_100 {
    width: 100%;
  }

  .bd_e4 {
    border: 1px solid #e4e4e4;
  }

  .bg_e4 {
    background: #EEF1F6;
  }

  .b_collapse {
    border-collapse: collapse;
  }

  .h30 {
    height: 40px;
    line-height: 40px;
  }
  .gray{
    color: #CCCDCF;
  }
</style>
