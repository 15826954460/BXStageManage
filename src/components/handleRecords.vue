<template>
  <div>
    {{refreshRecords}}
    <el-table v-if="handleRecordsList" :data="handleRecordsList"
              border style="width: 100%;" :height="height === true && handleRecordsList.length > 7 ? 350 : ''">
      <el-table-column label="时间" widht="160px">
        <template slot-scope="scope">
          {{scope.row.createTime | dateTime}}
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="处理人">
      </el-table-column>
      <el-table-column prop="type" label="操作">
        <template slot-scope="scope">
          <span v-if="fixedField" v-for="item in fixedField.handleRecordsList"
                v-show="item.code === scope.row.type">
            {{item.value}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" :width="height === true ? '150px' : '260px'" >
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
    props: ['id', 'type', 'height', 'refresh'],
    data: function () {
      return {
      }
    },
    computed: {
      ...mapState(['handleRecordsList', 'fixedField', 'refreshRecords'])
    },
    mounted() {
      // 初始化处理记录
      this.getHandleRecordsList({id: this.id})
    },
    methods: {
      ...mapActions(['getHandleRecordsList'])
    },
    watch: {
      refresh (val, oldval) {
        this.$store.commit('setHandleRecordsList', [])
        this.getHandleRecordsList({id: this.id})
      }
    }
  }
</script>
<style>
</style>
