<template>
  <div>
    <p class="fw mb14 f20">号码库</p>
    <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
      <el-tab-pane v-for="item in menuList" :key="item.index"
                   :label="item.label" :name="item.name"></el-tab-pane>
    </el-tabs>
    <div v-show="activeName === '1'">
      <div class="search_wrapper">
        <el-input type="text" placeholder="请输入查询内容"
                  v-model="postParamPhone.condition"
                  class="input_box" size="small"></el-input>
        <el-button type="primary" @click="search" size="small">查询</el-button>
      </div>

      <el-table v-if="phoneList && phoneList.records"
                :data="phoneList.records" border>
        <el-table-column prop="realName" label="姓名">
        </el-table-column>
        <el-table-column label="号码">
          <template slot-scope="scope">
            <span class="blue cur"
                  @click="collectionRecord(5, scope.row)">{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="tr pt30" v-if="phoneList">
        <el-pagination background
                       @current-change="handleCurrentChange"
                       @size-change="handleSizeChange"
                       :current-page="postParamPhone.pageNow"
                       :page-size="postParamPhone.pageSize"
                       layout="total, prev, pager, next, jumper"
                       :total="phoneList.totalrecord">
        </el-pagination>
      </div>
    </div>

    <div v-show="activeName === '2'">
      <el-table v-if="contactLong"
                :data="contactLong" border>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column label="号码">
          <template slot-scope="scope">
            <span class="blue cur"
                  @click="collectionRecord(6, scope.row)">{{scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="通话时长(分钟)" width="180px">
        </el-table-column>
      </el-table>
      <p class="gray pt10">注：取自运营商通话数据</p>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'

  export default {
    data: function () {
      return {
        menuList: [
          {label: '通讯录', name: '1'},
          {label: '通话最长', name: '2'}
        ],
        postParamPhone: {
          condition: '', // 搜索条件
          userId: this.$route.query.userId, // 用户id
          pageSize: 12,
          pageNow: 1
        },
        formData: {}, // 表单数据
        activeName: '1',
        phoneList: {}, // 号码库
        contactLong: [] // 通话最长
      }
    },
    computed: {
      ...mapState(['collectionType', 'caseSpeedData'])
    },
    mounted() {
      this.getPhoneList(this.postParamPhone)
      this.bindKeyDownEnter()
      // 案件进度等信息
      this.caseSpeed({userId: this.$route.query.userId})
    },
    // 销毁事件
    beforeDestroy() {
      document.onkeydown = null
    },
    methods: {
      ...mapActions(['caseSpeed']),
      // 绑定enter回车
      bindKeyDownEnter() {
        document.onkeydown = e => {
          const theEvent = e || window.event
          const code = theEvent.keyCode || theEvent.which || theEvent.charCode
          if (parseInt(code) === 13) {
            this.getPhoneList(this.postParamPhone)
          }
        }
      },
      // 通话列表
      async getPhoneList(data) {
        axios.post('user/addressBook', data).then(res => {
          if (res.data.code === 200) {
            this.phoneList = res.data.body
          }
        })
      },
      // 通话最长
      async getContactLong() {
        axios.post('dataplatform/topTenCallRecords', {userId: this.$route.query.userId}).then(res => {
          if (res.data.code === 200) {
            this.contactLong = res.data.body
          }
        })
      },
      // 写催记 获取数据
      collectionRecord(type, row) {
        this.formData.caseId = this.caseSpeedData.caseId
        this.formData.caseState = this.caseSpeedData.caseState
        this.$store.commit('setCollectionType', !this.collectionType)
        if (type === 5) {
          this.formData.name = row.realName
          this.formData.relation = '通讯录号码'
          this.formData.phone = row.mobile
        }
        if (type === 6) {
          this.formData.name = row.name
          this.formData.relation = '运营商号码'
          this.formData.phone = row.phone
        }
        this.$store.commit('showDialogTableVisible', true)
        this.$store.commit('setFormData', this.formData)
      },
      handleClick(tab, event) {
        if (this.activeName === '1') {
          this.getPhoneList(this.postParamPhone)
        }
        if (this.activeName === '2') {
          this.postParamPhone.condition = ''
          this.getContactLong({userId: this.$route.query.userId})
        }
        this.postParamPhone.pageNow = 1
      },
      handleCurrentChange(val) {
        this.postParamPhone.pageNow = val
        this.getPhoneList(this.postParamPhone)
      },
      handleSizeChange(val) {
        this.postParamPhone.pageSize = val
        this.getPhoneList(this.postParamPhone)
      },
      search() {
        this.getPhoneList(this.postParamPhone)
      }
    }
  }
</script>

<style scoped lang="less">
  .search_wrapper {
    display: flex;
    margin-bottom: 20px;
    .input_box {
      flex: 1;
      margin-right: 15px;
    }
  }

  .gray {
    color: rgb(135, 135, 135)
  }
</style>
