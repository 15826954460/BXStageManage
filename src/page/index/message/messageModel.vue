<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">短信模板</p>
    <el-card>
      <el-table v-if="messageModel" :data="messageModel.records"
                border style="width: 100%">
        <el-table-column label="ID" prop="id">
        </el-table-column>
        <el-table-column prop="title" label="短信类型">
        </el-table-column>
        <el-table-column prop="content" label="短信文案" width="400px">
        </el-table-column>
        <el-table-column prop="description" label="短信触发说明">
        </el-table-column>
        <el-table-column label="发送渠道" prop="channel">
        </el-table-column>
        <el-table-column label="发送通道类型" prop="type">
        </el-table-column>
        <el-table-column prop="pass" label="备案状态">
        </el-table-column>
      </el-table>

      <div class="tr pt30 rel" v-if="messageModel">
        <p class="total_num">
          共 {{messageModel.totalrecord}} 条
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="messageModel.totalrecord"
        >
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
          pageSize: 10,
          pageNow: 1
        },
        messageModel: []
      }
    },
    computed: {},
    mounted() {
      this.getMessageModel()
    },
    methods: {
      getMessageModel() {
        axios.post('sms/smsTemplatePage').then(res => {
          if (res.data.code === 200) {
            this.messageModel = res.data.body
          }
        })
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getCaseDataList(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getCaseDataList(this.postParam)
      }
    }
  }
</script>

<style scoped lang="less">
  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>
