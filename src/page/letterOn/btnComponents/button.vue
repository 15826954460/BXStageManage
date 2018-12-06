<template>
  <!---->
  <div v-if="showBtn">
    <el-button
      v-for="(item, index) in fixedField.circulationList"
      :type="item.color" class="btn" size="small"
      style="min-width:80px"
      @click.stop="aboutCirculation(item.key, item.codeType)" :key="index">
      {{item.name}}
    </el-button>
  </div>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import axios from 'axios'
  import {judgeLimit} from '../../../untils/common'
  export default {
    props: ['ApprovalRecordMenuId'],
    data: function () {
      return {
        AuditInfo: {
          channel: '融360'
        },
        showBtn: this.$route.query.showBtn,
        orderId: this.$route.query.orderId,
        type: this.$route.query.type,
        pageType: this.$route.query.pageType,
        codeTypeOptions: null
      }
    },
    computed: {
      ...mapState(['fixedField', 'circulation'])
    },
    methods: {
      ...mapActions(['getLetterRecordsList']),
      // 关于流转
      aboutCirculation(key, codeType) {
        this.$store.commit('setCodeType', codeType)
        this.$store.commit('changeRightWidth', false)
        // 发送短息
        if (key === 0) {
          this.$store.commit('clickSms', true)
        }
        // 备注
        if (key === 1) {
          this.$store.commit('clickRemark', true)
        }
        // 通过
        if (key === 2) {
          this.$store.commit('clickPass', true)
          this.fetch()
        }
        // 流转
        if (key === 3) {
          this.$store.commit('clickCirculation', true)
          this.$store.commit('resetCirculationTypeStatus', !this.circulation.resetCirculationType)
          this.fetch()
        }
        // 退出
        if (key === 4) {
          // 退出
          this.exit()
        }
      },
      // 过滤child
      deleteChild(val) {
        for (var i = 0; i < val.length; i++) {
          if (!val[i].child.length) {
            val[i].child = null
          } else {
            this.deleteChild(val[i].child)
          }
        }
        return val
      },
      // 获取数据
      updateData(val, dataArr) {
        for (var i = 0; i < val.length; i++) {
          if (val[i].child && val[i].child.length > 0) {
            this.updateData(val[i].child, dataArr)
          } else {
            dataArr.push(val[i])
          }
        }
      },
      // 获取流转列表 原因码 的接口
      fetch() {
        axios.post('audit/auditinfolist', {
          codeType: this.circulation.codeType
        }).then(res => {
          if (parseInt(res.data.code) === 200) {
            let dataArr = []
            let data = this.deleteChild(res.data.body)
            if (this.circulation.codeType === 3 || this.circulation.codeType === 1 || this.circulation.codeType === 5) {
              this.updateData(data, dataArr)
              this.codeTypeOptions = dataArr
            } else {
              this.codeTypeOptions = data
            }
            if (this.AuditInfo.channel === '融360' && this.circulation.codeType === 3) {
              this.codeTypeOptions[0].disabled = true
            }
            // 初始原因骂的类型
            this.$store.commit('initCodeTypeOptions', this.codeTypeOptions)
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 权限检测
      buttonQuit(val) {
        return judgeLimit(this.$store.state.setButtonLimitData, val)
      },
      // 退出
      exit() {
        axios.post('audit/exit', {
          orderId: this.$route.query.orderId
        }).then(res => {
          if (parseInt(res.data.code) === 200) {
            this.$store.commit('closeCirculation', false)
            this.$store.commit('changeRightWidth', true)
            // 更新审批记录列表
            if (this.buttonQuit(Number.parseInt(this.$route.query.ApprovalRecordMenuId))) {
              this.getLetterRecordsList({orderId: this.$route.query.orderId})
            }
            if (parseInt(this.pageType) === 2) {
              this.$router.push({path: '/nav/risk/auditList'})
            } else {
              this.$router.push({path: '/nav/risk/myAuditList'})
            }
            return
          }
          this.$message.error(res.data.message)
        })
      }
    },
    watch: {
      'circulation.codeType': {
        handler: function (val, oldVal) {
          this.$store.commit('initCodeTypeOptions', [])
          // if (this.buttonQuit(Number.parseInt(this.ApprovalRecordMenuId))) {
            this.fetch()
          // }
        },
        // 深度监听
        deep: true
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
