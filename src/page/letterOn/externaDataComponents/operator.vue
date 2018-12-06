<template>
  <el-card :gutter="10" style="width:100%;" class="mb14">
    <div slot="header" class="clearfix">
      <span class="fw f20">运营商</span>
    </div>
    <div v-if="operatorInfo">
      <p class="mb8">运营商实名：{{operatorInfo.name}}</p>
      <p class="mb8">通话记录排行(前10)：</p>
      <el-table v-if="operatorInfo" :data="operatorInfo.top10"
                style="width: 100%" border>
        <el-table-column prop="phone" label="号码" >
        </el-table-column>
        <el-table-column label="通话时长(分钟)" >
          <template slot-scope="scope">
            <span>{{scope.row.duration}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="contactcount" label="次数" >
        </el-table-column>
        <el-table-column prop="name" label="姓名(通讯录匹配)" >
        </el-table-column>
      </el-table>
    </div>
  </el-card>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'
  export default {
    data: function () {
      return {
        creditOrderNo: this.$route.query.orderId,
        type: 2,
        operatorInfo: {} // 运营商信息
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      this.getOperatorInfo()
    },
    methods: {
      // 获取订单信息
      getOperatorInfo() {
        axios.post('dataplatform/fetchDeriveData', {
          creditOrderNo: this.creditOrderNo,
          type: this.type
        }).then(res => {
          if (res.data.code === 200) {
            this.operatorInfo = res.data.body
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.creditOrderNo = this.$route.query.orderId
          this.getOperatorInfo()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
