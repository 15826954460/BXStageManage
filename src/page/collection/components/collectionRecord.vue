<template>
  <el-table v-if="collectionRecords"
            :height="collectionRecords.length > 10 ? 440 : ''"
            :data="collectionRecords" border style="width: 100%">
    <el-table-column prop="channelName" label="时间" width="180px">
      <template slot-scope="scope">
        <span>{{scope.row.createTime | dateTime}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="姓名/公司" width="120px">
    </el-table-column>
    <el-table-column prop="relation" label="关系">
    </el-table-column>
    <el-table-column label="号码" width="130px">
      <template slot-scope="scope">
                  <span
                    @click="collectionRecord(4, scope.row)">{{scope.row.phone}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="content" label="沟通内容" width="180px">
      <template slot-scope="scope">
        <el-popover
          v-if="scope.row.content"
          v-show="scope.row.content.length > 10"
          placement="right" title=""
          width="300"
          popper-class="break"
          trigger="hover"
          :content="scope.row.content">
          <span slot="reference" class="cur">{{scope.row.content | minStr12}}</span>
        </el-popover>
        <span v-if="scope.row.content"
              v-show="scope.row.content.length<=10"
              class="cur">{{scope.row.content | minStr12}}</span>
      </template>
    </el-table-column>
    <el-table-column label="沟通效果">
      <template slot-scope="scope">
        <span v-html="scope.row.valid === true ? '有效' : '无效'"></span>
      </template>
    </el-table-column>
    <el-table-column prop="operator" label="催收员">
    </el-table-column>
    <el-table-column prop="caseState" label="案件状态">
      <template slot-scope="scope">
                  <span v-for="item in fixedField.caseType" :key="item.code"
                        v-show="item.code === scope.row.caseState">
                    {{item.value}}
                  </span>
      </template>
    </el-table-column>
    <el-table-column label="下次跟进时间">
      <template slot-scope="scope">
        <span>{{scope.row.nextCallTime | dateTime}}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {mapState, mapActions} from 'vuex'

  export default {
    caseRecordDialogTableVisible: ['caseRecordDialogTableVisible'],
    data: function () {
      return {}
    },
    computed: {
      ...mapState(['collectionRecords', 'fixedField', 'caseUserId', 'CaseRecordDialogTableVisible'])
    },
    mounted() {
      // 催收记录
      this.getCollectionRecords({userId: this.caseUserId})
    },
    methods: {
      ...mapActions(['getCollectionRecords'])
    },
    watch: {
      CaseRecordDialogTableVisible(val) {
        if (val) {
          this.getCollectionRecords({userId: this.caseUserId})
        }
      }
    }
  }
</script>

<style scoped lang="less">

</style>
