<template>
    <el-row :gutter="20" style="width:100%;">
      <el-col :span="12">
        <!--todo:运营商-->
        <operator></operator>
        <!--todo:通讯录-->
        <contactsReport></contactsReport>
        <!--todo:信用评分-->
        <creditPoints></creditPoints>
      </el-col>
      <el-col :span="12">
        <!--todo:命中规则-->
        <hitRulesInfo></hitRulesInfo>
      </el-col>
    </el-row>
</template>

<script>
  import creditPoints from './externaDataComponents/creditPoints.vue'
  import operator from './externaDataComponents/operator.vue'
  import hitRulesInfo from './externaDataComponents/hitRules.vue'
  import contactsReport from './externaDataComponents/contactsReport.vue'
  export default {
    data: function () {
      return {
        orderId: this.$route.query.orderId,
        type: this.$route.query.type
      }
    },
    components: {creditPoints, operator, hitRulesInfo, contactsReport}
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
