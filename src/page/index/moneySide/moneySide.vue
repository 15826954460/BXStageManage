<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">资金方</p>
    <el-card>
      <p style="background: #EEF1F6;height: 50px;
      display: flex;align-items: center;padding-left: 20px"
         class="mb14">
        <span class="iconfont f30"
              style="color: rgb(20, 157, 235);margin-right: 30px;">&#xe644;</span>
        <span style="align-self: center">资金方暂不支持配置。放款目前只支持走荷包商户号。</span>
      </p>
      <el-table v-if="moneySideList"
                :data="moneySideList"
                border style="width: 100%">
        <el-table-column prop="name" label="资金方">
        </el-table-column>
        <el-table-column prop="visible" label="资金方开关">
        </el-table-column>
      </el-table>
    </el-card>
  </el-card>
</template>

<script>
  import axios from 'axios'
  export default {
    data: function () {
      return {
        moneySideList: []
      }
    },
    computed: {},
    mounted() {
      this.getMoneySideData()
    },
    methods: {
      getMoneySideData() {
        axios.post('funder/listFunder').then(res => {
          if (res.data.code === 200) {
            this.moneySideList = res.data.body
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">

</style>
