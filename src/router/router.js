import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: resolve => require(['@/login'], resolve)
    },
    {
      path: '/test',
      name: 'test',
      component: resolve => require(['@/test'], resolve)
    },
    {
      path: '/nav',
      name: 'nav',
      component: resolve => require(['@/index'], resolve),
      children: [
        // 欢迎页面
        {
          path: 'index/welcome',
          name: 'index/welcome',
          component: resolve => require(['@/welcome'], resolve)
        },
        // 首页模块下的页面
        // 首页
        {
          path: 'index/index',
          name: 'index/index',
          component: resolve => require(['@/index/home/home'], resolve)
        },
        // 签约记录
        {
          path: 'index/signingRecord',
          name: 'index/signingRecord',
          component: resolve => require(['@/index/userManage/signingRecord'], resolve)
        },
        // 绑卡列表
        {
          path: 'index/stickList',
          name: 'index/stickList',
          component: resolve => require(['@/index/userManage/stickList'], resolve)
        },
        // 用户列表
        {
          path: 'index/userList',
          name: 'index/userList',
          component: resolve => require(['@/index/userManage/userlist'], resolve)
        },
        // 开户
        {
          path: 'index/accountList',
          name: 'index/accountList',
          component: resolve => require(['@/index/userManage/OpenAccount'], resolve)
        },
        // 用户详情
        {
          path: 'index/userDetail',
          name: 'index/userDetail',
          component: resolve => require(['@/index/userManage/userDetail'], resolve)
        },
        // 黑名单列表
        {
          path: 'index/blackList',
          name: 'index/blackList',
          component: resolve => require(['@/index/userManage/blackManage'], resolve)
        },
        // 授信管理
        {
          path: 'index/creditList',
          name: 'index/creditList',
          component: resolve => require(['@/index/creditManage'], resolve)
        },
        // 产品管理
        {
          path: 'index/productManage',
          name: 'index/productManage',
          component: resolve => require(['@/index/moneySide/productManage'], resolve)
        },
        // 资金方
        {
          path: 'index/funderList',
          name: 'index/funderList',
          component: resolve => require(['@/index/moneySide/moneySide'], resolve)
        },
        // 发标提交配置
        {
          path: 'index/bidingConfig',
          name: 'index/bidingConfig',
          component: resolve => require(['@/index/moneySide/sendOutConfig'], resolve)
        },
        // 标的
        {
          path: 'index/bidList',
          name: 'index/bidList',
          component: resolve => require(['@/index/bidList/bidList'], resolve)
        },
        // 短信模板
        {
          path: 'index/smsTemplateList',
          name: 'index/smsTemplateList',
          component: resolve => require(['@/index/message/messageModel'], resolve)
        },
        // 发送短信
        {
          path: 'index/smsRecordList',
          name: 'index/smsRecordList',
          component: resolve => require(['@/index/message/sendRecord'], resolve)
        },
        // 昵称敏感词
        {
          path: 'index/sensitiveWordList',
          name: 'index/sensitiveWordList',
          component: resolve => require(['@/index/nickname/nickname'], resolve)
        },
        // 用户反馈
        {
          path: 'index/feedbackList',
          name: 'index/feedbackList',
          component: resolve => require(['@/index/userfeedbackList/userfeedbackList'], resolve)
        },
        // 常见问题
        {
          path: 'index/commonProblemList',
          name: 'index/commonProblemList',
          component: resolve => require(['@/index/commonProblem/commonProblem'], resolve)
        },
        // 借款管理模块下的页面
        // 借款管理
        {
          path: 'index/loanManage',
          name: 'index/loanManage',
          component: resolve => require(['@/index/loanManage/loanManage'], resolve)
        },
        // 借款详情
        {
          path: 'index/loanDetail',
          name: 'index/loanDetail',
          component: resolve => require(['@/index/loanManage/loanDetail'], resolve)
        },
        // 账单管理模块下的页面
        // 账单管理页面
        {
          path: 'index/accountManage',
          name: 'index/accountManage',
          component: resolve => require(['@/index/accountManage/accountManage'], resolve)
        },
        // 账单详情
        {
          path: 'index/accountDetail',
          name: 'index/accountDetail',
          component: resolve => require(['@/index/accountManage/accountDetail'], resolve)
        },
        // 期次管理
        {
          path: 'index/installment',
          name: 'index/installment',
          component: resolve => require(['@/index/installmentManage/installmentManage'], resolve)
        },
        // 财务中心模块下的页面
        // 支付渠道
        {
          path: 'finance/payChannel',
          name: 'finance/payChannel',
          component: resolve => require(['@/payCenter/payChannel/payChannel'], resolve)
        },
        // 借款管理
        // 待放款列表
        {
          path: 'finance/waitReleaseList',
          name: 'finance/waitReleaseList',
          component: resolve => require(['@/payCenter/lendingManage/waitLending'], resolve)
        },
        // 自动放宽设置
        {
          path: 'finance/autoReleaseConfig',
          name: 'finance/autoReleaseConfig',
          component: resolve => require(['@/payCenter/lendingManage/autoLending'], resolve)
        },
        // 交易记录
        // 放款页面
        {
          path: 'finance/lending',
          name: 'finance/lending',
          component: resolve => require(['@/payCenter/transferRecord/lending'], resolve)
        },
        // 代扣还款页面
        {
          path: 'finance/reimbursement',
          name: 'finance/reimbursement',
          component: resolve => require(['@/payCenter/transferRecord/reimbursement'], resolve)
        },
        // 还款录入
        {
          path: 'finance/transfer',
          name: 'finance/transfer',
          component: resolve => require(['@/payCenter/transferRecord/breaksEntry'], resolve)
        },
        // 减免页面
        {
          path: 'finance/breaks',
          name: 'finance/breaks',
          component: resolve => require(['@/payCenter/transferRecord/breaks'], resolve)
        },
        // 流水中心
        {
          path: 'finance/fundsCenter',
          name: 'finance/fundsCenter',
          component: resolve => require(['@/payCenter/fundsCenter/waterCenter'], resolve)
        },
        // 交易详情
        {
          path: 'finance/transferDetail',
          name: 'finance/transferDetail',
          component: resolve => require(['@/payCenter/transferRecord/transferDetail'], resolve)
        },
        // 系统管理模块
        // 员工管理
        {
          path: 'security/employeesManage',
          name: 'security/employeesManage',
          component: resolve => require(['@/management/employeesManage'], resolve)
        },
        // 角色管理
        {
          path: 'security/roleManage',
          name: 'security/roleManage',
          component: resolve => require(['@/management/roleManage'], resolve)
        },
        // 新增角色
        {
          path: 'security/addRole',
          name: 'security/addRole',
          component: resolve => require(['@/management/addRole'], resolve)
        },
        // 推送失败列表
        {
          path: 'security/rviceInvokeRecords',
          name: 'security/rviceInvokeRecords',
          component: resolve => require(['@/management/rviceInvokeRecords'], resolve)
        },
        // 审批订单池
        {
          path: 'risk/auditList',
          name: 'risk/auditList',
          component: resolve => require(['@/letterOn/approvaLpool/approvalList'], resolve)
        },
        // 我的审批
        {
          path: 'risk/myAuditList',
          name: 'risk/myAuditList',
          component: resolve => require(['@/letterOn/myApproval/myApproval'], resolve)
        },
        // 词库管理
        {
          path: 'risk/wordsManage',
          name: 'risk/wordsManage',
          component: resolve => require(['@/letterOn/wordsManage/wordsManage'], resolve)
        },
        // SER管理
        {
          path: 'risk/serManage',
          name: 'risk/serManage',
          component: resolve => require(['@/letterOn/serManage/serManage'], resolve)
        },
        // 数据资源管理
        {
          path: 'risk/dataSourceManage',
          name: 'risk/dataSourceManage',
          component: resolve => require(['@/letterOn/dataResourceManage/dataResourceManage'], resolve)
        },
        // 授信订单
        {
          path: 'risk/letterOrder',
          name: 'risk/letterOrder',
          component: resolve => require(['@/letterOn/letterOrder'], resolve)
        },
        // dashboard
        {
          path: 'risk/dashboard',
          name: 'risk/dashboard',
          component: resolve => require(['@/letterOn/dashboard'], resolve)
        },
        {
          path: 'risk/photo',
          name: 'risk/photo',
          component: resolve => require(['@/letterOn/photo'], resolve)
        },
        // 客服部分
        // dashboard
        {
          path: 'service/dashboard',
          name: 'service/dashboard',
          component: resolve => require(['@/service/dashboard'], resolve)
        },
        // 放款异常
        // 放款异常
        {
          path: 'service/releaseList',
          name: 'service/releaseList',
          component: resolve => require(['@/service/lendingError'], resolve)
        },
        // 还款异常
        {
          path: 'service/repaymentList',
          name: 'service/repaymentList',
          component: resolve => require(['@/service/backError'], resolve)
        },
        // 还款详情
        {
          path: 'service/handleDetail',
          name: 'service/handleDetail',
          component: resolve => require(['@/service/handleDetail'], resolve)
        },
        // 催收
        {
          path: 'dun/index',
          name: 'dun/index',
          component: resolve => require(['@/collection/index'], resolve)
        },
        // 催收案件
        {
          path: 'dun/myCaseList',
          name: 'dun/myCaseList',
          component: resolve => require(['@/collection/my_case'], resolve)
        },
        // 我的催回
        {
          path: 'dun/myCaseBackList',
          name: 'dun/myCaseBackList',
          component: resolve => require(['@/collection/myCaseBackList'], resolve)
        },
        // 催回记录
        {
          path: 'dun/caseBackList',
          name: 'dun/caseBackList',
          component: resolve => require(['@/collection/caseBackRecord'], resolve)
        },
        // 案件详情
        {
          path: 'dun/caseDetail',
          name: 'dun/caseDetail',
          component: resolve => require(['@/collection/case_detail'], resolve)
        },
        // 案件库
        {
          path: 'dun/caseList',
          name: 'dun/caseList',
          component: resolve => require(['@/collection/caseLibrary'], resolve)
        },
        // 分案配置
        {
          path: 'dun/caseSetting',
          name: 'dun/caseSetting',
          component: resolve => require(['@/collection/divisionalConfiguration'], resolve)
        }
      ]
    }
  ]
})
