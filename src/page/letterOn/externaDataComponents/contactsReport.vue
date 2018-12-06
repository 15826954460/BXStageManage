<template>
  <el-card :gutter="10" style="width:100%;" class="mb14">
    <div slot="header" class="clearfix">
      <span class="fw f20">通讯录</span>
    </div>
    <div v-if="contactsInfo">
      <p class="pb10">虚拟号码个数：
        <el-popover ref="popover1" placement="right" trigger="click">
          <el-table :data="contactsInfo.virtual_number_list" border size="small"
                    :height="contactsInfo.virtual_number_list.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover1 size="small">
          {{contactsInfo.virtual_number_count}}
        </el-button>
      </p>
      <p class="pb10">命中币下黑名单号码个数：
        <el-popover ref="popover7" placement="right" trigger="click">
          <el-table :data="contactsInfo.contacts_in_blacklist_list" border size="small"
                    :height="contactsInfo.contacts_in_blacklist_list.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover7 size="small">
          {{contactsInfo.contacts_in_blacklist}}
        </el-button>
      </p>
      <p class="pb6">号码命中内部黑名单-家庭词库号码个数：
        <el-popover ref="popover2" placement="right" trigger="click">
          <el-table :data="contactsInfo.contacts_in_blacklist_familylist" border size="small"
                    :height="contactsInfo.contacts_in_blacklist_familylist.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover2 size="small">
          {{contactsInfo.contacts_in_blacklist_family}}
        </el-button>
      </p>
      <p class="pb6">号码命中内部黑名单-非家庭词库号码个数：
        <el-popover ref="popover3" placement="right" trigger="click">
          <el-table :data="contactsInfo.contacts_in_blacklist_otherslist" border  size="small"
                    :height="contactsInfo.contacts_in_blacklist_otherslist.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover3 size="small">
          {{contactsInfo.contacts_in_blacklist_others}}
        </el-button>
      </p>
      <p class="pb10 pt8">命中高危敏感词库号码个数：
        <el-popover ref="popover8" placement="right" trigger="click">
          <el-table :data="contactsInfo.cell_in_high_risk_words_countlist" border size="small"
                    :height="contactsInfo.cell_in_high_risk_words_countlist.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover8 size="small">
          {{contactsInfo.cell_in_high_risk_words_count}}
        </el-button>
      </p>
      <p class="pb6">命中中性敏感词库号码个数：
        <el-popover ref="popover4" placement="right" trigger="click">

          <el-table :data="contactsInfo.cell_in_mid_risk_words_countlist" border size="small"
                    :height="contactsInfo.cell_in_mid_risk_words_countlist.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover4 size="small">
          {{contactsInfo.cell_in_mid_risk_words_count}}
        </el-button>
      </p>
      <p class="pb6">命中家庭词库号码个数：
        <el-popover ref="popover5" placement="right" trigger="click">
          <el-table :data="contactsInfo.family_countlist" border size="small"
                    :height="contactsInfo.family_countlist.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover5 size="small">
          {{contactsInfo.family_count}}
        </el-button>
      </p>
      <p>命中亲戚词库号码个数：
        <el-popover ref="popover6" placement="right" trigger="click">
          <el-table :data="contactsInfo.relatives_countlist"
                    border size="small"
                    :height="contactsInfo.relatives_countlist.length > 6 ? 350 : ''">
            <el-table-column width="150" property="phone" label="号码" ></el-table-column>
            <el-table-column width="100" property="name" label="姓名" ></el-table-column>
            <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
            <el-table-column width="100" property="contactcount" label="次数" ></el-table-column>
          </el-table>
        </el-popover>
        <el-button class="blue border_no cur" v-popover:popover6 size="small">
          {{contactsInfo.relatives_count}}
        </el-button>
      </p>
    </div>
  </el-card>
</template>
<script>
  import axios from 'axios'
  import {mapState} from 'vuex'
  export default {
    data: function () {
      return {
        creditOrderNo: this.$route.query.orderId,
        type: 1,
        contactsInfo: ''
      }
    },
    computed: {
      ...mapState(['circulation'])
    },
    mounted() {
      this.getInfoContact()
    },
    methods: {
      // 获取通讯录报告的初始数据
      getInfoContact() {
        axios.post('dataplatform/fetchDeriveData', {
          creditOrderNo: this.creditOrderNo,
          type: this.type
        }).then(res => {
          if (res.data.code === 200) {
            this.contactsInfo = res.data.body
          }
        })
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.creditOrderNo = this.$route.query.orderId
          this.getInfoContact()
        },
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .border_no {
    border: none;
  }
</style>
