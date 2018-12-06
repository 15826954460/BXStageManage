<template>
  <el-card class="box-card big_background" style="width:100%;">
    <div class="top">
      <h1 class="mb14" v-html="parseInt(type) === 2 ? '借款审批' : '授信审批'"></h1>
      <p class="mb14"><span class="yellow">审核建议：</span>全流程审核</p>
      <p v-show="parseInt(type) === 1" class="mb14">
        <span class="yellow">额度评估：{{creditAmount | toThousands}}</span>
      </p>
      <div class="btn_wrapper">
        <button-wraper :ApprovalRecordMenuId="ApprovalRecordMenuId"></button-wraper>
      </div>
    </div>

    <el-row :gutter="10" style="width:100%;" class="box-wrapper">
      <!--:span="circulation.rightWidth ? 24 : 16"-->
      <el-col class="left-span mr24">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
            <el-tab-pane label="基本信息" name="1"></el-tab-pane>
            <el-tab-pane label="外部数据" name="2"></el-tab-pane>
            <el-tab-pane
              :label="parseInt(type) === 1 ? '历史授信记录' : '历史订单'" name="3">
            </el-tab-pane>
          </el-tabs>
          <!--todo:基本信息-->
          <el-row :gutter="10" style="width:100%;"
                  v-show="parseInt(activeName) === 1">
            <el-col :span="8">
              <!--TODO: 用户信息-->
              <user-info :type="type" :orderId="orderId"
                         @sendUserInfo="sendUserInfo"></user-info>
              <!--TODO: 额度信息-->
              <credit-account :type="type" :orderId="orderId"></credit-account>
              <!--TODO: 紧急联系人-->
              <emergency-contact :type="type" :orderId="orderId"></emergency-contact>
              <!--TODO: 公司信息-->
              <company-info :type="type" :orderId="orderId"></company-info>
              <!--TODO: 补充信息-->
              <additional :type="type" :orderId="orderId"></additional>

            </el-col>

            <el-col :span="16">

              <el-row :span="24" class="mb14" :gutter="10">
                <el-col :span="12">
                  <!--TODO:订单信息-->
                  <order-info :type="type" :orderId="orderId"></order-info>
                </el-col>
                <el-col :span="12">
                  <!--TODO:风险信息-->
                  <risk-info :type="type" :orderId="orderId"></risk-info>
                </el-col>
              </el-row>

              <el-row :span="24">
                <!--TODO:照片材料-->
                <photo-material></photo-material>
              </el-row>

              <el-row :span="24">

              </el-row>

            </el-col>

            <el-col>
              <p class="f20 fw mb14">订单记录</p>

              <el-tabs v-model="activeNameInsert" @tab-click="handleClickInsert" type="card">
                <el-tab-pane v-for="item in menuList" :key="item.index"
                             v-if="(item.menuId && buttonQuit(item.menuId) || !item.menuId)"
                             :label="item.label" :name="item.name"></el-tab-pane>
              </el-tabs>

              <!--TODO: 备注记录-->
              <div v-if="Number.parseInt(activeNameInsert) === 1">
                <remark-records
                  :showAddRemark="false"
                  :RemarkRecordMenuId="RemarkRecordMenuId"
                  :type="type" :orderId="orderId"></remark-records>
              </div>

              <!--TODO:审批记录-->
              <div v-if="Number.parseInt(activeNameInsert) === 2">
                <aduit-records
                  :orderId="orderId"
                  :ApprovalRecordMenuId="ApprovalRecordMenuId"></aduit-records>
              </div>

              <div>
                <!--TODO:命中规则码-->
                <engineRules
                  v-if="Number.parseInt(activeNameInsert) === 3"
                  :orderId="orderId"
                ></engineRules>
              </div>
            </el-col>

          </el-row>

          <!--todo:外部数据-->
          <el-row :gutter="10" style="width:100%;">
            <externalData :orderId="orderId" :type="type"
                          v-if="parseInt(activeName) === 2"></externalData>
          </el-row>

          <!--todo:历史借款记录-->
          <el-row :gutter="10" style="width:100%;">
            <historyCreditRecord :orderId="orderId" :type="type" @baseInfo="baseInfo"
                                 v-if="parseInt(activeName) === 3"></historyCreditRecord>
          </el-row>
        </el-card>
      </el-col>

      <el-col v-if="circulation" class="right-span"
              :class="{defaultWidth: !circulation.rightWidth, noWidth: circulation.rightWidth}">
        <!--:span="circulation.rightWidth ? 0 : 8"-->
      </el-col>

      <div class="circulation_wrapper">
        <!-- TODO:通讯录 -->
        <transition name="common-slide" mode="out-in">
          <contacts :orderId="orderId"></contacts>
        </transition>
        <!-- todo:发送短信 -->
        <transition name="common-slide" mode="out-in">
          <sms></sms>
        </transition>
        <!-- todo:备注 -->
        <transition name="common-slide" mode="out-in">
          <vremark :orderId="orderId" :channelName="AuditInfo.channel"></vremark>
        </transition>
        <!--todo:通过 -->
        <transition name="common-slide" mode="out-in">
          <vpass></vpass>
        </transition>
        <!-- todo：流转 -->
        <transition name="common-slide" mode="out-in">
          <vcirculation></vcirculation>
        </transition>
      </div>
    </el-row>

  </el-card>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import remarkRecords from '../../components/remarkRecords.vue'
  import aduitRecords from '../../components/aduitRecords.vue'
  import engineRules from '../../components/engineRules.vue'
  import contacts from '../../components/contacts.vue'
  import userInfo from './letterComponents/userInfo.vue'
  import companyInfo from './letterComponents/companyInfo.vue'
  import additional from './letterComponents/additional.vue'
  import orderInfo from './letterComponents/orderInfo.vue'
  import riskInfo from './letterComponents/riskInfo.vue'
  import emergencyContact from './letterComponents/emergencyContact.vue'
  import photoMaterial from './photo.vue'
  import creditAccount from './letterComponents/creditAccount.vue'
  import vremark from './circulation/remark'
  import vpass from './circulation/pass.vue'
  import sms from './circulation/sendSms.vue'
  import vcirculation from './circulation/circulation.vue'
  import historyCreditRecord from './historyCreditRecord.vue'
  import buttonWraper from './btnComponents/button.vue'
  import externalData from './externalData.vue'
  import {judgeLimit} from '../../untils/common'

  export default {
    data: function () {
      return {
        menuList: [
          {
            label: '备注记录',
            name: '1',
            menuId: Number.parseInt(this.$route.query.RemarkRecordMenuId)
          },
          {
            label: '审批记录',
            name: '2',
            menuId: Number.parseInt(this.$route.query.ApprovalRecordMenuId)
          },
          {
            label: '引擎规则命中记录',
            name: '3',
            menuId: null
          }
        ],
        AuditInfo: {
          channel: '融360'
        },
        creditAmount: '', // 额度评估
        orderId: this.$route.query.orderId,
        type: this.$route.query.type,
        userId: this.$route.query.userId,
        showBtn: true,
        activeName: '1',
        activeNameInsert: null,
        updateOperationShow: false, // 修改资料
        codeTypeOptions: null, // 流转码的类型
        // 紧急联系人 || 公司 || 地址对比  接口参数
        commonParam: {
          orderId: this.$route.query.orderId
        },
        initActiveName: '',
        existButton: [false, false, true],
        goHistory: this.$route.query.goHistory,
        ApprovalRecordMenuId: Number.parseInt(this.$route.query.ApprovalRecordMenuId), // 审批记录
        RemarkRecordMenuId: Number.parseInt(this.$route.query.RemarkRecordMenuId) // 备注记录
      }
    },
    components: {
      userInfo,
      companyInfo,
      additional,
      remarkRecords,
      engineRules,
      orderInfo,
      riskInfo,
      aduitRecords,
      photoMaterial,
      creditAccount,
      contacts,
      vremark,
      vpass,
      sms,
      vcirculation,
      historyCreditRecord,
      externalData,
      buttonWraper,
      emergencyContact
    },
    computed: {
      ...mapState(['fixedField', 'circulation'])
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 防止刷新出现的流转信息
      if (this.$route.query.closeCirculation === 'false') {
        this.$store.commit('isShowBtn', false)
        this.$store.commit('closeCirculation', false)
        this.$store.commit('changeRightWidth', true)
      }
    },
    methods: {
      ...mapActions(['getLetterRecordsList', '']),
      buttonLimit() {
        // 解决异步数据渲染不够同步的问题 （获取到数据之后再对页面进行渲染） 用户权限接口
        axios.post('security/userButton').then((res) => {
          if (res.data.code === 200) {
            if (this.buttonQuitTwo(res.data.body, Number.parseInt(this.RemarkRecordMenuId))) {
              this.activeNameInsert = '1'
            } else if (this.buttonQuitTwo(res.data.body, Number.parseInt(this.ApprovalRecordMenuId))) {
              this.activeNameInsert = '2'
            } else {
              this.activeNameInsert = '3'
            }
          }
        })
      },
      buttonQuit(val) {
        return judgeLimit(this.$store.state.setButtonLimitData, val)
      },
      buttonQuitTwo(res, val) {
        return judgeLimit(res, val)
      },
      // 切换tab
      handleClick(tab, event) {
        this.$store.commit('changeTabType', Number.parseInt(this.activeName))
      },
      handleClickInsert() {
        this.$store.commit('changeTabTypeInsert', Number.parseInt(this.activeNameInsert))
      },
      baseInfo(val) {
        this.activeName = val
      },
      sendUserInfo(val) {
        this.creditAmount = val
      }
    },
    watch: {
      'circulation.refreshAgain': {
        handler: function (val, oldVal) {
          this.type = this.$route.query.type
        },
        deep: true
      },
      'circulation.tabType': {
        handler: function (val, oldVal) {
          if (this.circulation.tabType === 1) {
            this.activeName = this.circulation.tabType + ''
          }
        },
        deep: true
      },
      'circulation.changeTabTypeInsert': {
        handler: function (val, oldVal) {
          if (this.circulation.changeTabTypeInsert === 1) {
            this.activeNameInsert = this.circulation.changeTabTypeInsert + ''
          }
        },
        deep: true
      },
      '$route'(to, from) {
        console.log(this.initActiveName)
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import '../../style/animate';

  .box-card {
    .animate;
  }

  .top {
    position: relative;
    .btn_wrapper {
      position: absolute;
      right: 20px;
      bottom: 0;
    }
  }

  .defaultWidth {
    width: 550px
  }

  .noWidth {
    width: 0;
  }

  .right-span,
  .left-span {
    transition: width .5s linear;
  }

  .right-span {
    min-height: 100vh;
  }

  .left-span {
    flex: 1;
  }

  .circulation_wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 550px;
    z-index: 10;
  }

  .box-wrapper {
    display: flex;
  }
</style>
