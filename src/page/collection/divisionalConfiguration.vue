<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">分案配置</p>
    <el-card>
      <p style="background: #EEF1F6;height: 50px;
      display: flex;align-items: center;padding-left: 20px"
         class="mb14">
        <span class="iconfont f30"
              style="color: rgb(20, 157, 235);margin-right: 30px;">&#xe644;</span>
        <span style="align-self: center">每日新案将自动分配给催收员。案件随机，均匀分配。</span>
      </p>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane v-for="item in menuList" :key="item.name"
                     :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>
      <el-table v-if="divisionalList && divisionalList.records"
                :data="divisionalList.records"
                border style="width: 100%">
        <el-table-column prop="operator" label="员工姓名">
        </el-table-column>
        <el-table-column prop="dunCaseNum" label="催收中案件数">
        </el-table-column>
        <el-table-column label="接受新案自动分配">
          <template slot-scope="scope">
            <el-switch
              @change="changeSwitch(scope.row)"
              v-model="scope.row.state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="divisionalList">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="divisionalList.totalrecord">
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
        menuList: [
          {label: '已开启', name: '1'},
          {label: '已关闭', name: '0'},
          {label: '所有催收员', name: '-1'}
        ],
        postParam: {
          state: 1,
          pageSize: 10, // 分页条目数
          pageNow: 1 // 查询第几页
        },
        updateParam: {
          id: null,
          state: null
        },
        divisionalList: {}, // 案件数据
        activeName: '1',
        timerOne: null,
        timerTwo: null
      }
    },
    computed: {},
    mounted() {
      this.getConfigData()
    },
    methods: {
      // 获取数据
      async getConfigData() {
        axios.post('dun/listPageCaseConfiguration', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.divisionalList = res.data.body
          }
        })
      },
      // 修改分配案件接口
      async updateConfig() {
        axios.post('dun/updateReceiveNewCaseSwitch', this.updateParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.timerOne = setTimeout(() => {
              this.getConfigData(this.postParam)
            }, 1000)
            this.timerTwo = setTimeout(() => {
              this.timerOne = null
            }, 1500)
            return true
          } else {
            this.$message.error(res.data.message)
            return false
          }
        })
      },
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.state = Number.parseInt(this.activeName)
        } else {
          this.postParam.state = null
        }
        this.postParam.pageNow = 1
        this.divisionalList.records = []
        this.getConfigData(this.postParam)
      },
      // 选择分页大小
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getConfigData(this.postParam)
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getConfigData(this.postParam)
      },
      // 修改权限
      changeSwitch(row) {
        this.timerTwo = null
        this.updateParam.state = Number.parseInt(row.state)
        this.updateParam.id = Number.parseInt(row.id)
        this.updateConfig()
      }
    }
  }
</script>

<style scoped lang="less">

</style>
