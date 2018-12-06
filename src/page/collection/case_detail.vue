<template>
  <el-card style="width:100%;" class="big_background">
    <h1 class="mb14 fw">案件详情</h1>
    <p><span>催收进度：</span><span v-if="caseSpeedData">{{caseSpeedData.dunStateName}}</span></p>
    <p><span>案件状态：</span><span v-if="caseSpeedData">{{caseSpeedData.caseStateName}}</span></p>
    <p class="rel">
      <span>催收员：</span><span v-if="caseSpeedData">{{caseSpeedData.operator}}</span>
      <el-button type="primary" @click="sendMessage"
                 size="mini" class="abs cur" v-show="showMessageMenuId"
                 style="right:5px; bottom: 10px">发短信
      </el-button>
    </p>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-row :gutter="20">
            <el-col :span="12" class="mb14">
              <div class="grid-content bg-purple">
                <p style="display: flex;justify-content: space-between;align-items: center"
                   class="mb14">
                  <span class="fw f20">用户信息</span>
                  <el-button @click="dialogFormVisible=true" class="blue">查看照片</el-button>
                </p>
                <div v-if="userInfo" style="background: rgb(247,248,247)" class="pd10">
                  <p class="mb8"><span>姓名：{{userInfo.realName}}</span></p>
                  <p class="mb8"><span>身份证号：{{userInfo.idCard}}</span></p>
                  <p class="mb8">
                    <span>手机号：</span>
                    <span class="blue cur" @click="collectionRecord(1)">{{userInfo.phone}}</span>
                  </p>
                  <p class="mb8"><span>性别：{{userInfo.sex}}</span></p>
                  <p class="mb8"><span>年龄：{{userInfo.age}}</span></p>
                  <p class="mb8"><span>现居住地址：{{userInfo.addrDetail}}</span></p>
                  <p class="mb8">
                    <span>银行卡：{{userInfo.bankCardNo}} ({{userInfo.bankName}})</span>
                  </p>
                </div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="grid-content bg-purple" v-if="companyInfo">
                <p class="mb14" style="display: flex;align-items: center;position:relative;height:30px;">
                  <span class="fw f20">紧急联系人/公司信息</span>
                </p>
                <div style="background: rgb(247,248,247)" class="pd10">
                  <p class="mb8"><span>紧急联系人-关系：{{companyInfo.contract1ARelationship}}</span></p>
                  <p class="mb8"><span>紧急联系人-姓名：{{companyInfo.contract1AName}}</span></p>
                  <p class="mb8">
                    <span>紧急联系人-手机号：</span>
                    <span @click="collectionRecord(2)" class="blue cur">
                        {{companyInfo.contract1ANumber}}
                    </span>
                  </p>
                  <p class="mb8"><span>公司名称：{{companyInfo.companyName}}</span></p>
                  <p class="mb8">
                    <span>公司电话：</span>
                    <span class="blue cur" @click="collectionRecord(3)">{{companyInfo.companyTel}}</span>
                  </p>
                  <p class="mb8"><span>公司地址：{{companyInfo.companyAddr}}</span></p>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <p class="fw mb14 f20 rel">
                逾期信息
                <el-button class="abs blue" style="right:0"
                           v-show="showAllLendingMenuId"
                           @click="goToUserDetail()">所有借款
                </el-button>
              </p>
              <ul class="mb14 pd10" v-if="overTimeInfo"
                  style="background: rgb(247,248,247);display:flex;justify-content: center">
                <li style="flex:1;justify-content: center">
                  <ul style="display: flex;justify-content: center">
                    <li class="tc" style="flex: 1">
                      <p class="mb8 pt8">逾期中期次</p>
                      <p class="f24" v-html="overTimeInfo.overDuePhaseNum ? overTimeInfo.overDuePhaseNum : 0"></p>
                    </li>
                    <li style="flex: 1;" class="tc"
                        :class="{gray_border_right: (overTimeInfo.repayPhaseNum && overTimeInfo.repayAmount)}">
                      <p class="mb8 pt8">逾期中金额</p>
                      <p class="f24">{{overTimeInfo.overDueAmount | toThousands}}</p>
                    </li>
                  </ul>
                </li>
                <li style="flex:1" v-if="overTimeInfo.repayPhaseNum && overTimeInfo.repayAmount">
                  <ul style="display: flex">
                    <li style="flex: 1" class="tc">
                      <p class="mb8 pt8">还款中期次</p>
                      <p class="f24">{{overTimeInfo.repayPhaseNum}}</p>
                    </li>
                    <li class="mb8 tc" style="flex: 1">
                      <p class="mb8 pt8">还款中金额</p>
                      <p style="color: #F9D664" class="f24">{{overTimeInfo.repayAmount | toThousands}}</p>
                    </li>
                  </ul>
                </li>
              </ul>
            </el-col>
          </el-row>

          <el-row>
            <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
              <el-tab-pane v-for="item in menuList" :key="item.index"
                           :label="item.label" :name="item.name"></el-tab-pane>
            </el-tabs>
            <!--todo:期次列表-->
            <el-table v-if="caseDataOverDueList"
                      :height="caseDataOverDueList.length > 5 ? 250 : ''"
                      :data="caseDataOverDueList" border style="width: 100%" class="mb14">
              <el-table-column prop="channelName" label="渠道">
              </el-table-column>
              <el-table-column prop="loanOrderNo" label="借款编号" width="180px">
              </el-table-column>
              <el-table-column prop="phaseName" label="期次名称" width="120px">
              </el-table-column>
              <el-table-column label="还款日" width="120px">
                <template slot-scope="scope">
                  <span>{{scope.row.repayDay | date}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="amount" label="期次总金额" width="120px">
                <template slot-scope="scope">
                  <span>{{scope.row.amount | toThousands}}</span>
                </template>
              </el-table-column>
              <el-table-column label="待还金额" width="120px">
                <template slot-scope="scope">
                  <span>{{scope.row.waitRepayAmount | toThousands}}</span>
                </template>
              </el-table-column>
              <el-table-column label="逾期天数" prop="overdueDays" width="120px">
              </el-table-column>
              <el-table-column label="期次状态">
                <template slot-scope="scope">
                  <span v-for="item in periodStatus" :style="{color: item.color}"
                        v-show="Number.parseInt(scope.row.phaseState) === item.code">
                  {{item.value}}
                  </span>
                </template>
              </el-table-column>
              <!--v-if="Number.parseInt(activeName) === 0"-->
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <span @click="deductions(scope.row)"
                        class="cur"
                        :class="{ blue: scope.row.visible, gray: !scope.row.visible}"
                        v-show="showDeductionsMenuId && Number.parseInt(activeName) === 0">单期还款</span>
                </template>
              </el-table-column>
            </el-table>
          </el-row>

          <el-row>
            <!--TODO：接口暂时未定义-->
            <p class="fw mb14 f20 mt20">催收记录</p>
            <el-table v-if="collectionRecords"
                      :height="collectionRecords.length > 5 ? 250 : ''"
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
                  <span class="blue cur"
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
          </el-row>

        </el-col>
        <el-col :span="8">
          <phoneLibrary></phoneLibrary>
        </el-col>
      </el-row>
    </el-card>

    <!--todo: 写催记-->
    <contactRecords>
    </contactRecords>

    <el-dialog title="查看大图" :visible.sync="dialogFormVisible"
               width="80%" class="dialogStyle">
      <h4>选择图片</h4>
      <ul class="smallPicList">
        <li v-for="(item,index) in pageCutIndex(10,maxImageIndex)"
            @click="choiceImage(index)">
          <img :src="item.url" alt="">
          <p v-show="isInArray(index) !== false">
            <span class="iconfont">&#xe631;</span>
          </p>
        </li>
      </ul>

      <el-pagination small class="maxImage" layout="prev, pager, next"
                     :page-size="10" :total="allTotalpage"
                     @current-change="maxImagePageChange"></el-pagination>

      <div style="clear:both">
        <h4>放大图片</h4>
        <div ref="picContent">
          <photoDetails
            v-for="(item,index) in bigImgArray" :key="index"
            :typeName="returnPicName(item)"
            :url="item">
          </photoDetails>
        </div>
        <!---->
      </div>
    </el-dialog>

    <el-dialog :visible.sync="sendMessageDialogVisible" width="600px">
      <el-form :model="sendMessageParams" label-width="100px" class="pt10"
               ref="sendMessageParams">
        <el-form-item label="短信内容:">
          <el-input type="textarea" v-model="sendMessageParams.content"
                    :disabled="true" :rows="5"></el-input>
        </el-form-item>
        <el-form-item class="tr">
          <el-button @click="cancelSendMessage" size="small">取消</el-button>
          <el-button @click="onSubmit" size="small" type="primary">发送</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <backone :casePage="true"></backone>

    <userDetailDialog :userId="userId" v-if="isShowDetail"></userDetailDialog>
  </el-card>
</template>

<script>
  import axios from 'axios'
  import {mapState, mapActions} from 'vuex'
  import phoneLibrary from './components/phoneLibrary'
  import contactRecords from './components/contactRecords'
  import Viewer from 'viewerjs'
  import photoDetails from '../../components/photoDetails'
  import userDetailDialog from '../index/userManage/userDetailDialog'
  import backone from '../../components/backOneMoney.vue'
  import {judgeLimit} from '../../untils/common'

  export default {
    data: function () {
      return {
        operator: this.$route.query.operator, // 催收人
        caseState: this.$route.query.caseState, // 案件状态
        dunState: Number.parseInt(this.$route.query.dunState) === 1 ? '催收中' : '已摧回', // 催收进度
        // 期次状态
        periodStatus: [
          {value: '逾期中', code: 0, color: '#FF0000'},
          {value: '还款中', code: 1, color: '#F9D664'},
          {value: '已还清', code: 2, color: '#67c23a'}
        ],
        menuList: [
          {label: '逾期中', name: '0'},
          {label: '还款中', name: '1'},
          {label: '已还清', name: '2'},
          {label: '所有', name: '-1'}
        ],
        userInfo: null, // 用户信息
        companyInfo: null, // 公司信息
        // overTimeInfo: null, // 逾期信息
        // 期次列表参数
        postParam: {
          userId: this.$route.query.userId,
          type: 0 // tab类型
        },
        formData: {}, // 表单数据
        showDialogTableVisible: true,
        activeName: '0',
        // collectionType: false,
        // 和图片有关的参数
        dialogFormVisible: false,
        dialogIsFirstShow: true,
        photoList: [],
        maxPicIndexArray: [0, 1, 2],
        Viewers: null,
        minImageIndex: 1,
        maxImageIndex: 1,
        sendMessageDialogVisible: false,
        sendMessageParams: {
          userId: null,
          content: ''
        },
        userId: this.$route.query.userId,
        isShowDetail: false,
        sendMessageMenuId: 93, // 发短信
        allLendingMenuId: 94, // 所有借款
        deductionsMenuId: 95 // 扣款
      }
    },
    components: {
      phoneLibrary, contactRecords, photoDetails, userDetailDialog, backone
    },
    computed: {
      ...mapState(['fixedField', 'caseDataOverDueList', 'collectionRecords', 'collectionType', 'caseSpeedData', 'overTimeInfo']),
      bigImgArray() {
        let _arr = []
        this.maxPicIndexArray.forEach(num => {
          _arr.push(this.photoList[num])
        })
        return _arr
      },
      allTotalpage() {
        return this.photoList.length
      },
      showMessageMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.sendMessageMenuId)
      },
      showAllLendingMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.allLendingMenuId)
      },
      showDeductionsMenuId: function () {
        return judgeLimit(this.$store.state.setButtonLimitData, this.deductionsMenuId)
      }
    },
    created() {
      this.buttonLimit()
    },
    mounted() {
      // 期次列表
      this.getCaseDataOverDueList(this.postParam)
      // 催收记录
      this.getCollectionRecords({userId: this.$route.query.userId})
      // 获取用户信息
      this.getUserInfo()
      // 公司信息
      this.getCompany()
      // 逾期信息
      this.getOverTimeInfo({userId: this.$route.query.userId})
      // 获取照片
      this.getPhoto()
      // 案件进度等信息
      this.caseSpeed({userId: this.$route.query.userId})
    },
    methods: {
      ...mapActions(['getCaseDataOverDueList', 'getCollectionRecords', 'caseSpeed', 'getBackOne', 'buttonLimit', 'getOverTimeInfo']),
      sendMessage() {
        axios.post('dun/findTemplate', {userId: this.$route.query.userId}).then(res => {
          if (res.data.code === 200) {
            this.sendMessageParams.content = res.data.body.template
            this.sendMessageParams.userId = this.$route.query.userId
          } else {
            throw new Error('返回数据失败')
          }
        })
        this.sendMessageDialogVisible = true
      },
      // 取消发送短信
      cancelSendMessage() {
        this.sendMessageDialogVisible = false
        this.sendMessageParams.content = ''
      },
      // 发送短信
      onSubmit() {
        axios.post('dun/sendMessage', this.sendMessageParams).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        })
        this.sendMessageDialogVisible = false
      },
      // 催收记录列表
      handleClick(tab, event) {
        if (this.activeName && this.activeName !== '-1') {
          this.postParam.type = parseInt(this.activeName)
        } else {
          this.postParam.type = null
        }
        this.getCaseDataOverDueList(this.postParam)
      },
      // 用户信息
      async getUserInfo() {
        axios.post('user/userInfo', {userId: this.$route.query.userId}).then(res => {
          if (res.data.code === 200) {
            this.userInfo = res.data.body
          }
        })
      },
      // 公司信息
      async getCompany() {
        axios.post('user/companyAndeEmergencyInfo', {userId: this.$route.query.userId}).then(res => {
          if (res.data.code === 200) {
            this.companyInfo = res.data.body
          }
        })
      },
      // 写催记 获取数据
      collectionRecord(type, row) {
        this.formData.caseId = this.caseSpeedData.caseId
        this.formData.caseState = this.caseSpeedData.caseState
        this.$store.commit('setCollectionType', !this.collectionType)
        if (type === 1) {
          this.formData.name = this.userInfo.realName
          this.formData.relation = '本人'
          this.formData.phone = this.userInfo.phone
          // this.formData.nextCallTime = filterTime(this.$route.query.nextCallTime, 'dateTime')
        }
        if (type === 2) {
          this.formData.name = this.companyInfo.contract1AName
          this.formData.relation = this.companyInfo.contract1ARelationship
          this.formData.phone = this.companyInfo.contract1ANumber
          // this.formData.nextCallTime = filterTime(this.$route.query.nextCallTime, 'dateTime')
        }
        if (type === 3) {
          this.formData.name = this.companyInfo.companyName
          this.formData.relation = '公司'
          this.formData.phone = this.companyInfo.companyTel
          // this.formData.nextCallTime = filterTime(this.$route.query.nextCallTime, 'dateTime')
        }
        if (type === 4) {
          this.formData.name = row.name
          this.formData.relation = row.relation
          this.formData.phone = row.phone
          // this.formData.nextCallTime = filterTime(this.$route.query.nextCallTime, 'dateTime')
        }
        this.$store.commit('showDialogTableVisible', true)
        this.$store.commit('setFormData', this.formData)
      },
      // 单期扣款
      deductions(row) {
        if (row.visible) {
          this.getBackOne({id: row.phaseId})
        }
      },
      // 所有借款
      goToUserDetail() {
        this.isShowDetail = true
        this.$store.commit('setUserDetailDialogTableVisible', true)
      },
      // 获取图片列表
      // 查看照片
      async getPhoto() {
        axios.post('user/photo', {userId: this.$route.query.userId})
          .then(res => {
            if (res.data.code === 200) {
              let time = Date.parse(new Date())
              this.photoList = res.data.body.map(function (item) {
                item.url = `${item.url}?_=${time}`
                return item
              })
            }
          })
      },
      choiceImage(index) {
        let _index = this.isInArray(index)
        if (_index !== false) {
          this.maxPicIndexArray.splice(_index, 1)
        } else {
          if (this.maxPicIndexArray.length >= 3) {
            this.$message.error('最多只能选中3张图片')
          } else {
            this.maxPicIndexArray.push(index + (this.maxImageIndex - 1) * 10)
          }
        }
        setTimeout(() => this.Viewers.update(), 500)
      },
      maxImagePageChange(page) {
        this.maxImageIndex = parseInt(page)
      },
      returnPicName(val) {
        let _html = ''
        this.fixedField.photoType.forEach(item => {
          if (val) {
            if (item.code === val.type) {
              _html = `${item.value}
                       <span style="color:${item.color};padding-left:10px">
                        ${item.type}
                       </span>`
            }
          }
        })
        return _html
      },
      pageCutIndex(count, page) {
        let _index = (page - 1) * count
        let _arr = this.photoList
        let _newArray = []
        for (let i = _index; i < count * page; i++) {
          _arr[i] && _newArray.push(_arr[i])
        }
        return _newArray
      },
      isInArray(obj) {
        let _index = obj + (this.maxImageIndex - 1) * 10
        let _arr = this.maxPicIndexArray
        let i = _arr.length
        while (i--) {
          if (_arr[i] === _index) {
            return i
          }
        }
        return false
      }
    },
    watch: {
      dialogFormVisible(val) {
        if (val && this.dialogIsFirstShow) {
          setTimeout(() => {
            this.dialogIsFirstShow = false
            this.Viewers = new Viewer(this.$refs.picContent, {
              url: 'data-original'
            })
          }, 1)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .gray_border_right {
    border-right: 1px solid rgb(234, 234, 234);
  }

  .dialogStyle {
    h4 {
      display: block;
      float: left;
      margin-right: 20px;
      clear: both;
    }
  }

  .maxImage {
    margin-top: 80px;
    margin-left: 20px;
    float: left;
  }

  .smallPicList {
    margin-bottom: 40px;
    float: left;
    li {
      display: inline-block;
      width: 100px;
      height: 100px;
      position: relative;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
      p {
        position: absolute;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: .7;
        top: 0;
        left: 0;
        text-align: center;
        line-height: 100px;
        color: #fff;
      }
    }
  }

  .viewer-in {
    opacity: 0.8 !important;
  }
</style>
