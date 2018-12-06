<template>
  <el-table v-if="engineRules"
            :data="engineRules" border>
    <el-table-column prop="orderIndex" label="序号">
    </el-table-column>
    <el-table-column prop="code" label="命中规则码">
    </el-table-column>
    <el-table-column label="时间">
      <template slot-scope="scope">
        {{scope.row.createTime | dateTime}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data: function () {
      return {
        engineRules: [] // 引擎规则命中信息
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      // 获取命中规则码数据
      this.getRules()
    },
    methods: {
      getRules() {
        axios.post('auditOrder/listAutoAuditCodeRecord', {orderId: this.$route.query.orderId})
          .then(res => {
            if (res.data.code === 200) {
              this.engineRules = res.data.body
            }
          })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.getRules({orderId: this.$route.query.orderId})
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="less">

</style>
