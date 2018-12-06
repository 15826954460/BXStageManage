<template>
  <el-card :gutter="10" style="width:100%;" class="mb14">
    <div slot="header" class="clearfix">
      <span class="fw f20">信用评分</span>
    </div>
    <el-table v-if="creditInfo" :data="creditInfo"
              style="width: 100%" border>
      <el-table-column prop="source" label="来源"></el-table-column>
      <el-table-column label="获取时间" >
        <template slot-scope="scope">
          {{scope.row.creatTime | dateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="分值" >
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'
  export default {
    data: function () {
      return {
        orderId: this.$route.query.orderId,
        type: this.$route.query.type,
        creditInfo: [] // 信用评分
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      this.getCreditInfo()
    },
    methods: {
      // 获取信用评分
      getCreditInfo() {
        axios.post('thirddata/creditscore', {orderId: this.orderId}).then(res => {
          if (res.data.code === 200) {
            this.creditInfo = res.data.body
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.orderId = this.$route.query.orderId
          this.getCreditInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
