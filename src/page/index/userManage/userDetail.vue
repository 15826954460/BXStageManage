<template>
  <el-card style="width:100%;" class="big_background">
    <h1 class="mb14">用户详情</h1>
    <el-card>
      <h2 class="mb8">基本信息（<span class="warning">用户ID:{{userID}}</span>）</h2>
      <div style="background: #F9F9F9;padding:15px" class="mb14" v-if="userDetail">
        <p v-if="userDetail.userInfo" class="mb8">姓名：{{userDetail.userInfo.realName}}</p>
        <p v-if="userDetail.userInfo" class="mb8">手机号：{{userDetail.userInfo.mobile}}</p>
        <p v-if="userDetail.userInfo" class="mb8">身份证号：{{userDetail.userInfo.idCard}}</p>
      </div>
      <h2 class="mb14">衍生变量</h2>
      <div style="background: #F9F9F9;padding:15px">
        <p class="warning mb4 pt10">所在地信息：</p>
        <table v-if="userDetail" class="b_collapse mb8 width_100 bd_e4">
          <thead>
          <tr class="bg_e4 h30">
            <td style="width:30%"> 数据项 </td>
            <td style="width:35%"> 省 </td>
            <td style="width:35%"> 市 </td>
          </tr>
          </thead>
          <tbody>
          <tr class="h30">
            <td class="bd_e4">手机号码归属地</td>
            <td class="bd_e4">
               <span v-if="userDetail.userLoacation">
                     {{userDetail.userLoacation.mobileprovince}}
                </span>
            </td>
            <td class="bd_e4">
               <span v-if="userDetail.userLoacation">
                     {{userDetail.userLoacation.mobilecity}}
                </span>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">IP归属地</td>
            <td class="bd_e4">
               <span v-if="userDetail.userLoacation">
                   {{userDetail.userLoacation.ipprovince}}
                </span>
            </td>
            <td class="bd_e4">
               <span v-if="userDetail.userLoacation">
                   {{userDetail.userLoacation.ipcity}}
                </span>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4"> GPS定位</td>
            <td class="bd_e4">
               <span v-if="userDetail.userLoacation">
                      {{userDetail.userLoacation.gpsprovince}}
                </span>
            </td>
            <td class="bd_e4">
               <span v-if="userDetail.userLoacation">
                      {{userDetail.userLoacation.gpscity}}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
        <p class="warning mb4 pt10">设备信息：</p>
        <table v-if="userDetail" class="b_collapse mb8 width_100 bd_e4">
          <thead>
          <tr class="bg_e4 h30">
            <td style="width:30%"> 数据项 </td>
            <td style="width:70%"> 结果 </td>
          </tr>
          </thead>
          <tbody>
          <tr class="h30">
            <td class="bd_e4">进件设备-IMEI号-今日申请次数</td>
            <td class="bd_e4">
                <span v-if="userDetail.deviceInfo">
                     {{userDetail.deviceInfo.today_IMEI_apcount}}
                </span>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">进件设备-IDFA号-今日申请次数</td>
            <td class="bd_e4">
               <span v-if="userDetail.deviceInfo">
                     {{userDetail.deviceInfo.today_IDFA_apcount}}
                </span>
            </td>
          </tr>
          </tbody>
        </table>
        <p class="warning mb4 pt10">通讯录信息：</p>
        <table v-if="userDetail" class="b_collapse mb8 width_100 bd_e4">
          <thead>
          <tr class="bg_e4 h30">
            <td class="bd_e4" style="width:30%"> 数据项 </td>
            <td class="bd_e4" style="width:70%"> 结果 </td>
          </tr>
          </thead>
          <tbody>
          <tr class="h30">
            <td class="fw bd_e4">通讯录-全部号码个数</td>
            <td class="bd_e4 fw">
                <span v-if="userDetail.contactReport">
                    {{userDetail.contactReport.contacts_count}}
                </span>
            </td>
          </tr>
          <tr class="h30">
            <td class="fw bd_e4">通讯录-手机号个数（去除虚拟号）</td>
            <td class="fw bd_e4">
                <span v-if="userDetail.contactReport">
                   {{userDetail.contactReport.contacts_count_available}}
                </span>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-虚拟号个数</td>
            <td class="bd_e4 blue cur">
              <el-popover ref="popover1" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport" size="small"
                          :data="userDetail.contactReport.virtual_number_list"
                          :height="userDetail.contactReport.virtual_number_list.length >= 6 ? 350 : ''"
                          border>
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>

              </el-popover>

              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover1 size="small">
                {{userDetail.contactReport.virtual_number_count}}
              </el-button>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-命中家庭词库号码个数</td>
            <td class="bd_e4 blue cur">
              <el-popover ref="popover2" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport" :data="userDetail.contactReport.family_countlist"
                          :height="userDetail.contactReport.family_countlist.length >= 6 ? 350 : ''"
                          border size="small">
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover2 size="small">
                {{userDetail.contactReport.family_count}}
              </el-button>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-命中亲戚词库号码个数</td>
            <td class="bd_e4 blue cur">
              <el-popover ref="popover3" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport" :data="userDetail.contactReport.relatives_countlist"
                          :height="userDetail.contactReport.relatives_countlist.length >= 6 ? 350 : ''"
                          size="small" border>
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover3 size="small">
                {{userDetail.contactReport.relatives_count}}
              </el-button>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-号码命中内部黑名单-号码总个数</td>
            <td class="bd_e4 blue  cur">
              <el-popover ref="popover4" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport" :data="userDetail.contactReport.contacts_in_blacklist_list"
                          :height="userDetail.contactReport.contacts_in_blacklist_list.length >= 6 ? 350 : ''"
                           size="small" border>
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover4 size="small">
                {{userDetail.contactReport.contacts_in_blacklist}}
              </el-button>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-号码命中内部黑名单-家庭词库号</td>
            <td class="bd_e4 blue  cur">
              <el-popover ref="popover5" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport"
                          :data="userDetail.contactReport.contacts_in_blacklist_familylist"
                          :height="userDetail.contactReport.contacts_in_blacklist_familylist.length >= 6 ? 350 : ''"
                          size="small" border>
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover5 size="small">
                {{userDetail.contactReport.contacts_in_blacklist_family}}
              </el-button>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-号码命中内部黑名单-非家庭词库</td>
            <td class="bd_e4 blue  cur">
              <el-popover ref="popover6" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport"
                          :data="userDetail.contactReport.contacts_in_blacklist_otherslist"
                          :height="userDetail.contactReport.contacts_in_blacklist_otherslist.length >= 6 ? 350 : ''"
                          size="small" border>
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover6 size="small">
                {{userDetail.contactReport.contacts_in_blacklist_others}}
              </el-button>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-命中中性敏感词的个数</td>
            <td class="bd_e4 blue  cur">
              <el-popover ref="popover7" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport"
                          :data="userDetail.contactReport.cell_in_mid_risk_words_countlist"
                          :height="userDetail.contactReport.cell_in_mid_risk_words_countlist.length >= 6 ? 350 : ''"
                          size="small" border>
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover7 size="small">
                {{userDetail.contactReport.cell_in_mid_risk_words_count}}
              </el-button>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">通讯录-命中高危敏感词的个数</td>
            <td class="bd_e4 blue  cur">
              <el-popover ref="popover8" placement="right" trigger="click">

                <el-table v-if="userDetail.contactReport"
                          :data="userDetail.contactReport.cell_in_high_risk_words_countlist"
                          size="small" border
                          :height="userDetail.contactReport.cell_in_high_risk_words_countlist.length >= 6 ? 350 : ''">
                  <el-table-column width="150" property="phone" label="号码" ></el-table-column>
                  <el-table-column width="200" property="name" label="姓名(通讯录匹配)" ></el-table-column>
                  <el-table-column width="150" property="duration" label="通话时长(分钟)" ></el-table-column>
                  <el-table-column width="150" property="contactcount" label="通话次数" ></el-table-column>
                </el-table>
              </el-popover>
              <el-button v-if="userDetail.contactReport"
                         class="blue border_no cur p0" v-popover:popover8 size="small">
                {{userDetail.contactReport.cell_in_high_risk_words_count}}
              </el-button>
            </td>
          </tr>
          </tbody>
        </table>
        <p class="warning mb4 pt10">运营商信息：</p>
        <table v-if="userDetail" class="b_collapse mb8 width_100 bd_e4">
          <thead>
          <tr class="bg_e4 h30">
            <td style="width:30%"> 数据项 </td>
            <td style="width:70%"> 结果 </td>
          </tr>
          </thead>
          <tbody>
          <tr class="h30">
            <td class="bd_e4">运营商实名</td>
            <td class="bd_e4">
              <span v-if="userDetail.carrierport">{{userDetail.carrierport.name}}</span>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">运营商-有通话记录的号码个数</td>
            <td class="bd_e4">
              <span v-if="userDetail.carrierport">{{userDetail.carrierport.operator_call_count}}</span>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">运营商-有通话记录且覆盖通讯录的号码个数</td>
            <td class="bd_e4">
              <span v-if="userDetail.carrierport">
                {{userDetail.carrierport.operator_call_count_match_contacts}}
              </span>
            </td>
          </tr>
          <tr class="h30">
            <td class="bd_e4">运营商-平均通话时长（分钟）</td>
            <td class="bd_e4">
              <span v-if="userDetail.carrierport">
                {{userDetail.carrierport.operator_call_duration_avg}}
              </span>
            </td>
          </tr>
          </tbody>
        </table>
        <p class="warning mb4 pt10">运营商通话时长排行（前10）：</p>
        <table class="b_collapse mb8 width_100 bd_e4">
          <thead>
          <tr class="bg_e4 h30">
            <td style="width:30%"> 通话时长（分钟） </td>
            <td style="width:20%"> 号码 </td>
            <td style="width:25%"> 通话次数 </td>
            <td style="width:25%"> 姓名(通讯录匹配) </td>
          </tr>
          </thead>
          <tbody v-if="userDetail && userDetail.carrierport">
            <tr class="h30" v-for="item in userDetail.carrierport.top10">
              <td class="bd_e4">{{item.duration}}</td>
              <td class="bd_e4">{{item.phone}}</td>
              <td class="bd_e4">{{item.contactcount}}</td>
              <td class="bd_e4">{{item.name}}</td>
            </tr>
          </tbody>
        </table>
        <!--<el-table v-if="userDetail && userDetail.carrierport" size="small" tooltip-effect="dark"-->
                  <!--:data="userDetail.carrierport.top10" style="width: 100%">-->
          <!--<el-table-column label="通话时长（分钟）">-->
            <!--<template slot-scope="scope">-->
              <!--{{scope.row.duration}}-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="phone" label="号码">-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="contactcount" label="通话次数">-->
          <!--</el-table-column>-->
          <!--<el-table-column prop="name" label="姓名(通讯录匹配)">-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      </div>
    </el-card>
  </el-card>
</template>

<script>
  import axios from 'axios'

  export default {
    data: function () {
      return {
        userDetail: null,
        userID: this.$route.query.userId
      }
    },
    mounted() {
      this.getUserDetail()
    },
    methods: {
      // 获取用户详情信息
      getUserDetail() {
        axios.post('user/showUserInfo', {userId: this.$route.query.userId}).then(res => {
          if (res.data.code === 200) {
            this.userDetail = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    components: {}
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .width_100 {
    width: 100%;
  }

  .bd_e4 {
    border: 1px solid #e4e4e4;
  }

  .bg_e4 {
    background: #EEF1F6;
  }

  .b_collapse {
    border-collapse: collapse;
  }

  .h30 {
    height: 40px;
    line-height: 40px;
  }

  .border_no {
    border: none;
  }

  .p0 {
    padding: 0 !important;
  }

  /*.has-gutter {*/
  .el-table th {
    background: #E4E4E4 !important;
  }

  /*}*/
</style>
