<template>
  <el-card style="width:100%;" class="big_background">
    <p class="mb14 fw f18">支付渠道</p>
    <el-card class="mb14 box-card" style="width:100%;">
      <el-row :gutter="20" class="mb14">
        <el-col :span="6">
          <span class="label">支付商户:</span>
          <el-select v-model="postParam.merchant" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.payMerchants"
                       :key="item.code"
                       :label="item.value"
                       :value="item.code">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="label">支付渠道:</span>
          <el-select v-model="postParam.paymentChannel" size="small">
            <el-option v-if='fixedField'
                       v-for="item in fixedField.payChannel"
                       :key="item.channelNum"
                       :label="item.channelName"
                       :value="item.channelNum">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <span class="label">银行:</span>
          <el-select v-model="postParam.bankWay" size="small">
            <el-option v-if='openBankList'
                       v-for="(item, index) in openBankList"
                       :key="index"
                       :label="item.bankName"
                       :value="item.bankWay">
            </el-option>
          </el-select>
        </el-col>
      </el-row>


      <div class="tr pr">
        <el-button @click="search" size="small" type="primary">查询</el-button>
        <el-button type="text" @click="clearAll" size="small">清空</el-button>
      </div>
    </el-card>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
        <el-tab-pane v-for="item in menuList" :key="item.name"
                     :label="item.label" :name="item.name"></el-tab-pane>
      </el-tabs>

      <el-table v-if="payChannelListData" :data="payChannelListData.records"
                border style="width: 100%">
        <el-table-column prop="merchant" label="支付商户" >
        </el-table-column>
        <el-table-column prop="paymentChannel" label="支付渠道">
        </el-table-column>
        <el-table-column prop="bankName" label="银行">
        </el-table-column>
        <el-table-column prop="chargeFailTimesDay" label="当日扣款 (余额不足上限)">
        </el-table-column>
        <el-table-column prop="chargeFailTimesMonth" label="当月扣款 (余额不足上限)">
        </el-table-column>
        <el-table-column label="支持绑卡开关">
          <template slot-scope="scope">
            <el-switch
              @change="changeSwitch(scope.row)"
              v-model="scope.row.visible"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </template>
        </el-table-column>

      </el-table>

      <div class="tr pt30 rel" v-if="payChannelListData">
        <p class="total_num">
          共 {{payChannelListData.totalrecord}} 条
        </p>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="postParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="postParam.pageSize"
          layout="sizes, prev, pager, next, jumper"
          :total="payChannelListData.totalrecord"
        >
        </el-pagination>
      </div>
    </el-card>
  </el-card>

</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  export default {
    data: function () {
      return {
        menuList: [
          {label: '已开启', name: '1'},
          {label: '已关闭', name: '0'},
          {label: '所有', name: '-1'}
        ],
        postParam: {
          visible: 1, // 0 关闭  1 开启
          merchant: null, // 支付商户
          paymentChannel: null, // 渠道名称
          bankWay: null,
          pageSize: 10,
          pageNow: 1,
          sort: 'asc', // asc desc
          sortField: 'id'
        },
        updateParam: {
          id: null,
          visibe: null
        },
        // openBankList: [],
        timerTwo: null,
        timerOne: null,
        activeName: '1'
      }
    },
    computed: {
      ...mapState(['payChannelListData', 'fixedField', 'openBankList'])
    },
    mounted() {
      this.payChannelList(this.postParam)
      this.getBankList()
    },
    methods: {
      ...mapActions(['payChannelList', 'getBankList']),
      // 获取银行列表接口
      // getMessageType() {
      //   axios.post('bankWay/list').then(res => {
      //     if (res.data.code === 200) {
      //       res.data.body.unshift({
      //         bankWay: null,
      //         bankName: '全部',
      //         visible: true,
      //         remark: ''
      //       })
      //       this.openBankList = res.data.body
      //     }
      //   })
      // },
      clearAll() {
        let param = this.postParam
        for (let key in param) {
          if (key !== 'pageSize' &&
            key !== 'pageNow' &&
            key !== 'visible' &&
            key !== 'sort' && key !== 'sortField') {
            param[key] = null
          }
        }
      },
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.visible = parseInt(this.activeName)
        } else {
          this.postParam.visible = null
        }
        // this.$store.commit('setPayChannelList', [])
        this.payChannelList(this.postParam)
        this.postParam.pageNow = 1
      },
      search() {
        this.payChannelList(this.postParam)
      },
      handleSizeChange(val) {
        this.postParam.pageSize = val
        this.payChannelList(this.postParam)
      },
      handleCurrentChange(val) {
        this.postParam.pageNow = val
        this.payChannelList(this.postParam)
      },
      // 修改分配案件接口
      async updateConfig() {
        axios.post('payRouter/updateVisible', this.updateParam).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.timerOne = setTimeout(() => {
              this.payChannelList(this.postParam)
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
      // 修改权限
      changeSwitch(row) {
        this.timerTwo = null
        this.updateParam.visible = Number.parseInt(row.visible)
        this.updateParam.id = Number.parseInt(row.id)
        this.updateConfig()
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../../style/filterStyle';

  .total_num {
    position: absolute;
    left: 0;
    bottom: 0;
  }
</style>
