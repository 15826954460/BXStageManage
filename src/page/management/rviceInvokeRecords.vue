<template>
  <el-card class="" style="width:100%">
    <div slot="header" class="clearfix">
      <span class="lineh-36">推送失败列表</span>
    </div>
    <el-table v-if="serviceFailListData !== null" size="small"
              :data="serviceFailListData.records" border style="width: 100%">
      <el-table-column prop="orderId" label="借款订单号">
      </el-table-column>
      <el-table-column prop="thirdOrderId" label="第三方订单号">
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          {{scope.row.createTime | second}}
        </template>
      </el-table-column>
      <el-table-column label="修改时间">
        <template slot-scope="scope">
          {{scope.row.updateTime | second}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)"
                     type="text" size="small"
                     v-text="parseInt(scope.row.status) === 0 ? '重新推送' : '推送成功'">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination_wrapper" v-if="serviceFailListData !== null">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="serviceFailParam.pageNow"
        :page-sizes="[20, 40, 60]"
        :page-size="serviceFailParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="serviceFailListData.totalrecord">
      </el-pagination>
    </div>
  </el-card>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    data: function () {
      return {
        // 调用服务失败列表接口参数
        serviceFailParam: {
          orderId: '',
          thirdOrderId: '',
          status: 0,
          pageNow: 1,
          pageSize: 10
        }
      }
    },
    computed: {
      ...mapGetters(['serviceFailListData'])
    },
    mounted() {
      this.init()
    },
    methods: {
      // 初始化列表数据
      init() {
        this.$store.dispatch('getServiceFailData', this.serviceFailParam)
      },
      handleSizeChange(val) {
        this.serviceFailParam.pageSize = val
        this.init()
      },
      handleCurrentChange(val) {
        this.serviceFailParam.pageNow = val
        this.init()
      },
      // 重新推送
      handleClick(row) {
        if (parseInt(row.status) === 0) {
          this.$http.post('/system/reinvoke', {
            id: row.id
          }).then((res) => {
            if (parseInt(res.data.code) === 100) {
              this.$message.success(res.data.message)
              this.init()
            }
          })
        }
        this.serviceFailParam.pageNow = 1
      }
    }
  }
</script>
<!-- Add scoped attribute to limit CSS to this component only -->
<style scoped lang="less">
  .pagination_wrapper {
    text-align: right;
    margin-top: 20px;
  }

  .lineh-36 {
    font-size: 16px;
  }
</style>
