<template>
  <div class="box-card">
    <el-table v-if="letterRecordsData" style="width: 100%"
              class="mt20"
              :data="letterRecordsData" border>
      <el-table-column prop="createTime" label="时间" width="180">
        <template slot-scope="scope">
          {{scope.row.createTime | dateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="审批人" width="100px">
      </el-table-column>
      <el-table-column prop="auditType" label="操作" width="120px">
        <template slot-scope="scope" v-if="fixedField">
            <span v-for="item in fixedField.aduitRecordsList" :key="item.key"
                  v-show="parseInt(scope.row.auditType) === item.key"
                  :style="{color: item.color}">
              {{item.value}}
            </span>
        </template>
      </el-table-column>
      <el-table-column prop="text" label="原因类型">
      </el-table-column>
      <el-table-column label="备注" width="150px">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.remark"
            v-show="scope.row.remark.length > 12"
            placement="right" title=""
            width="300"
            popper-class="break"
            trigger="hover"
            :content="scope.row.remark">
            <span slot="reference" class="cur">{{scope.row.remark | minStr12}}</span>
          </el-popover>
          <span v-if="scope.row.remark"
                v-show="scope.row.remark.length<=12"
                class="cur">{{scope.row.remark | minStr12}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    props: ['orderIdCurrentPage'],
    data: function () {
      return {
        orderId: this.$route.query.orderId
      }
    },
    mounted() {
      if (this.orderIdCurrentPage) {
        this.getLetterRecordsList({orderId: this.orderIdCurrentPage})
      } else {
        this.getLetterRecordsList({orderId: this.$route.query.orderId})
      }
    },
    computed: {
      ...mapState(['letterRecordsData', 'fixedField', 'circulation'])
    },
    methods: {
      ...mapActions(['getLetterRecordsList'])
    },
    watch: {
      // 查看审批记录的跟新
      orderId(val) {
        this.getLetterRecordsList({orderId: this.$route.query.orderId})
      },
      orderIdCurrentPage() {
        this.getLetterRecordsList({orderId: this.orderIdCurrentPage})
      },
      // 审批操作后的实时刷新
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.getLetterRecordsList({orderId: this.$route.query.orderId})
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
