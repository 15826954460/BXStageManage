<template>
  <div class="contacts" v-if="circulation.showContacts">
    <el-card :gutter="10" style="height:100vh;overflow-y: auto">
      <div slot="header" class="clearfix">
        <el-button type="primary" size="small">通讯录</el-button>
        <i style="float:right;position:relative;top:10px;"
           class="el-icon-close" @click="hideContacts"></i>
      </div>
      <div class="search_wrapper">
        <el-input type="text" placeholder="请输入查询内容" v-model="postParam.condition"
                  class="input_box"></el-input>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </div>
      <el-table v-if="contactInfo" :data="contactInfo.records" border>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column prop="mobile" label="号码">
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="contactInfo">
        <el-pagination background
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       :current-page="postParam.pageNow"
                       :page-size="postParam.pageSize"
                       layout="total, prev, pager, next, jumper"
                       :total="contactInfo.totalrecord">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState} from 'vuex'

  export default {
    data: function () {
      return {
        postParam: {
          condition: '',
          orderId: this.$route.query.orderId,
          pageSize: 10,
          pageNow: 1
        },
        contactInfo: [] // 通讯录信息
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      this.getcontact()
      this.bindKeyDownEnter()
    },
    // 销毁事件
    beforeDestroy() {
      document.onkeydown = null
    },
    methods: {
      // 绑定enter回车
      bindKeyDownEnter() {
        document.onkeydown = e => {
          const theEvent = e || window.event
          const code = theEvent.keyCode || theEvent.which || theEvent.charCode
          if (parseInt(code) === 13) {
            this.getcontact()
          }
        }
      },
      // 获取联系人列表
      getcontact() {
        axios.post('audit/addressBook', this.postParam).then(res => {
          if (res.data.code === 200) {
            this.contactInfo = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 关闭通讯录
      hideContacts() {
        this.$store.commit('closeCirculation', false)
        this.$store.commit('changeRightWidth', true)
        this.postParam.condition = ''
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.getcontact()
      },
      // 跳转到指定页
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.getcontact()
      },
      // 搜索
      search() {
        this.getcontact()
      }
    },
    watch: {
      'circulation.fetchContact': {
        handler: function (val, oldVal) {
          this.postParam.orderId = this.$route.query.orderId
          this.getcontact()
        },
        // 深度观察
        deep: true
      },
      // 刷新通讯录的内容
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.postParam.orderId = this.$route.query.orderId
          this.getcontact()
        },
        deep: true
      },
      // 清空查询内容
      'circulation.showContacts': {
        handler: function (val, oldVal) {
          if (!val) {
            this.postParam.condition = ''
          }
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .search_wrapper {
    display: flex;
    margin-bottom: 20px;
    .input_box {
      flex: 1;
      margin-right: 15px;
    }
  }
</style>
