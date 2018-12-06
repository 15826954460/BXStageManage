<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">数据源管理</p>
    <el-card>
      <p style="background: #EEF1F6;height: 50px;
      display: flex;align-items: center;padding-left: 20px"
         class="mb14">
        <span class="iconfont f30"
              style="color: rgb(20, 157, 235);margin-right: 30px;">&#xe644;</span>
        <span style="align-self: center">数据源暂不支持配置。如需修改，请联系技术人员。</span>
      </p>

      <el-table v-if="dataResource"
                :data="dataResource.records"
                border style="width: 100%;">
        <el-table-column label="" prop="id" width="100px"></el-table-column>
        <el-table-column label="数据源" prop="source"></el-table-column>
        <el-table-column label="数据有效期（天）" prop="expires"></el-table-column>
      </el-table>

      <div class="tr pt30">
        <el-pagination v-if="dataResource"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="postParam.pageNow"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="postParam.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="dataResource.totalrecord">
        </el-pagination>
      </div>
    </el-card>

  </el-card>
</template>

<script>
  import axios from 'axios'

  export default {
    data: function () {
      return {
        postParam: {
          pageNow: 1,
          pageSize: 10
        },
        dataResource: null
      }
    },
    computed: {},
    mounted() {
      this.getDataResource()
    },
    methods: {
      // 获取数据资源数据
      getDataResource() {
        axios.post('thirddata/thirdDataConfigPage', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.dataResource = res.data.body
          } else {
            this.$message.error(res.data.messsage)
          }
        })
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getDataResource(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getDataResource(this.postParam)
      }
    }
  }
</script>

<style scoped lang="less">

</style>
