<template>
  <el-dialog :visible.sync="userDetailDialogVisible"
             @close="cancel('ruleForm')"
             width="80%">
    <div class="user_base_info" v-if="userInfoPart">
      <p class="tc mb8">
        <img
          :src="userInfoPart.headPicture"
          style="width:100px;height:100px;border-radius:50px">
      </p>
      <p class="tc f24 fw">{{userInfoPart.realName}}</p>
      <p class="tc mt8">{{userInfoPart.blackStr}}</p>
      <p class="tc error" v-show="Number.parseInt(userInfoPart.isBlack) === 1">
        黑名单用户
      </p>
    </div>
    <el-tabs @tab-click="handleClick" type="card" v-if="menuList" v-model="activeName">
      <el-tab-pane v-for="(item, index) in menuList" :key="index"
                   :label="item.label" :name="item.name">
      </el-tab-pane>
    </el-tabs>

    <!--TODO：基本信息-->
    <div
      v-if="existButton[0]"
      style="padding-bottom: 20px">
      <p class="bg_e4 bd_e4"
         style="height:40px;line-height:40px;padding-left:10px;border-bottom: none">账号信息</p>
      <table class="collapse" style="width:100%"
             v-if="userDetailBaseInfoData">
        <tbody>
        <tr class="h30">
          <td class="bd_e4">注册手机号</td>
          <td class="bd_e4">{{userDetailBaseInfoData.mobile}}</td>
          <td class="bd_e4">注册时间</td>
          <td class="bd_e4">{{userDetailBaseInfoData.regTime | dateTime}}</td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">身份证</td>
          <td class="bd_e4">{{userDetailBaseInfoData.idCard}}</td>
          <td class="bd_e4">银行卡号</td>
          <td class="bd_e4">{{userDetailBaseInfoData.bankCardNo}}</td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">开卡银行</td>
          <td class="bd_e4">{{userDetailBaseInfoData.bankName}}</td>
          <td class="bd_e4">银行预留手机号</td>
          <td class="bd_e4">{{userDetailBaseInfoData.bankMobile}}</td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">荷包开户状态</td>
          <td class="bd_e4">{{userDetailBaseInfoData.status}}</td>
          <td class="bd_e4">荷包开户时间</td>
          <td class="bd_e4">{{userDetailBaseInfoData.openTime | dateTime}}</td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">授信额度</td>
          <td class="bd_e4">{{userDetailBaseInfoData.creditAmount | toThousands}}</td>
          <td class="bd_e4">剩余可用额度</td>
          <td class="bd_e4">{{userDetailBaseInfoData.remainCreditAmount | toThousands}}</td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">还款日</td>
          <td class="bd_e4">{{userDetailBaseInfoData.repaymentDate}}</td>
          <td class="bd_e4">邀请码</td>
          <td class="bd_e4">{{userDetailBaseInfoData.inviteCode}}</td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">首次登录时间</td>
          <td class="bd_e4">{{userDetailBaseInfoData.firstLoginTime | dateTime}}</td>
          <td class="bd_e4">昵称</td>
          <td class="bd_e4">{{userDetailBaseInfoData.nickName}}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="existButton[0] && deductionsRemainingTimes"
      style="padding-bottom: 20px">
      <p class="bg_e4 bd_e4"
         style="height:40px;line-height:40px;padding-left:10px;">银行卡（{{deductionsRemainingTimes.bankCardNo}}） 剩余扣款次数</p>
      <el-table style="width: 100%" border :data="deductionsRemainingTimes.resultList">
        <el-table-column label="支付商户" prop="merchant">
        </el-table-column>
        <el-table-column label="支付渠道" prop="channel">
        </el-table-column>
        <el-table-column label="当日扣款（余额不足）剩余次数" prop="dayRemainTimes">
        </el-table-column>
        <el-table-column label="当月扣款（余额不足）剩余次数" prop="monthRemainTimes">
        </el-table-column>
      </el-table>
    </div>


    <!--todo:风控信息-->
    <div style="background: #F9F9F9;padding:15px" v-if="existButton[1]">
      <p class="warning mb4 pt10">所在地信息：</p>
      <table v-if="riskInfo" class="b_collapse mb8 width_100 bd_e4">
        <thead>
        <tr class="bg_e4 h30">
          <td style="width:30%"> 数据项</td>
          <td style="width:35%"> 省</td>
          <td style="width:35%"> 市</td>
        </tr>
        </thead>
        <tbody>
        <tr class="h30">
          <td class="bd_e4">手机号码归属地</td>
          <td class="bd_e4">
               <span v-if="riskInfo.userLoacation">
                     {{riskInfo.userLoacation.mobileprovince}}
                </span>
          </td>
          <td class="bd_e4">
               <span v-if="riskInfo.userLoacation">
                     {{riskInfo.userLoacation.mobilecity}}
                </span>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">IP归属地</td>
          <td class="bd_e4">
               <span v-if="riskInfo.userLoacation">
                   {{riskInfo.userLoacation.ipprovince}}
                </span>
          </td>
          <td class="bd_e4">
               <span v-if="riskInfo.userLoacation">
                   {{riskInfo.userLoacation.ipcity}}
                </span>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4"> GPS定位</td>
          <td class="bd_e4">
               <span v-if="riskInfo.userLoacation">
                      {{riskInfo.userLoacation.gpsprovince}}
                </span>
          </td>
          <td class="bd_e4">
               <span v-if="riskInfo.userLoacation">
                      {{riskInfo.userLoacation.gpscity}}
                </span>
          </td>
        </tr>
        </tbody>
      </table>
      <p class="warning mb4 pt10">设备信息：</p>
      <table v-if="riskInfo" class="b_collapse mb8 width_100 bd_e4">
        <thead>
        <tr class="bg_e4 h30">
          <td style="width:30%"> 数据项</td>
          <td style="width:70%"> 结果</td>
        </tr>
        </thead>
        <tbody>
        <tr class="h30">
          <td class="bd_e4">进件设备-IMEI号-今日申请次数</td>
          <td class="bd_e4">
                <span v-if="riskInfo.deviceInfo">
                     {{riskInfo.deviceInfo.today_IMEI_apcount}}
                </span>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">进件设备-IDFA号-今日申请次数</td>
          <td class="bd_e4">
               <span v-if="riskInfo.deviceInfo">
                     {{riskInfo.deviceInfo.today_IDFA_apcount}}
                </span>
          </td>
        </tr>
        </tbody>
      </table>
      <p class="warning mb4 pt10">通讯录信息：</p>
      <table v-if="riskInfo" class="b_collapse mb8 width_100 bd_e4">
        <thead>
        <tr class="bg_e4 h30">
          <td class="bd_e4" style="width:30%"> 数据项</td>
          <td class="bd_e4" style="width:70%"> 结果</td>
        </tr>
        </thead>
        <tbody>
        <tr class="h30">
          <td class="fw bd_e4">通讯录-全部号码个数</td>
          <td class="bd_e4 fw">
                <span v-if="riskInfo.contactReport">
                    {{riskInfo.contactReport.contacts_count}}
                </span>
          </td>
        </tr>
        <tr class="h30">
          <td class="fw bd_e4">通讯录-手机号个数（去除虚拟号）</td>
          <td class="fw bd_e4">
                <span v-if="riskInfo.contactReport">
                   {{riskInfo.contactReport.contacts_count_available}}
                </span>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-虚拟号个数</td>
          <td class="bd_e4 blue cur">
            <el-popover ref="popover1" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport" size="small"
                        :data="riskInfo.contactReport.virtual_number_list"
                        :height="riskInfo.contactReport.virtual_number_list.length >= 6 ? 350 : ''"
                        border>
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>

            </el-popover>

            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover1 size="small">
              {{riskInfo.contactReport.virtual_number_count}}
            </el-button>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-命中家庭词库号码个数</td>
          <td class="bd_e4 blue cur">
            <el-popover ref="popover2" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport" :data="riskInfo.contactReport.family_countlist"
                        :height="riskInfo.contactReport.family_countlist.length >= 6 ? 350 : ''"
                        border size="small">
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>
            </el-popover>
            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover2 size="small">
              {{riskInfo.contactReport.family_count}}
            </el-button>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-命中亲戚词库号码个数</td>
          <td class="bd_e4 blue cur">
            <el-popover ref="popover3" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport" :data="riskInfo.contactReport.relatives_countlist"
                        :height="riskInfo.contactReport.relatives_countlist.length >= 6 ? 350 : ''"
                        size="small" border>
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>
            </el-popover>
            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover3 size="small">
              {{riskInfo.contactReport.relatives_count}}
            </el-button>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-号码命中内部黑名单-号码总个数</td>
          <td class="bd_e4 blue  cur">
            <el-popover ref="popover4" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport" :data="riskInfo.contactReport.contacts_in_blacklist_list"
                        :height="riskInfo.contactReport.contacts_in_blacklist_list.length >= 6 ? 350 : ''"
                        size="small" border>
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>
            </el-popover>
            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover4 size="small">
              {{riskInfo.contactReport.contacts_in_blacklist}}
            </el-button>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-号码命中内部黑名单-家庭词库号</td>
          <td class="bd_e4 blue  cur">
            <el-popover ref="popover5" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport"
                        :data="riskInfo.contactReport.contacts_in_blacklist_familylist"
                        :height="riskInfo.contactReport.contacts_in_blacklist_familylist.length >= 6 ? 350 : ''"
                        size="small" border>
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>
            </el-popover>
            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover5 size="small">
              {{riskInfo.contactReport.contacts_in_blacklist_family}}
            </el-button>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-号码命中内部黑名单-非家庭词库</td>
          <td class="bd_e4 blue  cur">
            <el-popover ref="popover6" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport"
                        :data="riskInfo.contactReport.contacts_in_blacklist_otherslist"
                        :height="riskInfo.contactReport.contacts_in_blacklist_otherslist.length >= 6 ? 350 : ''"
                        size="small" border>
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>
            </el-popover>
            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover6 size="small">
              {{riskInfo.contactReport.contacts_in_blacklist_others}}
            </el-button>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-命中中性敏感词的个数</td>
          <td class="bd_e4 blue  cur">
            <el-popover ref="popover7" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport"
                        :data="riskInfo.contactReport.cell_in_mid_risk_words_countlist"
                        :height="riskInfo.contactReport.cell_in_mid_risk_words_countlist.length >= 6 ? 350 : ''"
                        size="small" border>
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>
            </el-popover>
            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover7 size="small">
              {{riskInfo.contactReport.cell_in_mid_risk_words_count}}
            </el-button>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">通讯录-命中高危敏感词的个数</td>
          <td class="bd_e4 blue  cur">
            <el-popover ref="popover8" placement="right" trigger="click">

              <el-table v-if="riskInfo.contactReport"
                        :data="riskInfo.contactReport.cell_in_high_risk_words_countlist"
                        size="small" border
                        :height="riskInfo.contactReport.cell_in_high_risk_words_countlist.length >= 6 ? 350 : ''">
                <el-table-column width="150" property="phone" label="号码"></el-table-column>
                <el-table-column width="200" property="name" label="姓名(通讯录匹配)"></el-table-column>
                <el-table-column width="150" property="duration" label="通话时长(分钟)"></el-table-column>
                <el-table-column width="150" property="contactcount" label="通话次数"></el-table-column>
              </el-table>
            </el-popover>
            <el-button v-if="riskInfo.contactReport"
                       class="blue border_no cur p0" v-popover:popover8 size="small">
              {{riskInfo.contactReport.cell_in_high_risk_words_count}}
            </el-button>
          </td>
        </tr>
        </tbody>
      </table>
      <p class="warning mb4 pt10">运营商信息：</p>
      <table v-if="riskInfo" class="b_collapse mb8 width_100 bd_e4">
        <thead>
        <tr class="bg_e4 h30">
          <td style="width:30%"> 数据项</td>
          <td style="width:70%"> 结果</td>
        </tr>
        </thead>
        <tbody>
        <tr class="h30">
          <td class="bd_e4">运营商实名</td>
          <td class="bd_e4">
            <span v-if="riskInfo.carrierport">{{riskInfo.carrierport.name}}</span>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">运营商-有通话记录的号码个数</td>
          <td class="bd_e4">
            <span v-if="riskInfo.carrierport">{{riskInfo.carrierport.operator_call_count}}</span>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">运营商-有通话记录且覆盖通讯录的号码个数</td>
          <td class="bd_e4">
              <span v-if="riskInfo.carrierport">
                {{riskInfo.carrierport.operator_call_count_match_contacts}}
              </span>
          </td>
        </tr>
        <tr class="h30">
          <td class="bd_e4">运营商-平均通话时长（分钟）</td>
          <td class="bd_e4">
              <span v-if="riskInfo.carrierport">
                {{riskInfo.carrierport.operator_call_duration_avg}}
              </span>
          </td>
        </tr>
        </tbody>
      </table>
      <p class="warning mb4 pt10"
         v-if="riskInfo && riskInfo.carrierport && riskInfo.carrierport.top10.length > 0">运营商通话时长排行（前10）：</p>
      <table class="b_collapse mb8 width_100 bd_e4"
             v-if="riskInfo && riskInfo.carrierport && riskInfo.carrierport.top10.length > 0">
        <thead>
        <tr class="bg_e4 h30">
          <td style="width:30%"> 通话时长（分钟）</td>
          <td style="width:20%"> 号码</td>
          <td style="width:25%"> 通话次数</td>
          <td style="width:25%"> 姓名(通讯录匹配)</td>
        </tr>
        </thead>
        <tbody>
        <tr class="h30" v-for="item in riskInfo.carrierport.top10">
          <td class="bd_e4">{{item.duration}}</td>
          <td class="bd_e4">{{item.phone}}</td>
          <td class="bd_e4">{{item.contactcount}}</td>
          <td class="bd_e4">{{item.name}}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!--todo:借款信息-->
    <el-table
      v-if="existButton[2]"
      key="existButton2"
      @expand-change="expandChange"
      :data="userDetailLendData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="tableDataChild"
                    inline class="demo-table-expand"
                    style="width: 100%">
            <el-table-column label="期次" prop="phaseNum">
            </el-table-column>
            <el-table-column label="还款日">
              <template slot-scope="scope">
                <span>{{scope.row.dueDate | date}}</span>
              </template>
            </el-table-column>
            <el-table-column label="期次总金额" prop="repayAmount">
              <template slot-scope="scope">
                <span>{{scope.row.repayAmount | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="待还金额">
              <template slot-scope="scope">
                <span>{{scope.row.waitRepayAmount | toThousands}}</span>
              </template>
            </el-table-column>
            <el-table-column label="逾期天数" prop="overdueDays">
            </el-table-column>
            <el-table-column label="期次状态" prop="state">
              <template slot-scope="scope">
                   <span v-if="fixedField" v-for="item in fixedField.installmentStatus"
                         v-show="scope.row.state === item.statusCode"
                         :style="{color: item.color}">
                     {{item.value}}
                   </span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="放款时间">
        <template slot-scope="scope">
          <span>{{scope.row.releaseTime | dateTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          <span>{{scope.row.amount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="期数" prop="term">
      </el-table-column>
      <el-table-column label="渠道" prop="channelName">
      </el-table-column>
      <el-table-column label="待还金额">
        <template slot-scope="scope">
          <span>{{scope.row.waitRepayAmount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="整笔结清需还">
        <template slot-scope="scope">
          <span>{{scope.row.repayAllNeedAmount | toThousands}}</span>
        </template>
      </el-table-column>
      <el-table-column label="借款状态" prop="status">
        <template slot-scope="scope">
         <span v-if="fixedField" v-for="item in fixedField.loanStatus"
               v-show="scope.row.status === item.statusCode"
               :style="{color: item.color}">
           {{item.value}}
         </span>
        </template>
      </el-table-column>
    </el-table>

    <!--todo:交易记录-->
    <div v-if="existButton[3]">
      <el-table style="width: 100%"
                v-if="transferData"
                key="existButton3"
                :data="transferData.records">
        <el-table-column label="交易时间">
          <template slot-scope="scope">
            <span>{{scope.row.tradTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易类型" prop="tradeType">
        </el-table-column>
        <el-table-column label="交易金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount | toThousands}}</span>
          </template>
        </el-table-column>
        <el-table-column label="商户" prop="merchantStr">
        </el-table-column>
        <el-table-column label="渠道" prop="withholdChannelStr">
        </el-table-column>
        <el-table-column label="状态" prop="state">
        </el-table-column>
        <el-table-column label="交易编号" prop="tradeOrderNo" width="190px">
        </el-table-column>
        <el-table-column label="借款编号" prop="loanOrderNo" width="180px">
        </el-table-column>
        <el-table-column label="支付单号" prop="withholdOrderId" width="190px">
        </el-table-column>
      </el-table>

      <div class="tr pt30 rel" v-if="transferData">
        <el-pagination
          @size-change="recordHandleSizeChange"
          @current-change="recordHandleCurrentChange"
          :current-page.sync="transforDataParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="transforDataParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="transferData.totalrecord"
        >
        </el-pagination>
      </div>
    </div>

    <!--TODO：短信记录-->
    <div v-if="existButton[4]">
      <el-table v-if="messageRecordList" :data="messageRecordList.records"
                key="existButton4"
                border style="width: 100%">
        <el-table-column label="发送时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作人">
        </el-table-column>
        <el-table-column prop="title" label="短信类型">
        </el-table-column>
        <el-table-column prop="content" label="发送内容">
          <template slot-scope="scope">
            <el-popover
              v-show="scope.row.content.length > 12"
              placement="right" title=""
              width="300"
              popper-class="break"
              trigger="hover"
              :content="scope.row.content">
              <span slot="reference" class="cur">{{scope.row.content | minStr12}}</span>
            </el-popover>
            <span v-if="scope.row.content"
                  v-show="scope.row.content.length<=12"
                  class="cur">{{scope.row.content | minStr12}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tr pt30 rel" v-if="messageRecordList">
        <el-pagination
          @size-change="messageHandleSizeChange"
          @current-change="messageHandleCurrentChange"
          :current-page.sync="messageRecordParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="messageRecordParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="messageRecordList.totalrecord"
        >
        </el-pagination>
      </div>
    </div>

    <!--TODO: 登录记录-->
    <div v-if="existButton[5]">
      <el-table style="width: 100%"
                v-if="loginData"
                key="existButton3"
                :data="loginData.records">
        <el-table-column label="登录时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | dateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP地址号" prop="ip">
        </el-table-column>
        <el-table-column label="登录设备" prop="device">
        </el-table-column>
        <el-table-column label="设备系统" prop="os">
        </el-table-column>
        <el-table-column label="APP版本号" prop="appVersion">
        </el-table-column>
        <el-table-column label="RN版本号" prop="rnVersion">
        </el-table-column>
      </el-table>

      <div class="tr pt30 rel" v-if="loginData">
        <el-pagination
          @size-change="loginHandleSizeChange"
          @current-change="loginHandleCurrentChange"
          :current-page.sync="loginDataParam.pageNow"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="loginDataParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="loginData.totalrecord"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import {judgeLimit} from '../../../untils/common'

  export default {
    props: ['userId'],
    data: function () {
      return {
        menuList: [],
        activeName: '1',
        riskInfo: null, // 风控信息
        tableDataChild: [],
        existButton: [false, false, false, false, false, false],
        userInfoPart: {},
        close: false,
        initActiveName: '',
        baseInfoMenuId: 59, // 基本信息
        riskInfoMenuId: 60, // 风控信息
        loanInfoMenuId: 61, // 借款信息
        transferRecord: 103, // 交易记录
        messageRecord: 104, // 短信记录
        loginRecord: 113, // 登录记录
        // v_0.7.2 短信记录
        messageRecordParam: {
          result: 1,
          userId: this.userId, // 用户id
          pageSize: 10, //
          pageNow: 1, //
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'userId' // 排序字段名
        },
        // 交易记录
        transforDataParam: {
          userId: this.userId,
          pageSize: 10,
          pageNow: 1
        },
        // 登录记录
        loginDataParam: {
          userId: this.userId,
          sort: 'desc', // 排序(asc正序，desc倒序)
          sortField: 'userId', // 排序字段名
          pageSize: 10,
          pageNow: 1
        },
        transferData: null, // 交易记录
        loginData: null, // 登录记录
        deductionsRemainingTimes: null // 扣款剩余次数
      }
    },
    computed: {
      ...mapState(['userDetailBaseInfoData', 'fixedField', 'userDetailDialogVisible', 'userDetailLendData', 'messageRecordList']),
      userDetailDialogVisible: {
        get: function () {
          return this.$store.state.userDetailDialogVisible
        },
        set: function () {
        }
      }
    },
    mounted() {
      this.userInfoBasePart()
      // 获取剩余借款次数
      this.judgeLimitCurrent(this.$store.state.setButtonLimitData)
      // 初始化基本信息 银行卡信息
      if (judgeLimit(this.$store.state.setButtonLimitData, 59)) {
        this.userDetailBaseInfo({userId: this.userId})
        this.getUserRemainingTimes()
        return
      }
      // 初始化风控信息
      if (judgeLimit(this.$store.state.setButtonLimitData, 60)) {
        this.getReskDetail()
        return
      }
      // 初始化借款信息
      if (judgeLimit(this.$store.state.setButtonLimitData, 61)) {
        this.userDetailLendInfo({userId: this.userId})
        return
      }
      // 初始化交易记录
      if (judgeLimit(this.$store.state.setButtonLimitData, 103)) {
        this.getTransforRecord()
        return
      }
      // 初始化短信记录
      if (judgeLimit(this.$store.state.setButtonLimitData, 104)) {
        this.getMessageModel(this.messageRecordParam)
      }
      // 初始化登录记录
      if (judgeLimit(this.$store.state.setButtonLimitData, 113)) {
        this.getLoginRecord()
      }
    },
    methods: {
      ...mapActions(['userDetailBaseInfo', 'userDetailLendInfo', 'getMessageModel']),
      // 用户详情的表头
      judgeLimitCurrent(arr) {
        arr.forEach(item => {
          if (item.menuId === 59) {
            this.menuList.push({label: '基本信息', name: '1'})
            this.existButton[0] = true
            this.activeName = '1'
          }
          if (item.menuId === 60) {
            this.menuList.push({label: '风控信息', name: '2'})
            if (!this.existButton[0]) {
              this.activeName = '2'
              this.existButton[1] = true
            }
          }
          if (item.menuId === 61) {
            this.menuList.push({label: '借款信息', name: '3'})
            if (!this.existButton[0] && !this.existButton[1]) {
              this.activeName = '3'
              this.existButton[2] = true
            }
          }
          if (item.menuId === 103) {
            this.menuList.push({label: '交易记录', name: '4'})
            if (!this.existButton[0] && !this.existButton[1] && !this.existButton[2]) {
              this.activeName = '4'
              this.existButton[3] = true
            }
          }
          if (item.menuId === 104) {
            this.menuList.push({label: '短信记录', name: '5'})
            if (!this.existButton[0] && !this.existButton[1] && !this.existButton[2] && !this.existButton[3]) {
              this.activeName = '5'
              this.existButton[4] = true
            }
          }
          if (item.menuId === 113) {
            this.menuList.push({label: '登录记录', name: '6'})
            if (!this.existButton[0] && !this.existButton[1] && !this.existButton[2] && !this.existButton[3] && !this.existButton[4]) {
              this.activeName = '6'
              this.existButton[5] = true
            }
          }
        })
        this.initActiveName = this.activeName
      },
      // 获取风控信息
      getReskDetail() {
        axios.post('user/showUserInfo', {userId: this.userId}).then(res => {
          if (res.data.code === 200) {
            this.riskInfo = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 用户弹框显示剩余扣款次数
      getUserRemainingTimes() {
        axios.post('user/bankRecordList', {userId: this.userId}).then(res => {
          if (res.data.code === 200) {
            this.deductionsRemainingTimes = res.data.body
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取交易记录信息
      getTransforRecord() {
        axios.post('trade/userTrades', this.transforDataParam).then(res => {
          if (res.data.code === 200) {
            this.transferData = res.data.body
          } else {
            throw new Error('获取交易记录数据失败')
          }
        })
      },
      // 登录记录
      getLoginRecord() {
        axios.post('user/loginRecord', this.loginDataParam).then(res => {
          if (res.data.code === 200) {
            this.loginData = res.data.body
          } else {
            throw new Error('获取登录记录数据失败')
          }
        })
      },
      // 用户姓名部分
      userInfoBasePart() {
        axios.post('user/userNameInfo', {userId: this.userId}).then((res) => {
          if (res.data.code === 200) {
            this.userInfoPart = res.data.body
          }
        })
      },
      // 获取分期信息
      expandChange(row, expandedRows) {
        // 每次只能展开一行数据
        if (expandedRows.length > 1) {
          expandedRows.splice(0, 1)
        }
        axios.post('phase/listPhaseByOrderNo', {orderNo: row.orderNo})
          .then(res => {
            if (res.data.code === 200) {
              this.tableDataChild = res.data.body
            } else {
              this.$message.error(res.data.message)
            }
          })
      },
      cancel() {
        this.activeName = this.initActiveName
        this.close = true
        this.$store.commit('setUserDetailDialogTableVisible', false)
        this.$emit('listenChildEvent', 666)
      },
      showWitchDivModule(Arr, i) {
        Arr.forEach((item, index, arr) => {
          if (index === i) {
            arr[index] = true
          } else {
            arr[index] = false
          }
        })
      },
      handleClick(tab, event) {
        if (this.existButton.some(item => {
          return item === true
        })) {
          for (let i = 0; i < this.existButton.length; i++) {
            if (Number.parseInt(this.activeName) === 1) {
              this.showWitchDivModule(this.existButton, 0)
              return
            }
            if (Number.parseInt(this.activeName) === 2) {
              this.showWitchDivModule(this.existButton, 1)
              return
            }
            if (Number.parseInt(this.activeName) === 3) {
              this.showWitchDivModule(this.existButton, 2)
              return
            }
            if (Number.parseInt(this.activeName) === 4) {
              this.showWitchDivModule(this.existButton, 3)
              return
            }
            if (Number.parseInt(this.activeName) === 5) {
              this.showWitchDivModule(this.existButton, 4)
            }
            if (Number.parseInt(this.activeName) === 6) {
              this.showWitchDivModule(this.existButton, 5)
            }
          }
        }
      },
      // 刷新数据
      refreshRrender() {
        this.activeName = this.initActiveName
        this.close = false
        this.userInfoBasePart()
        this.handleClick()
        if (judgeLimit(this.$store.state.setButtonLimitData, 59)) {
          this.userDetailBaseInfo({userId: this.userId})
        } else if (judgeLimit(this.$store.state.setButtonLimitData, 60)) {
          this.getReskDetail()
        } else if (judgeLimit(this.$store.state.setButtonLimitData, 61)) {
          this.userDetailLendInfo({userId: this.userId})
        } else if (judgeLimit(this.$store.state.setButtonLimitData, 103)) {
          this.getTransforRecord()
        } else if (judgeLimit(this.$store.state.setButtonLimitData, 104)) {
          this.getMessageModel(this.messageRecordParam)
        } else if (judgeLimit(this.$store.state.setButtonLimitData, 113)) {
          this.getLoginRecord()
        }
      },
      recordHandleSizeChange(val) {
        this.transforDataParam.pageSize = val
        this.getTransforRecord()
      },
      recordHandleCurrentChange(val) {
        this.transforDataParam.pageNow = val
        this.getTransforRecord()
      },
      messageHandleSizeChange(val) {
        this.messageRecordParam.pageSize = val
        this.getMessageModel(this.messageRecordParam)
      },
      messageHandleCurrentChange(val) {
        this.messageRecordParam.pageNow = val
        this.getMessageModel(this.messageRecordParam)
      },
      loginHandleSizeChange(val) {
        this.loginDataParam.pageSize = val
        this.getLoginRecord()
      },
      loginHandleCurrentChange(val) {
        this.loginDataParam.pageNow = val
        this.getLoginRecord()
      }
    },
    watch: {
      userDetailDialogVisible() {
        if (!this.close) {
          this.refreshRrender()
        }
      },
      userId() {
        this.refreshRrender()
      },
      activeName(val) {
        if (Number.parseInt(val) === 1 && !this.close) {
          this.userDetailBaseInfo({userId: this.userId})
          this.getUserRemainingTimes()
        } else if (Number.parseInt(val) === 2 && !this.close) {
          this.getReskDetail()
        } else if (Number.parseInt(val) === 3 && !this.close) {
          this.userDetailLendInfo({userId: this.userId})
        } else if (Number.parseInt(val) === 4 && !this.close) {
          this.getTransforRecord()
        } else if (Number.parseInt(val) === 5 && !this.close) {
          this.getMessageModel(this.messageRecordParam)
        } else if (Number.parseInt(val) === 6 && !this.close) {
          this.getLoginRecord()
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .user_base_info {
    padding-top: 30px;
    padding-bottom: 10px;
  }

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

  .el-table th {
    background: #E4E4E4 !important;
  }

</style>
